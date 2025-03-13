import type { BetterAuthClientPlugin } from "better-auth";
import type { reverifyPassword } from "./index";

type ReverifyPasswordPlugin = typeof reverifyPassword;

export const reverifyClientPlugin = () => {
	return {
		id: "reverifyPassword",
		$InferServerPlugin: {} as ReturnType<ReverifyPasswordPlugin>,
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
