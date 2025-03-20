import type { InferOptionSchema, User } from "better-auth";
import type { ReverifyEmailEndpointContext } from "./routes/email";
import type { emailreverification } from "./schema";

type ReverifyType = "link" | "otp";

interface ReverifyEmailParamsBase {
	user: User;
	type: ReverifyType;
}

interface ReverifyLinkEmailParams extends ReverifyEmailParamsBase {
	type: "link";
	url: string;
}

interface ReverifyOTPEmailParams extends ReverifyEmailParamsBase {
	type: "otp";
	code: string;
}

export type ReverifyEmailParams =
	| ReverifyLinkEmailParams
	| ReverifyOTPEmailParams;

export interface ReverifyOptions<EmailEnabled extends boolean> {
	email?: {
		/**
		 * Whether to enable email reverification.
		 *
		 * @default false
		 */
		enabled: EmailEnabled;
		/**
		 * Optionally disable magic link reverification.
		 *
		 * @default false
		 */
		disableMagicLink?: boolean;
		/**
		 * Optionally disable OTP reverification.
		 *
		 * @default false
		 */
		disableOTP?: boolean;
		/**
		 * Callback to send a reverification email.
		 */
		sendReverificationEmail?: (
			params: ReverifyEmailParams,
			ctx: ReverifyEmailEndpointContext,
		) => void | Promise<void>;
		/**
		 * Custom schema for the email reverification table.
		 */
		schema?: InferOptionSchema<typeof emailreverification>;
	};
}

export interface EmailReverification {
	id: string;
	userId: string;
	createdAt: Date;
	type: ReverifyType;
	value: string;
}
