import { betterAuth } from "better-auth";
import database from "better-sqlite3";
import { legalConsent } from "../src";

export const auth = betterAuth({
	database: database("test.db"),
	plugins: [
		legalConsent({
			requireTOS: true,
		}),
	],
	emailAndPassword: {
		enabled: true,
	},
});
