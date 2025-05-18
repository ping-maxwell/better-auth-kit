import type { UTApi } from "uploadthing/server";
import type { StorageLogger, StorageProvider } from "../types";

export class UploadThingProvider implements StorageProvider {
	utapi: UTApi;
	constructor(UTAPI: UTApi) {
		this.utapi = UTAPI;
	}

	async uploadImage(
		params: { file: File; userId: string },
		logger: StorageLogger,
	): Promise<{
		url: string;
		key: string;
		size: number;
	}> {
		const { file, userId } = params;
		try {
			const ext = file.name.split(".").pop();
			const newFile = new File([file], `${userId}.${ext}`, {
				type: file.type,
			});
			logger.info(
				`[BETTER-AUTH-KIT: Profile Image]: Uploading file:`,
				newFile.name,
			);

			// Upload the file using UploadThing
			const response = await this.utapi.uploadFiles([newFile], {
				metadata: { userId },
			});

			const fileData = response[0];
			if (!fileData || fileData.error) {
				throw new Error("Failed to upload image");
			}

			return {
				url: fileData.data.url,
				key: fileData.data.key,
				size: fileData.data.size,
			};
		} catch (error) {
			logger.error("Error uploading image:", error);
			throw new Error("Failed to upload image");
		}
	}

	async deleteImage(
		params: {
			imageURL: string;
			userId: string;
		},
		logger: StorageLogger,
	): Promise<void> {
		const { imageURL } = params;

		try {
			// Delete the file using UploadThing
			await this.utapi.deleteFiles([imageURL]);
		} catch (error) {
			logger.error("Error deleting image:", error);
			throw new Error("Failed to delete image");
		}
	}
}
