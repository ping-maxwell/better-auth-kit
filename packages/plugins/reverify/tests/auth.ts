import { betterAuth } from "better-auth";
import database from "better-sqlite3";
import { reverify } from "../src";

export const auth = betterAuth({
	database: database("test.db"),
	plugins: [reverify()],
	emailAndPassword: {
		enabled: true,
	},
});
