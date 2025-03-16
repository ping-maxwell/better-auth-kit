import type { Session, User } from "./auth";
import { seed, funcs, table } from "@better-auth-kit/seed";

export default seed(
	{
		user: table<User>(
			{
				id: funcs.uuid(),
				name: funcs.first_and_lastname(),
				email: funcs.email(),
				emailVerified: funcs.boolean({ probability: 0.5 }),
				createdAt: funcs.date(),
				updatedAt: funcs.date(),
			},
			{ count: 10000 },
		),
		session: table<Session>({
			id: funcs.uuid(),
			userId: funcs.forignKey({ model: "user", field: "id", unique: true }),
			createdAt: funcs.date(),
			updatedAt: funcs.date(),
			expiresAt: funcs.date(),
			token: funcs.uuid(),
			ipAddress: funcs.string(() => "127.0.0.1"),
			userAgent: funcs.string(() => "my-user-agent"),
		}),
	},
	{
		deleteRowsBeforeSeeding: {
			enabled: true,
			rows: ["session", "user"],
		},
	},
);
