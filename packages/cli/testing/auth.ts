import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { organization, admin, apiKey } from "better-auth/plugins";
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
						name: {
							type: "string",
						},
						first_name: {
							type: "string",
						},
						last_name: {
							type: "string",
						},
					},
				},
			},
		},
		organization({
			teams: {
				enabled: true,
			},
		}),
		admin(),
		apiKey(),
	],
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
