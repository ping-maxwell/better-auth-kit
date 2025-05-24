import { logger, type BetterAuthPlugin } from "better-auth";
import {
	APIError,
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import { z } from "zod";
import { tryCatch } from "@better-auth-kit/internal-utils";

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

					const { data: validPassword, error } = await tryCatch(
						ctx.context.password.checkPassword(session.user.id, ctx),
					);

					if (error) {
						logger.error(
							`[Better-Auth-Kit: Reverify] Error checking password`,
							error,
						);
						if (
							error instanceof APIError &&
							error?.body?.code === "INVALID_PASSWORD"
						) {
							logger.info(`[Better-Auth-Kit: Reverify] Password is invalid`);
							return ctx.json({ valid: false, newSession: null });
						}
						throw new APIError("INTERNAL_SERVER_ERROR", {
							message: "Something went wrong while checking the password",
						});
					}

					return ctx.json({ valid: validPassword });
				},
			),
		},
	} satisfies BetterAuthPlugin;
};
