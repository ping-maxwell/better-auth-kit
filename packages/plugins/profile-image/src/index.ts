import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";
import type { BetterAuthPlugin } from "better-auth";
import {
	APIError,
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import type { ProfileImageOptions } from "./types";
import { detectFileTypeFromBlob, detectImageFormatFromBase64 } from "./utils";

export * from "./client";
export * from "./storage-providers/uploadthing";
export * from "./types";

export const ERROR_CODES = {
	FILE_TOO_LARGE: "File is too large",
	INVALID_FILE_TYPE: "Invalid file type",
	USER_NOT_LOGGED_IN: "User must be logged in to upload a profile image",
	USER_NOT_FOUND: "User not found",
	USER_NOT_ALLOWED: "You are not allowed to upload a profile image",
	INVALID_BLOB: "Invalid blob image value.",
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
		trustedImageOrigins: options?.trustedImageOrigins ?? undefined,
	} satisfies ProfileImageOptions;

	return {
		id: "profileImage",
		$ERROR_CODES: ERROR_CODES,
		endpoints: {
			uploadProfileImage: createAuthEndpoint(
				"/profile-image/upload",
				{
					method: "POST",
					body: z.instanceof(Blob),
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
					const blob = ctx.body;
					const result = await detectFileTypeFromBlob(blob);

					if (!result) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.INVALID_BLOB,
						});
					}
					const { ext, mime } = result;

					const file = new File([blob], `${user.id}${ext}`, {
						type: mime,
					});

					// Validate file size
					if (file.size > opts.maxSize) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.FILE_TOO_LARGE,
						});
					}

					const allowedTypes =
						typeof opts.allowedTypes === "function"
							? await opts.allowedTypes(ctx.context.session)
							: opts.allowedTypes;

					// Validate file type
					if (!allowedTypes.includes(file.type)) {
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
		init(ctx) {
			return {
				options: {
					databaseHooks: {
						user: {
							update: {
								async before(user) {
									if (user.image !== null) {
										const validator = z.string().url();
										const result = validator.safeParse(user.image);
										if (!result.success) {
											ctx.logger.error(
												`[BETTER-AUTH-KIT: Profile Image]: User "${user.id}" tried to update their profile image with an invalid image URL:`,
												user.image,
											);
											throw new APIError("FORBIDDEN", {
												message: "Invalid image URL",
											});
										}

										const origin = new URL(result.data).origin;
										if (opts.trustedImageOrigins && !opts.trustedImageOrigins.includes(origin)) {
											ctx.logger.error(
												`[BETTER-AUTH-KIT: Profile Image]: User "${user.id}" tried to update their profile image with an unauthorized image origin:`,
												user.image,
											);
											throw new APIError("FORBIDDEN", {
												message: "Unauthorized image origin",
											});
										}
									}
									return {
										data: user,
									};
								},
							},
							create: {
								async before(user) {
									if(user.image !== null){
										const validator = z.string().url();
										const result = validator.safeParse(user.image);
										if(!result.success){
											ctx.logger.error(`[BETTER-AUTH-KIT: Profile Image]: User "${user.id}" tried to create their profile image with an invalid image URL:`, user.image);
											throw new APIError("FORBIDDEN", {
												message: "Invalid image URL",
											});
										}
										const origin = new URL(result.data).origin;
										if(opts.trustedImageOrigins && !opts.trustedImageOrigins.includes(origin)){
											ctx.logger.error(`[BETTER-AUTH-KIT: Profile Image]: User "${user.id}" tried to create their profile image with an unauthorized image origin:`, user.image);
											throw new APIError("FORBIDDEN", {
												message: "Unauthorized image origin",
											});
										}
									}
									return {
										data: user,
									};
								},
							}
						},
					},
				},
			};
		},
	} satisfies BetterAuthPlugin;
};

/**
 * Convert a file to a base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result?.toString().split(",")[1];
			if (!result) throw new Error("Failed to read file");
			resolve(result);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
