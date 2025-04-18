import type {
	BetterAuthClientPlugin,
	BetterAuthOptions,
	Session,
	User,
} from "better-auth";
import type { BetterFetchOption } from "@better-fetch/fetch";
import type { Socket } from "socket.io-client";

export const socketClient = () => {
	return {
		id: "socket",
		getActions($fetch, $store) {
			return {
				initSocketIO: async (
					socket: Socket,
					fetchOptions?: BetterFetchOption,
				) => {
					socket.on(
						"better-auth:validate-session",
						async (responseCb: (sessionToken: string | null) => void) => {
							const session = await $fetch<{ session: Session; user: User }>(
								`${options.basePath || "/api/auth"}/get-session`,
								fetchOptions,
							);
							responseCb(session.data?.session.token || null);
						},
					);
				},
			};
		},
	} satisfies BetterAuthClientPlugin;
};
