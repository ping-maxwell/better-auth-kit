import { logger, type BetterAuthPlugin } from "better-auth";
import {
	APIError,
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import { z } from "zod";

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
					let validPassword = false;
					try {
						validPassword = await ctx.context.password.checkPassword(
							session.user.id,
							ctx,
						);
					} catch (error: unknown) {
						logger.error(`[Reverify] Error checking password`, error);
						if (
							error instanceof APIError &&
							error?.body?.code === "INVALID_PASSWORD"
						) {
							logger.info(`[Reverify] Password is invalid`);
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
