import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";
import {
	profileImage,
	UploadThingProvider,
} from "@better-auth-kit/profile-image";
import { UTApi } from "uploadthing/server";
import "dotenv/config";

// const utapi = new UTApi({
// 	apiKey: process.env.UPLOADTHING_API_KEY!,
// });

export const auth = betterAuth({
	database: new Database("./test.db"),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	plugins: [
		// profileImage({
		// 	storageProvider: new UploadThingProvider(utapi),
		// }),
		nextCookies(),
	],
});
