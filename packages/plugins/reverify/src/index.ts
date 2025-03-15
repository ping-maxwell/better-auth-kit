import type { BetterAuthPlugin } from "better-auth";
import {
	APIError,
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import { z } from "zod";

export const ERROR_CODES = {
	NO_SESSION: "No session found.",
} as const;

export const reverify = () => {
	return {
		id: "reverify",
		endpoints: {
			reverifyPassword: createAuthEndpoint(
				"/reverify/password",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: z.object({
						password: z.string(),
					}),
				},
				async (ctx) => {
					const session = ctx.context.session;

					if (!session) {
						throw new APIError("UNAUTHORIZED", {
							message: ERROR_CODES.NO_SESSION,
						});
					}
					let validPassword = false;
					try {
						validPassword = await ctx.context.password.checkPassword(
							session.user.id,
							ctx,
						);
					} catch (error: unknown) {
						console.error(error);
						if (
							error instanceof APIError &&
							error?.body?.code === "INVALID_PASSWORD"
						) {
							return ctx.json({ valid: false });
						}
						throw error;
					}

					return ctx.json({ valid: validPassword });
				},
			),
		},
	} satisfies BetterAuthPlugin;
};
