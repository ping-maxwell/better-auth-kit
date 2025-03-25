import { apiKeys, Seed } from "@better-auth-kit/seed";

export const seed = Seed({
	...apiKeys(),
});
