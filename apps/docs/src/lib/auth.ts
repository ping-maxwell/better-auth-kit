import { betterAuth } from "better-auth";
import { apiKey, createAuthMiddleware, openAPI, organization, username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";
import { legalConsent } from "@better-auth-kit/legal-consent";

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
		// waitlist({
		//   enabled: true,
		//   waitlistEndConfig: {
		//     event: "max-signups-reached",
		//     onWaitlistEnd: () => {
		//       console.log("Waitlist complete!");
		//     },
		//   },
		// }),
		organization(),
		openAPI(),
		apiKey(),
		username(),
		nextCookies(),
	],
	databaseHooks: {
		user: {
			create: {
				after: async (user, ctx) => {
					//@ts-ignore - erroring because `getActiveOrganization` is not defined
					const organization = await getActiveOrganization(user.id);
					if (!organization) {
						auth.api.createOrganization({
							body: {
								name: "My Organization",
								slug: "my-organization",
								userId: user.id,
							},
						});
					}
				},
			},
		},
	},
});
