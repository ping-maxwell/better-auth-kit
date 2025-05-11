import { UTApi } from "uploadthing/server";
import type { StorageProvider } from "../types";

const utapi = new UTApi();

export class UploadThingProvider implements StorageProvider {
	async uploadImage(params: { file: File; userId: string }): Promise<{
		url: string;
		key: string;
		size: number;
	}> {
		const { file, userId } = params;

		try {
			// Upload the file using UploadThing
			const response = await utapi.uploadFiles([file], {
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
			console.error("Error uploading image:", error);
			throw new Error("Failed to upload image");
		}
	}

	async deleteImage(params: {
		key?: string;
		url: string;
		userId: string;
	}): Promise<void> {
		const { key } = params;

		if (!key) {
			throw new Error("Image key is required for deletion");
		}

		try {
			// Delete the file using UploadThing
			await utapi.deleteFiles([key]);
		} catch (error) {
			console.error("Error deleting image:", error);
			throw new Error("Failed to delete image");
		}
	}
}
