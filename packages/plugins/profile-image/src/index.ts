import { z } from "zod";
import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import type { ProfileImageOptions } from "./types";

export * from "./client";
export * from "./storage-providers/uploadthing";
export * from "./types";
export * from "./utils";

export const ERROR_CODES = {
	FILE_TOO_LARGE: "File is too large",
	INVALID_FILE_TYPE: "Invalid file type",
	USER_NOT_LOGGED_IN: "User must be logged in to upload a profile image",
	USER_NOT_FOUND: "User not found",
	USER_NOT_ALLOWED: "You are not allowed to upload a profile image",
	MISSING_OR_INVALID_FILE: "Missing or invalid file",
	PROFILE_IMAGE_NOT_FOUND: "Profile image not found",
	MISSING_REQUEST_BODY:
		"Missing request body. This is likely caused by the endpoint being called from auth.api.",
	USER_DOES_NOT_OWN_IMAGE: "You are not allowed to delete this image",
	FAILED_TO_UPLOAD_IMAGE: "Failed to upload image",
} as const;

export const profileImage = (options: ProfileImageOptions) => {
	const opts = {
		storageProvider: options?.storageProvider,
		maxSize: options?.maxSize ?? 5 * 1024 * 1024, // 5MB default
		allowedTypes: options?.allowedTypes ?? [
			"image/jpeg",
			"image/png",
			"image/webp",
		],
		canUploadImage: options?.canUploadImage,
		onImageUploaded: options?.onImageUploaded,
	} satisfies ProfileImageOptions;

	return {
		id: "profileImage",
		$ERROR_CODES: ERROR_CODES,
		endpoints: {
			uploadProfileImage: createAuthEndpoint(
				"/profile-image/upload",
				{
					method: "POST",
					body: z.object({
						file: z.object({
							name: z.string(),
							type: z.string(),
							base64Image: z.string().base64(),
						}),
					}),
					use: [sessionMiddleware],
				},
				async (ctx) => {
					const user = ctx.context.session.user;

					// Check if user is allowed to upload an image
					if (opts.canUploadImage) {
						const isAllowed = await Promise.resolve(
							opts.canUploadImage(ctx.context.session),
						);
						if (!isAllowed) {
							throw ctx.error("FORBIDDEN", {
								message: ERROR_CODES.USER_NOT_ALLOWED,
							});
						}
					}

					const fileBuffer = Buffer.from(ctx.body.file.base64Image, "base64");
					const file = new File([fileBuffer], ctx.body.file.name, {
						type: ctx.body.file.type,
					});

					if (!file || !(file instanceof File)) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.MISSING_OR_INVALID_FILE,
						});
					}

					// Validate file size
					if (file.size > opts.maxSize) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.FILE_TOO_LARGE,
						});
					}

					// Validate file type
					if (!opts.allowedTypes.includes(file.type)) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.INVALID_FILE_TYPE,
						});
					}

					const userId = user.id;

					// Upload file using storage provider
					let url: string;
					let key: string;
					try {
						const res = await opts.storageProvider.uploadImage(
							{
								file,
								userId,
							},
							ctx.context.logger,
						);
						url = res.url;
						key = res.key;
					} catch (error) {
						ctx.context.logger.error(
							`[BETTER-AUTH-KIT: Profile Image]: User "${userId}" failed to upload image with Storage Provider:`,
							error,
						);
						throw ctx.error("INTERNAL_SERVER_ERROR", {
							message: ERROR_CODES.FAILED_TO_UPLOAD_IMAGE,
						});
					}

					// Call onImageUploaded handler if provided
					if (opts.onImageUploaded && user) {
						await Promise.resolve(
							opts.onImageUploaded({
								profileImage: {
									url,
									key,
								},
								user,
							}),
						);
					}

					// Update the user with the new image
					await ctx.context.adapter.update({
						model: "user",
						where: [{ field: "id", value: user.id }],
						update: {
							image: url,
						},
					});

					return ctx.json({
						success: true,
						image: {
							url,
							key,
						},
					});
				},
			),

			deleteProfileImage: createAuthEndpoint(
				"/profile-image/delete",
				{
					method: "POST",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					const user = ctx.context.session.user;

					if (!user.image) {
						return ctx.json({ success: true });
					}

					// Delete from storage provider if possible
					if (opts.storageProvider.deleteImage) {
						await opts.storageProvider.deleteImage(
							{
								imageURL: user.image,
								userId: user.id,
							},
							ctx.context.logger,
						);
						// Set the user.image to null
						await ctx.context.adapter.update({
							model: "user",
							where: [{ field: "id", value: user.id }],
							update: {
								image: null,
							},
						});
					}

					return ctx.json({ success: true });
				},
			),
		},
	} satisfies BetterAuthPlugin;
};
