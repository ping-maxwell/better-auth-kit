import {
	Seed,
	users,
	organizations,
	apiKeys,
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
			"apikey",
			"user",
			"organization",
		],
	},
};

export const seed = Seed({
	...users(),
	...organizations(),
	...apiKeys(),
});
