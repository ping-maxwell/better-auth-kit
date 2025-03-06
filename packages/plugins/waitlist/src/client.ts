import type { BetterAuthClientPlugin } from "better-auth";
import type { waitlist } from ".";

export const waitlistClient = () => {
	return {
		id: "waitlist",
		$InferServerPlugin: {} as ReturnType<typeof waitlist>,
	} satisfies BetterAuthClientPlugin;
};
