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

auth.api.uploadProfileImage({
	body: new File([], "hello.png", { type: "image/png" }),
});
auth.api.deleteProfileImage();

auth.api.uploadProfileBanner();
auth.api.deleteProfileBanner();

export type FileStoragePaths = typeof auth.$Infer.FileStoragePaths;
