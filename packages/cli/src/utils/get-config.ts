import { loadConfig } from "c12";
import type { betterAuth, BetterAuthOptions } from "better-auth";
import { logger } from "better-auth";
import path from "node:path";
// @ts-ignore
import babelPresetTypescript from "@babel/preset-typescript";
// @ts-ignore
import babelPresetReact from "@babel/preset-react";
import fs, { existsSync } from "node:fs";
import { BetterAuthError } from "better-auth";
import { addSvelteKitEnvModules } from "./add-svelte-kit-env-modules";
import { getTsconfigInfo } from "./get-tsconfig-info";
import { getCommonAuthLocations } from "./get-common-auth-locations";

const possiblePaths = getCommonAuthLocations([
	"auth.ts",
	"auth.tsx",
	"auth.js",
	"auth.jsx",
	"auth.server.js",
	"auth.server.ts",
]);

function getPathAliases(cwd: string): Record<string, string> | null {
	const tsConfigPath = path.join(cwd, "tsconfig.json");
	if (!fs.existsSync(tsConfigPath)) {
		return null;
	}
	try {
		const tsConfig = getTsconfigInfo(cwd);
		const { paths = {}, baseUrl = "." } = tsConfig.compilerOptions || {};
		const result: Record<string, string> = {};
		const obj = Object.entries(paths) as [string, string[]][];
		for (const [alias, aliasPaths] of obj) {
			for (const aliasedPath of aliasPaths) {
				const resolvedBaseUrl = path.join(cwd, baseUrl);
				const finalAlias = alias.slice(-1) === "*" ? alias.slice(0, -1) : alias;
				const finalAliasedPath =
					aliasedPath.slice(-1) === "*"
						? aliasedPath.slice(0, -1)
						: aliasedPath;

				result[finalAlias || ""] = path.join(resolvedBaseUrl, finalAliasedPath);
			}
		}
		addSvelteKitEnvModules(result);
		return result;
	} catch (error) {
		console.error(error);
		throw new BetterAuthError("Error parsing tsconfig.json");
	}
}
/**
 * .tsx files are not supported by Jiti.
 */
export const jitiOptions = (cwd: string) => {
	const alias = getPathAliases(cwd) || {};
	return {
		transformOptions: {
			babel: {
				presets: [
					[
						babelPresetTypescript,
						{
							isTSX: true,
							allExtensions: true,
						},
					],
					[babelPresetReact, { runtime: "automatic" }],
				],
			},
		},
		extensions: [".ts", ".tsx", ".js", ".jsx"],
		alias,
	};
};

type BAInstance = ReturnType<typeof betterAuth>;

export async function getConfig<T extends boolean>({
	cwd,
	configPath,
	shouldThrowOnError = false,
	shouldReturnFullAuthInstance = false as T,
}: {
	cwd: string;
	configPath?: string;
	shouldThrowOnError?: boolean;
	shouldReturnFullAuthInstance?: T;
}): Promise<T extends true ? BAInstance | null : BetterAuthOptions | null> {
	try {
		let configFile: BAInstance | null = null;
		if (configPath) {
			let resolvedPath: string = path.join(cwd, configPath);
			if (existsSync(configPath)) resolvedPath = configPath; // If the configPath is a file, use it as is, as it means the path wasn't relative.
			const { config } = await loadConfig<{
				auth: BAInstance;
				default?: BAInstance;
			}>({
				configFile: resolvedPath,
				dotenv: true,
				jitiOptions: jitiOptions(cwd),
			});
			if (!config.auth && !config.default) {
				if (shouldThrowOnError) {
					throw new Error(
						`Couldn't read your auth config in ${resolvedPath}. Make sure to default export your auth instance or to export as a variable named auth.`,
					);
				}
				logger.error(
					`[#better-auth]: Couldn't read your auth config in ${resolvedPath}. Make sure to default export your auth instance or to export as a variable named auth.`,
				);
				process.exit(1);
			}
			configFile = config.auth || config.default || null;
		}

		if (!configFile) {
			for (const possiblePath of possiblePaths) {
				try {
					const { config } = await loadConfig<{
						auth: BAInstance;
						default?: BAInstance;
					}>({
						configFile: possiblePath,
						jitiOptions: jitiOptions(cwd),
					});
					const hasConfig = Object.keys(config).length > 0;
					if (hasConfig) {
						configFile = config.auth || config.default || null;
						if (!configFile) {
							if (shouldThrowOnError) {
								throw new Error(
									"Couldn't read your auth config. Make sure to default export your auth instance or to export as a variable named auth.",
								);
							}
							logger.error("[#better-auth]: Couldn't read your auth config.");
							console.log("");
							logger.info(
								"[#better-auth]: Make sure to default export your auth instance or to export as a variable named auth.",
							);
							process.exit(1);
						}
						break;
					}
				} catch (e) {
					if (
						typeof e === "object" &&
						e &&
						"message" in e &&
						typeof e.message === "string" &&
						e.message.includes(
							"This module cannot be imported from a Client Component module",
						)
					) {
						if (shouldThrowOnError) {
							throw new Error(
								`Please remove import 'server-only' from your auth config file temporarily. The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
							);
						}
						logger.error(
							`Please remove import 'server-only' from your auth config file temporarily. The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
						);
						process.exit(1);
					}
					if (shouldThrowOnError) {
						throw e;
					}
					logger.error("[#better-auth]: Couldn't read your auth config.", e);
					process.exit(1);
				}
			}
		}
		//@ts-ignore
		return shouldReturnFullAuthInstance ? configFile : configFile?.options;
	} catch (e) {
		if (
			typeof e === "object" &&
			e &&
			"message" in e &&
			typeof e.message === "string" &&
			e.message.includes(
				"This module cannot be imported from a Client Component module",
			)
		) {
			if (shouldThrowOnError) {
				throw new Error(
					`Please remove import 'server-only' from your auth config file temporarily. The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
				);
			}
			logger.error(
				`Please remove import 'server-only' from your auth config file temporarily. The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
			);
			process.exit(1);
		}
		if (shouldThrowOnError) {
			throw e;
		}

		logger.error("Couldn't read your auth config.", e);
		process.exit(1);
	}
}

export { possiblePaths };
