import type { UTApi } from "uploadthing/server";
import type {
	StorageLogger,
	StorageProvider,
} from "@better-auth-kit/file-storage";

export class UploadThingProvider implements StorageProvider {
	utapi: UTApi;
	constructor(UTAPI: UTApi) {
		this.utapi = UTAPI;
	}

	async uploadFile(
		params: { file: File },
		logger: StorageLogger,
	): Promise<{
		url: string;
		key: string;
		size: number;
	}> {
		const { file } = params;
		try {
			const response = await this.utapi.uploadFiles([file]);

			const fileData = response[0];
			if (!fileData || fileData.error) {
				throw new Error("Failed to upload file");
			}

			return {
				url: fileData.data.url,
				key: fileData.data.key,
				size: fileData.data.size,
			};
		} catch (error) {
			logger.error("Error uploading file:", error);
			throw new Error("Failed to upload file");
		}
	}

	async deleteFile(
		params: {
			url: string;
		},
		logger: StorageLogger,
	): Promise<void> {
		const { url } = params;

		try {
			await this.utapi.deleteFiles([url]);
		} catch (error) {
			logger.error("Error deleting file:", error);
			throw new Error("Failed to delete file");
		}
	}
}
