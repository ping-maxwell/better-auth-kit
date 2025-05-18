import { fileTypeFromBuffer } from "file-type";

type ImageFormatInfo = {
	mime: string;
	extension: string;
	format: string;
};

export function detectImageFormatFromBase64(
	base64: string,
): ImageFormatInfo | null {
	const base64Clean = base64.startsWith("data:")
		? base64.split(",")[1]
		: base64;
	const buffer = Buffer.from(base64Clean, "base64");

	const hex = buffer.toString("hex").toUpperCase();
	const startsWith = (sig: string) => hex.startsWith(sig.replace(/ /g, ""));
	const includes = (sig: string) => hex.includes(sig.replace(/ /g, ""));

	if (startsWith("FFD8FF")) {
		return { mime: "image/jpeg", extension: ".jpg", format: "JPEG" };
	}
	if (startsWith("89504E470D0A1A0A")) {
		return { mime: "image/png", extension: ".png", format: "PNG" };
	}
	if (startsWith("474946383761")) {
		return { mime: "image/gif", extension: ".gif", format: "GIF87a" };
	}
	if (startsWith("474946383961")) {
		return { mime: "image/gif", extension: ".gif", format: "GIF89a" };
	}
	if (startsWith("52494646") && includes("57454250")) {
		return { mime: "image/webp", extension: ".webp", format: "WebP" };
	}
	if (startsWith("424D")) {
		return { mime: "image/bmp", extension: ".bmp", format: "BMP" };
	}
	if (startsWith("00000100")) {
		return { mime: "image/x-icon", extension: ".ico", format: "ICO" };
	}
	if (startsWith("49492A00")) {
		return { mime: "image/tiff", extension: ".tiff", format: "TIFF (LE)" };
	}
	if (startsWith("4D4D002A")) {
		return { mime: "image/tiff", extension: ".tiff", format: "TIFF (BE)" };
	}
	if (includes("6674797068656963") || includes("68656963")) {
		return { mime: "image/heic", extension: ".heic", format: "HEIC" };
	}

	return null;
}

export async function detectFileTypeFromBlob(blob: Blob) {
	const arrayBuffer = await blob.arrayBuffer(); // convert blob to ArrayBuffer
	const uint8Array = new Uint8Array(arrayBuffer); // required by file-type

	const fileType = await fileTypeFromBuffer(uint8Array);
	return fileType; // returns { ext: "png", mime: "image/png" } or undefined
}
