import type { LiteralString } from "better-auth";
import { fileTypeFromBuffer } from "file-type";

export function transformPath<T extends LiteralString>(
	path: T,
): TransformPath<T> {
	const result = path
		.split(/[-/]/g)
		.map((segment, index) => {
			if (segment.length === 0) return ""; // handle leading separators
			return index === 0
				? segment.charAt(0).toUpperCase() + segment.slice(1)
				: segment.charAt(0).toUpperCase() + segment.slice(1);
		})
		.join("");

	return result as TransformPath<T>;
}

type CapitalizeFirst<S extends string> = S extends `${infer First}${infer Rest}`
	? `${Uppercase<First>}${Rest}`
	: S;

export type TransformPath<S extends string> = S extends `${infer Head}/${infer Tail}`
	? TransformPath<`${Head}${CapitalizeFirst<Tail>}`>
	: S extends `${infer Head}-${infer Tail}`
		? TransformPath<`${Head}${CapitalizeFirst<Tail>}`>
		: CapitalizeFirst<S>;

export async function detectFileTypeFromBlob(blob: Blob) {
	const arrayBuffer = await blob.arrayBuffer(); // convert blob to ArrayBuffer
	const uint8Array = new Uint8Array(arrayBuffer); // required by file-type

	const fileType = await fileTypeFromBuffer(uint8Array);
	return fileType; // returns { ext: "png", mime: "image/png" } or undefined
}

