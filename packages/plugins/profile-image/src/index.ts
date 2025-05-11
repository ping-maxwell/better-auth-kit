import { generateId, type BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, sessionMiddleware } from "better-auth/api";
import {
	mergeSchema,
	type FieldAttribute,
	type InferFieldsInput,
} from "better-auth/db";
import { z, type ZodRawShape, type ZodTypeAny } from "zod";
import { schema, type ProfileImageEntry } from "./schema";
import { UploadThingProvider } from "./storage-providers/uploadthing";
import type { ProfileImageOptions } from "./types";

export * from "./client";
export * from "./schema";
export * from "./storage-providers/uploadthing";
export * from "./types";

export const ERROR_CODES = {
	FILE_TOO_LARGE: "File is too large",
	INVALID_FILE_TYPE: "Invalid file type",
	USER_NOT_LOGGED_IN: "User must be logged in to upload a profile image",
	USER_NOT_FOUND: "User not found",
	USER_NOT_ALLOWED: "You are not allowed to upload a profile image",
	FILE_REQUIRED: "File is required",
	PROFILE_IMAGE_NOT_FOUND: "Profile image not found",
} as const;

export const profileImage = (options?: ProfileImageOptions) => {
	const opts = {
		storageProvider: options?.storageProvider ?? new UploadThingProvider(),
		maxSize: options?.maxSize ?? 5 * 1024 * 1024, // 5MB default
		allowedTypes: options?.allowedTypes ?? [
			"image/jpeg",
			"image/png",
			"image/webp",
		],
		canUploadImage: options?.canUploadImage,
		schema: options?.schema,
		additionalFields: options?.additionalFields ?? {},
		onImageUploaded: options?.onImageUploaded,
		generateFilename:
			options?.generateFilename ??
			((params) => {
				const { userId, originalFilename } = params;
				const timestamp = Date.now();
				const extension = originalFilename.split(".").pop() || "";
				return `${userId}_${timestamp}.${extension}`;
			}),
	} satisfies ProfileImageOptions;

	// Start with a deep copy of the schema
	const baseSchema = {
		profileImage: {
			...schema.profileImage,
			fields: {
				...schema.profileImage.fields,
			},
		},
	};

	// Now merge with user-provided schema
	const merged_schema = mergeSchema(baseSchema, opts.schema);
	merged_schema.profileImage.fields = {
		...merged_schema.profileImage.fields,
		...opts.additionalFields,
	};

	type ProfileImageEntryModified = ProfileImageEntry &
		InferFieldsInput<typeof opts.additionalFields>;

	const model = Object.keys(merged_schema)[0];

	return {
		id: "profileImage",
		schema: merged_schema,
		$ERROR_CODES: ERROR_CODES,
		endpoints: {
			uploadProfileImage: createAuthEndpoint(
				"/profile-image/upload",
				{
					method: "POST",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					// Check for authentication
					if (!ctx.context.session?.user.id) {
						throw ctx.error("UNAUTHORIZED", {
							message: ERROR_CODES.USER_NOT_LOGGED_IN,
						});
					}

					const user = ctx.context.session.user;

					// Check if user is allowed to upload an image
					if (opts.canUploadImage) {
						const isAllowed = await Promise.resolve(opts.canUploadImage(user));
						if (!isAllowed) {
							throw ctx.error("FORBIDDEN", {
								message: ERROR_CODES.USER_NOT_ALLOWED,
							});
						}
					}

					// Get file from request
					const formData = await ctx.request!.formData();
					const file = formData.get("file") as File | null;

					if (!file) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.FILE_REQUIRED,
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
					const filename = opts.generateFilename({
						userId,
						originalFilename: file.name,
					});

					// Upload file using storage provider
					let url: string;
					let key: string;
					try {
						const res = await opts.storageProvider.uploadImage({
							file,
							userId,
						});
						url = res.url;
						key = res.key;
					} catch (error) {
						console.error(
							"#BETTER_AUTH_KIT: Failed to upload image with Storage Provider:",
							error,
						);
						throw ctx.error("INTERNAL_SERVER_ERROR", {
							message: "Failed to upload image",
						});
					}

					// Store file information in database
					const profileImageData: Omit<
						ProfileImageEntryModified,
						"id" | "createdAt" | "updatedAt"
					> = {
						userId,
						url,
						key,
						filename,
						mimeType: file.type,
						size: file.size,
					};

					// Add any additional fields from form data
					const additionalFields: Record<string, any> = {};
					Object.keys(opts.additionalFields).forEach((field) => {
						const value = formData.get(field);
						if (value !== null) {
							additionalFields[field] = value;
						}
					});

					const profileImageEntry =
						await ctx.context.adapter.create<ProfileImageEntryModified>({
							model,
							data: {
								id: generateId(),
								...profileImageData,
								...additionalFields,
								createdAt: new Date(),
								updatedAt: new Date(),
							} as ProfileImageEntryModified,
						});

					// Call onImageUploaded handler if provided
					if (opts.onImageUploaded && user) {
						await Promise.resolve(
							opts.onImageUploaded({
								profileImage: profileImageEntry,
								user,
							}),
						);
					}

					return ctx.json(profileImageEntry);
				},
			),

			deleteProfileImage: createAuthEndpoint(
				"/profile-image/delete/:id",
				{
					method: "DELETE",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					const { id } = ctx.params;

					// Check for authentication
					if (!ctx.context.session?.user) {
						throw ctx.error("UNAUTHORIZED", {
							message: ERROR_CODES.USER_NOT_LOGGED_IN,
						});
					}

					const user = ctx.context.session.user;

					// Find the profile image entry
					const profileImages =
						await ctx.context.adapter.findMany<ProfileImageEntryModified>({
							model,
							where: [{ field: "id", value: id, operator: "eq" }],
							limit: 1,
						});

					const profileImage =
						profileImages.length > 0 ? profileImages[0] : null;

					if (!profileImage) {
						return ctx.json({ success: true });
					}

					// Check if the user owns this image
					if (profileImage.userId !== user.id) {
						throw ctx.error("FORBIDDEN", {
							message: "You are not allowed to delete this image",
						});
					}

					// Delete from storage provider if possible
					if (opts.storageProvider.deleteImage && profileImage.key) {
						await opts.storageProvider.deleteImage({
							key: profileImage.key,
							url: profileImage.url,
							userId: user.id,
						});
					}

					// Delete from database
					await ctx.context.adapter.delete({
						model,
						where: [{ field: "id", value: id, operator: "eq" }],
					});

					return ctx.json({ success: true });
				},
			),

			getUserProfileImage: createAuthEndpoint(
				"/profile-image/user/:userId",
				{
					method: "GET",
				},
				async (ctx) => {
					const { userId } = ctx.params;

					// Find the latest profile image for user
					const profileImages =
						await ctx.context.adapter.findMany<ProfileImageEntryModified>({
							model,
							where: [{ field: "userId", value: userId, operator: "eq" }],
							sortBy: { field: "createdAt", direction: "desc" },
							limit: 1,
						});

					if (profileImages.length === 0) {
						return ctx.error("NOT_FOUND", {
							message: ERROR_CODES.PROFILE_IMAGE_NOT_FOUND,
						});
					}

					return ctx.json(profileImages[0]);
				},
			),
		},
	} satisfies BetterAuthPlugin;
};

function convertAdditionalFieldsToZodSchema(
	additionalFields: Record<string, FieldAttribute>,
) {
	const additionalFieldsZodSchema: ZodRawShape = {};
	for (const [key, value] of Object.entries(additionalFields)) {
		let res: ZodTypeAny;

		if (value.type === "string") {
			res = z.string();
		} else if (value.type === "number") {
			res = z.number();
		} else if (value.type === "boolean") {
			res = z.boolean();
		} else if (value.type === "date") {
			res = z.date();
		} else if (value.type === "string[]") {
			res = z.array(z.string());
		} else {
			res = z.array(z.number());
		}

		if (!value.required) {
			res = res.optional();
		}

		additionalFieldsZodSchema[key] = res;
	}
	return z.object(additionalFieldsZodSchema);
}
