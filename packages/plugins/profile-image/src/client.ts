import type { BetterAuthClientPlugin } from "better-auth";
import type { profileImage } from ".";

export const profileImageClient = () => {
	return {
		id: "profileImage",
		$InferServerPlugin: {} as ReturnType<typeof profileImage>,
		fetchPlugins: [
			
		]
	} satisfies BetterAuthClientPlugin;
};

//TODO: Document the choice to compress the image on the client side.
export async function compressImage(
	file: File,
	quality = 0.7,
): Promise<Blob | null> {
	const img = await createImageBitmap(file);
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(img, 0, 0);
	return new Promise((resolve) =>
		canvas.toBlob(resolve, "image/jpeg", quality),
	);
}
