import type { BetterAuthPlugin } from "better-auth";
import { reverifyPassword } from "./routes/password";
import { reverifyEmail } from "./routes/email";
import { isVerified } from "./routes/isVerified";
import { emailreverification } from "./schema";
import { mergeSchema } from "better-auth/db";
import type { ReverifyOptions } from "./types";
export * from "./types";

export const ERROR_CODES = {
	NO_SESSION: "No session found.",
} as const;

export const reverify = <EmailEnabled extends boolean = false>(
	options: ReverifyOptions<EmailEnabled> = {},
) => {
	const { email } = options;

	return {
		id: "reverify",
		endpoints: {
			reverifyPassword,
			isVerified,
			...reverifyEmail<EmailEnabled>({ email }),
		},
		schema: {
			...(email?.enabled
				? mergeSchema(emailreverification, options?.email?.schema)
				: {}),
		},
	} satisfies BetterAuthPlugin;
};
