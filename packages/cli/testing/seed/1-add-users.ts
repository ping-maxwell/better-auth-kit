import { Seed, users } from "@better-auth-kit/seed";

export const seed = Seed({
	...users(),
});
