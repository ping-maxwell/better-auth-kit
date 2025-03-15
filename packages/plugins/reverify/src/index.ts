import type { BetterAuthPlugin } from "better-auth";
import {
	APIError,
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";

export const ERROR_CODES = {
	NO_SESSION: "No session found.",
} as const;

export const reverify = () => {
	return {
		id: "reverify",
		endpoints: {
			reverifyPassword: createAuthEndpoint(
				"/reverifyPassword",
				{
					method: "POST",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					const session = ctx.context.session;

					if (!session) {
						throw new APIError("UNAUTHORIZED", {
							message: ERROR_CODES.NO_SESSION,
						});
					}

					const validPassword = await ctx.context.password.checkPassword(
						session.user.id,
						ctx,
					);

					return ctx.json({ valid: validPassword });
				},
			),
		},
	} satisfies BetterAuthPlugin;
};
