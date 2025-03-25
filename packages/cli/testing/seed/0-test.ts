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
			"test",
		],
	},
};

export const seed = Seed(async ({ get }) => {
	const first_name = await get($.firstname());
	const last_name = await get($.lastname());

	const isBanned = await get($.randomBoolean({ probability: 0.1 }));


	return {
		test: table({
			name: $.custom(() => `${first_name} ${last_name}`),
			first_name: $.custom(() => first_name),
			last_name: $.custom(() => last_name),

			banned: $.custom(() => isBanned),
			banReason: $.custom(() => isBanned ? "test" : null),
			banExpires: $.custom(() => isBanned ? get($.randomDate("future")) : null),
		}),
	};
});
