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
	 * Upload a file
	 */
	uploadFile: (
		params: {
			file: File;
		},
		logger: StorageLogger,
	) => Promise<{ url: string; key: string }>;

	/**
	 * Delete a file from storage
	 */
	deleteFile: (
		params: {
			/**
			 * Can either be a file storage URL or a provider URL
			 */
			url: string;
		},
		logger: StorageLogger,
	) => Promise<void>;
}

export interface FileStorageOptions<
	FileRouter extends { [key: string]: FileRoute },
> {
	/**
	 * Storage provider to use for file uploads
	 */
	storageProvider: StorageProvider;
	/**
	 * An object of routes which define the rules of file uploads.
	 */
	fileRouter: FileRouter;
}

export type FileRoute = {
	/**
	 * Maximum file size in bytes
	 * @default 5242880 (5MB)
	 */
	maxSize?:
		| number
		| ((session: { user: User; session: Session }) => number | Promise<number>);

	/**
	 * Allowed file MIME types
	 * By default, all MIME types are allowed. However, we recommend specifying the allowed types to avoid unexpected or unwanted file types.
	 */
	allowedTypes?:
		| string[]
		| ((session: { user: User; session: Session }) =>
				| string[]
				| Promise<string[]>);

	/**
	 * Optional function to determine if a user/request is allowed to upload a file.
	 */
	canUpload?: (
		session: { user: User; session: Session } | null,
		request: Request,
	) => boolean | Promise<boolean>;

	/**
	 * Optional function to determine if a user/request is allowed to delete a file.
	 */
	canDelete?: (
		session: { user: User; session: Session } | null,
		request: Request,
	) => boolean | Promise<boolean>;
};
