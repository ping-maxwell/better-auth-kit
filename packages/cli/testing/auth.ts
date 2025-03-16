import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
	database: new Database("test.db"),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		{
			id: "adding-more-tables-to-db",
			schema: {
				test: {
					fields: {
						testStr: {
							type: "string",
						},
						testInt: {
							type: "number",
						},
						testBool: {
							type: "boolean",
						},
						testDate: {
							type: "date",
						},
					},
				},
			},
		},
	],
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
