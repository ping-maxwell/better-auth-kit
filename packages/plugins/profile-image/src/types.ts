import type { LogLevel, Session, User } from "better-auth";

export type StorageLogger = Record<
	LogLevel,
	(message: string, ...args: any[]) => void
>;

/**
 * Storage provider interface for profile images, allowing you
 * to use any storage provider you want.
 */
export interface StorageProvider {
	/**
	 * Upload an image file
	 */
	uploadImage: (
		params: {
			file: File;
			userId: string;
		},
		logger: StorageLogger,
	) => Promise<{ url: string; key: string }>;

	/**
	 * Delete an image from storage
	 */
	deleteImage?: (
		params: {
			imageURL: string;
			userId: string;
		},
		logger: StorageLogger,
	) => Promise<void>;
}

export interface ProfileImageOptions {
	/**
	 * Storage provider to use for image uploads
	 */
	storageProvider: StorageProvider;

	/**
	 * Maximum file size in bytes
	 * @default 5242880 (5MB)
	 */
	maxSize?: number;

	/**
	 * Allowed file types
	 * @default ["image/jpeg", "image/png", "image/webp"]
	 */
	allowedTypes?:
		| string[]
		| ((session: { user: User; session: Session }) =>
				| string[]
				| Promise<string[]>);

	/**
	 * Optional function to determine if a user is allowed to upload an image
	 * @default undefined (all users allowed)
	 */
	canUploadImage?: (session: { user: User; session: Session }) =>
		| boolean
		| Promise<boolean>;

	/**
	 * Callback function that gets executed server-side when an image is uploaded
	 * @param params Object containing profile image entry and user
	 */
	onImageUploaded?: (params: {
		profileImage: {
			url: string;
			key: string;
		};
		user: User;
	}) => void | Promise<void>;
}
