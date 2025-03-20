import type { BetterAuthClientPlugin } from "better-auth";
import type { reverify } from "./index";

type ReverifyPlugin = typeof reverify;

export const reverifyClient = () => {
	return {
		id: "reverify",
		$InferServerPlugin: {} as ReturnType<ReverifyPlugin>,
		pathMethods: {
			"/reverify/password": "POST",
			"/reverify/send-email": "POST",
			"/reverify/verify-email-otp": "POST",
			"/reverify/is-verified": "GET",
		},
	} satisfies BetterAuthClientPlugin;
};
