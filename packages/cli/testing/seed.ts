import {
	Seed,
	$,
	table,
	type SeedConfig,
	users,
	organizations,
} from "@better-auth-kit/seed";
import type { Session, User } from "./auth";
import type { Account } from "better-auth/types";

// export const seed = Seed({
// 	user: table<User>({
// 		id: $.uuid(),
// 		name: $.first_and_lastname(),
// 		email: $.email({ unique: true }),
// 		emailVerified: $.randomBoolean(),
// 		createdAt: $.randomDate(),
// 		updatedAt: $.randomDate(),
// 		banned: $.randomBoolean(),
// 		banReason: $.custom(() => ""),
// 		banExpires: $.randomDate(),
// 		role: $.randomChoice(
// 			$.custom(() => "admin"),
// 			$.custom(() => "user"),
// 		),
// 	}),
// 	session: table<Session>(
// 		{
// 			id: $.uuid(),
// 			userId: $.foreignKey({ model: "user", field: "id", unique: true }),
// 			createdAt: $.randomDate(),
// 			updatedAt: $.randomDate(),
// 			expiresAt: $.randomDate(),
// 			token: $.uuid(),
// 			ipAddress: $.custom(() => "127.0.0.1"),
// 			userAgent: $.custom(() => "my-user-agent"),
// 		},
// 		{
// 			count: 100,
// 		},
// 	),
// });

export const config: SeedConfig = {
	deleteRowsBeforeSeeding: {
		enabled: true,
		models: [
			"session",
			"account",
			"member",
			"invitation",
			"team",
			"organization",
			"user",
		],
	},
};

// export const seed = Seed({
// 	...users<{
// 		user: User;
// 		account: Account;
// 		session: Session;
// 	}>(
// 		{
// 			user: {
// 				banned: $.randomBoolean(),
// 				banReason: $.custom(() => ""),
// 				banExpires: $.randomDate(),
// 				role: $.randomChoice(
// 					$.custom(() => "admin"),
// 					$.custom(() => "user"),
// 				),
// 			},
// 		},
// 		{
// 			count: 10000,
// 		},
// 	),
// });

export const seed = Seed({
	...users({}, { count: 10000 }),
	...organizations(
		{},
		{
			// createInvitations: true,
			// createTeams: true,
			count: 10000,
		},
	),
});
