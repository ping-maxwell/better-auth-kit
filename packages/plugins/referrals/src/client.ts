import type { BetterAuthClientPlugin } from "better-auth";
import type { referrals } from ".";

export const referralsClient = () => {
	return {
		id: "referrals",
		$InferServerPlugin: {} as ReturnType<typeof referrals>,
	} satisfies BetterAuthClientPlugin;
};
