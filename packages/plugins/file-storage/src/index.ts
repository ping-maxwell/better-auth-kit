import { z } from "zod";
// import { fileTypeFromBuffer } from "file-type";
import type { BetterAuthPlugin, PrettifyDeep } from "better-auth";
import { APIError, createAuthEndpoint } from "better-auth/api";
import type { FileRoute, FileStorageOptions } from "./types";
import { transformPath } from "./utils";
import type {
	DeleteReturnType,
	Merged,
	UploadReturnType,
} from "./internal-types";
import type { FileRouterToEndpoints } from "./internal-types";
import { betterFetch } from "@better-fetch/fetch";

export * from "./client";
export * from "./types";

export const ERROR_CODES = {
	FILE_TOO_LARGE: "File is too large",
	INVALID_FILE_TYPE: "Invalid file type",
	USER_NOT_LOGGED_IN: "User must be logged in to upload a profile image",
	USER_NOT_FOUND: "User not found",
	USER_NOT_ALLOWED: "You are not allowed to upload a profile image",
	INVALID_BLOB: "Invalid blob image value.",
	FILE_NOT_FOUND: "File not found",
	MISSING_REQUEST_BODY:
		"Missing request body. This is likely caused by the endpoint being called from auth.api.",
	USER_DOES_NOT_OWN_IMAGE: "You are not allowed to delete this image",
	FAILED_TO_UPLOAD_IMAGE: "Failed to upload image",
} as const;

export const fileStorage = <FileRouter extends Record<string, FileRoute>>(
	opts: FileStorageOptions<FileRouter>,
) => {
	const { deleteFile, uploadFile } = opts.storageProvider;

	const endpoints = Object.fromEntries(
		Object.entries(opts.fileRouter).flatMap(([path, route]) => {
			const entries = Object.entries({
				[`upload${transformPath(path)}`]: createAuthEndpoint(
					`/file-storage/upload/${path}`,
					{ method: "POST", body: z.instanceof(File) },
					async (ctx): Promise<UploadReturnType> => {
						const baseURL = ctx.context.options.baseURL;
						const basePath = ctx.context.options.basePath;
						const file = ctx.body;

						ctx.context.logger.info(
							`[BETTER-AUTH-KIT: File Storage]: Uploading file:`,
							file.name,
						);

						const { key, url } = await uploadFile(
							{
								file,
							},
							ctx.context.logger,
						);

						return {
							fileStorageURL: `${baseURL}${basePath}/fs/${path}/${key}`,
							providerURL: url,
						};
					},
				),
				[`delete${transformPath(path)}`]: createAuthEndpoint(
					`/file-storage/delete/${path}`,
					{ method: "POST" },
					async (ctx): Promise<DeleteReturnType> => {},
				),
			});

			return entries;
		}),
	) as PrettifyDeep<Merged<FileRouterToEndpoints<FileRouter>>>;

	return {
		id: "file-storage",
		//@ts-ignore
		endpoints: {
			...endpoints,
			getFile: createAuthEndpoint(
				"/fs/:path/:key",
				{
					method: "GET",
					metadata: {
						client: false,
					},
				},
				async (ctx) => {
					const { path, key } = ctx.params;

					if (!path || !key) {
						throw new APIError("NOT_FOUND");
					}

					const file = await ctx.context.adapter.findOne<{ url: string }>({
						model: "fileStorage",
						where: [
							{
								field: "key",
								value: key,
								connector: "AND",
							},
							{
								field: "path",
								value: path,
							},
						],
						select: ["url"],
					});

					if (!file) {
						throw new APIError("NOT_FOUND");
					}

					const { data, error } = await betterFetch(file.url);

					if (error) {
						ctx.context.logger.error(
							`[Better-Auth-Kit: FileStorage] Failed to fetch file from URL: "${file.url}"\n`,
							error,
						);
						throw new APIError("INTERNAL_SERVER_ERROR");
					}

					return data;
				},
			),
		},
		$ERROR_CODES: ERROR_CODES,
		$Infer: {
			FileStoragePaths: {} as keyof typeof opts.fileRouter,
		},
	} satisfies BetterAuthPlugin;
};
