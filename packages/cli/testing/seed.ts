import { Seed, $, table, type SeedConfig, users } from "@better-auth-kit/seed";
import type { Session, User } from "./auth";
import type { Account } from "better-auth/types";

// export const seed = Seed({
// 	user: table<User>(
// 		{
// 			id: $.uuid(),
// 			name: $.first_and_lastname(),
// 			email: $.email({ unique: true }),
// 			emailVerified: $.boolean({ probability: 0.5 }),
// 			createdAt: $.randomDate(),
// 			updatedAt: $.randomDate(),
// 			banned: $.boolean({ probability: 0.5 }),
// 			banReason: $.string(() => ""),
// 			banExpires: $.randomDate(),
// 			role: $.randomChoice(
// 				$.string(() => "admin"),
// 				$.string(() => "user"),
// 			),
// 		},
// 		{ count: 10000 },
// 	),
// 	session: table<Session>(
// 		{
// 			id: $.uuid(),
// 			userId: $.foreignKey({ model: "user", field: "id", unique: true }),
// 			createdAt: $.randomDate(),
// 			updatedAt: $.randomDate(),
// 			expiresAt: $.randomDate(),
// 			token: $.uuid(),
// 			ipAddress: $.string(() => "127.0.0.1"),
// 			userAgent: $.string(() => "my-user-agent"),
// 		},
// 		{ count: 10000 },
// 	),
// });

export const config: SeedConfig = {
	deleteRowsBeforeSeeding: {
		enabled: true,
		models: ["session", "account", "user"],
	},
};

export const seed = Seed({
	...users<{
		user: User;
		account: Account;
		session: Session;
	}>(
		{
			user: {
				banned: $.boolean({ probability: 0.5 }),
				banReason: $.string(() => ""),
				banExpires: $.randomDate(),
				role: $.randomChoice(
					$.string(() => "admin"),
					$.string(() => "user"),
				),
			},
		},
		{
			count: 10000,
		},
	),
});
