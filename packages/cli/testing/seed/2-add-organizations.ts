import { organizations, Seed, type SeedConfig } from "@better-auth-kit/seed";

export const seed = Seed({
	...organizations(),
});
