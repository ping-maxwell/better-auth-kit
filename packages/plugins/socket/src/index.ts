import type { BetterAuthPlugin } from "better-auth";

export function socketPlugin() {
	return {
		id: "socket",
	} satisfies BetterAuthPlugin;
}
