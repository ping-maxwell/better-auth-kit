import {
	APIError,
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import { ERROR_CODES } from "../index";
export const isVerified = createAuthEndpoint(
	"/reverify/is-verified",
	{
		method: "GET",
		use: [sessionMiddleware],
	},
	async (ctx) => {
		const session = ctx.context.session;

		if (!session) {
			throw new APIError("UNAUTHORIZED", {
				message: ERROR_CODES.NO_SESSION,
			});
		}

		const freshAge = ctx.context.options.session?.freshAge ?? 60 * 60 * 24;

		if (freshAge === 0) {
			return ctx.json({
				verified: true,
			});
		}

		const createdAt = session.session.createdAt;
		const current = new Date();
		const diff = current.getTime() - createdAt.getTime();
		const diffInMinutes = diff / (1000 * 60);

		if (diffInMinutes > freshAge) {
			return ctx.json({
				verified: false,
			});
		}

		return ctx.json({
			verified: true,
		});
	},
);
