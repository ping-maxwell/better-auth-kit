import { betterAuth } from "better-auth";
import { apiKey, openAPI, organization, username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";
import { legalConsent } from "@better-auth-kit/legal-consent";
import { reverify } from "@better-auth-kit/reverify";

export const auth = betterAuth({
	database: new Database("./test.db"),
	trustedOrigins: ["http://localhost:3000"],
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
		// waitlist({
		//   enabled: true,
		//   waitlistEndConfig: {
		//     event: "max-signups-reached",
		//     onWaitlistEnd: () => {
		//       console.log("Waitlist complete!");
		//     },
		//   },
		// }),
		reverify({
			email: {
				enabled: true,
				sendReverificationEmail(params, ctx) {
					if (params.type === "link") {
						console.log(
							`Send reverification link to ${params.user.email} with url ${params.url}`,
						);
					} else if (params.type === "otp") {
						console.log(
							`Send reverification otp to ${params.user.email} with code ${params.code}`,
						);
					}
				},
			},
		}),
		organization(),
		openAPI(),
		apiKey(),
		username(),
		nextCookies(),
	],
	emailVerification: {
		sendVerificationEmail: async ({ user, url, token }, request) => {
			console.log(
				`Send verification email to ${user.email} with url ${url} and token ${token}`,
			);
		},
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user, ctx) => {
					// auth.api.createOrganization({
					// 	body: {
					// 		name: "My Organization",
					// 		slug: "my-organization",
					// 		userId: user.id,
					// 	},
					// });
				},
			},
		},
	},
});
