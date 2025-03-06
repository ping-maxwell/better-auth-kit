import { betterAuth } from "better-auth";
import { apiKey, openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { waitlist } from "better-auth-waitlist";
import Database from "better-sqlite3";
import { legalConsent } from "better-auth-legal-consent";

export const auth = betterAuth({
	database: new Database("./test.db"),
	emailAndPassword: {
		enabled: true,
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
		openAPI(),
		apiKey(),
		legalConsent({
			requireTOS: true,
		}),
		nextCookies(),
	],
});
