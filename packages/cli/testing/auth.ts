import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
	database: new Database("test.db"),
	emailAndPassword: {
		enabled: true,
	},
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
