import type { User } from "better-auth";
import type { FieldAttribute } from "better-auth/db";
import type { ProfileImageEntry } from "./schema";

/**
 * Storage provider interface for profile images, allowing you
 * to use any storage provider you want.
 */
export interface StorageProvider {
	/**
	 * Upload an image file
	 */
	uploadImage: (params: {
		file: File;
		userId: string;
	}) => Promise<{ url: string; key: string }>;

	/**
	 * Delete an image from storage
	 */
	deleteImage?: (params: {
		key: string;
		url: string;
		userId: string;
	}) => Promise<void>;
}

export interface ProfileImageOptions {
	/**
	 * Storage provider to use for image uploads
	 * If not provided, will use UploadThing as the default
	 */
	storageProvider?: StorageProvider;

	/**
	 * Maximum file size in bytes
	 * @default 5242880 (5MB)
	 */
	maxSize?: number;

	/**
	 * Allowed file types
	 * @default ["image/jpeg", "image/png", "image/webp"]
	 */
	allowedTypes?: string[];

	/**
	 * Optional function to determine if a user is allowed to upload an image
	 * @default undefined (all users allowed)
	 */
	canUploadImage?: (user: User) => boolean | Promise<boolean>;

	/**
	 * Custom schema configuration
	 */
	schema?: {
		profileImage?: {
			modelName?: string;
			fields?: Record<string, string>;
		};
	};

	/**
	 * Additional fields to add to the profile image schema
	 */
	additionalFields?: Record<string, FieldAttribute>;

	/**
	 * Callback function that gets executed server-side when an image is uploaded
	 * @param params Object containing profile image entry and user
	 */
	onImageUploaded?: (params: {
		profileImage: ProfileImageEntry;
		user: User;
	}) => void | Promise<void>;

	/**
	 * Optional function to generate the image filename
	 * @default function that uses userId and timestamp
	 */
	generateFilename?: (params: {
		userId: string;
		originalFilename: string;
	}) => string;
}
