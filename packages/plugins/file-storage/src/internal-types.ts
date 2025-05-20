import type { FileRoute } from "./types";
import type { TransformPath } from "./utils";
import type { createAuthEndpoint } from "better-auth/api";
import type { z } from "zod";

export type UploadReturnType = {
	fileStorageURL: string;
	providerURL: string;
};

export type DeleteReturnType = void;

export type EndpointPair = {
	upload: ReturnType<
		typeof createAuthEndpoint<
			`/file-storage/upload/${string}`,
			{
				method: "POST";
				body: z.ZodType<File, z.ZodTypeDef, File>;
			},
			UploadReturnType
		>
	>;
	delete: ReturnType<
		typeof createAuthEndpoint<
			`/file-storage/delete/${string}`,
			{ method: "POST" },
			DeleteReturnType
		>
	>;
};

type PrefixedEndpoints<Path extends string> = {
	[K in keyof EndpointPair as `${Extract<K, string>}${TransformPath<Path>}`]: EndpointPair[K];
};

export type FileRouterToEndpoints<R extends Record<string, FileRoute>> = {
	[K in keyof R & string]: PrefixedEndpoints<K>;
};

export type Merged<T> = {
	[K in keyof T]: T[K];
}[keyof T];
