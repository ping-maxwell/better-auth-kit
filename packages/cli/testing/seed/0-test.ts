import { $, Seed, table, users, type SeedConfig } from "@better-auth-kit/seed";

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

export const seed = Seed(({ get }) => {
	const first_name = get($.firstname());
	const last_name = get($.lastname());

	return {
		test: table({
			name: $.custom(() => `${first_name} ${last_name}`),
			first_name: $.custom(() => first_name),
			last_name: $.custom(() => last_name),
		}),
	};
});



