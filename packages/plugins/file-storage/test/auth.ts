import { betterAuth } from "better-auth";
import { fileStorage } from "../src";

export const auth = betterAuth({
	plugins: [
		fileStorage({
			storageProvider: {} as any,
			fileRouter: {
				"profile-image": {},
				"profile-banner": {},
			},
		}),
	],
});

export type FileStoragePaths = typeof auth.$Infer.FileStoragePaths;
