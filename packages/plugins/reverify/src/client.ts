import type { BetterAuthClientPlugin } from "better-auth";
import type { reverify } from "./index";

type ReverifyPlugin = typeof reverify;

export const reverifyClientPlugin = () => {
	return {
		id: "reverify",
		$InferServerPlugin: {} as ReturnType<ReverifyPlugin>,
		getActions: ($fetch) => ({
			reverifyPassword: async (password: string) => {
				const { data, error } = await $fetch<{ valid: boolean }>(
					`/reverifyPassword`,
					{
						method: "POST",
						body: {
							password,
						},
					},
				);

				if (error) {
					return false;
				}

				return data.valid;
			},
		}),
	} satisfies BetterAuthClientPlugin;
};
