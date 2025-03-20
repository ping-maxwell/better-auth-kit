import {
	APIError,
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import {
	ERROR_CODES,
	type EmailReverification,
	type ReverifyOptions,
} from "../index";
import { z } from "zod";
import {
	generateId,
	type AuthContext,
	type EndpointContext,
	type Middleware,
} from "better-auth";

const reverifyEmailBodySchema = z.object({
	type: z.enum(["link", "otp"]).optional(),
});

export type ReverifyEmailEndpointContext = EndpointContext<
	"/reverify/send-email",
	{
		method: "POST";
		use: ((inputContext: {
			body?: any;
			query?: Record<string, any> | undefined;
			request?: Request | undefined;
			headers?: Headers | undefined;
			asResponse?: boolean | undefined;
			returnHeaders?: boolean | undefined;
			use?: Middleware[] | undefined;
		}) => Promise<{
			session: {
				session: Record<string, any> & {
					id: string;
					createdAt: Date;
					updatedAt: Date;
					userId: string;
					expiresAt: Date;
					token: string;
					ipAddress?: string | null | undefined;
					userAgent?: string | null | undefined;
				};
				user: Record<string, any> & {
					id: string;
					name: string;
					email: string;
					emailVerified: boolean;
					createdAt: Date;
					updatedAt: Date;
					image?: string | null | undefined;
				};
			};
		}>)[];
		body?: typeof reverifyEmailBodySchema;
	},
	AuthContext
>;

export const reverifyEmail = <EmailEnabled extends boolean>(opts: {
	email: ReverifyOptions<EmailEnabled>["email"];
}) => {
	const { email } = opts;
	const {
		enabled = false,
		disableMagicLink = false,
		disableOTP = false,
		sendReverificationEmail,
	} = email ?? {};

	return {
		sendReverificationEmail: createAuthEndpoint(
			"/reverify/send-email",
			{
				method: "POST",
				use: [sessionMiddleware],
				body: reverifyEmailBodySchema,
			},
			async (ctx) => {
				if (!enabled) {
					throw new APIError("BAD_REQUEST", {
						message: "Reverification email isn't enabled",
					});
				}
				const { type = disableOTP ? "link" : "otp" } = ctx.body ?? {};
				if (type === "link" && disableMagicLink) {
					throw new APIError("BAD_REQUEST", {
						message: "Magic link reverification isn't enabled",
					});
				}
				if (type === "otp" && disableOTP) {
					throw new APIError("BAD_REQUEST", {
						message: "Email OTP reverification isn't enabled",
					});
				}

				const session = ctx.context.session;

				if (!session) {
					throw new APIError("UNAUTHORIZED", {
						message: ERROR_CODES.NO_SESSION,
					});
				}
				if (!sendReverificationEmail) {
					ctx.context.logger.error(
						"[Reverify] send reverification function isn't provided.",
					);
					throw new APIError("NOT_IMPLEMENTED", {
						message: "Reverification email isn't fully implemented",
					});
				}
				if (type === "otp") {
					const code = generateOTPCode();
					await sendReverificationEmail(
						{
							code,
							type: "otp",
							user: session.user,
						},
						ctx,
					);

					await ctx.context.adapter.create<EmailReverification>({
						model:
							opts.email?.schema?.emailreverification?.modelName ??
							"emailreverification",
						data: {
							id: generateId(),
							createdAt: new Date(),
							type: "otp",
							userId: session.user.id,
							value: code,
						},
					});

					return ctx.json({
						status: true,
					});
				}
			},
		),
		verifyEmailOTP: createAuthEndpoint(
			"/reverify/verify-email-otp",
			{
				method: "POST",
				body: z.object({
					code: z.string(),
					email: z.string(),
				}),
			},
			async (ctx) => {
				// await ctx.context.internalAdapter.updateSession(ctx.context.session.session.token, {
				// 	createdAt: new Date()
				// });
			},
		),
	};
};

function generateOTPCode() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}
