import {
	Seed,
	users,
	organizations,
	type SeedConfig,
} from "@better-auth-kit/seed";

export const config: SeedConfig = {
	deleteRowsBeforeSeeding: {
		enabled: true,
		models: [
			"session",
			"account",
			"member",
			"invitation",
			"team",
			"user",
			"organization",
		],
	},
};

export const seed = Seed({
	...users({}),
	...organizations(
		{},
		{
			createTeams: true,
			createInvitations: true,
		},
	),
});
