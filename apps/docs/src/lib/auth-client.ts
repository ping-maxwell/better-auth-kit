import { createAuthClient } from "better-auth/react";
import {
	apiKeyClient,
	emailOTPClient,
	usernameClient,
} from "better-auth/client/plugins";
import { waitlistClient } from "@better-auth-kit/waitlist";
import { nextCookies } from "better-auth/next-js";

export const authClient = createAuthClient({
	plugins: [
		waitlistClient(),
		apiKeyClient(),
		usernameClient(),
		emailOTPClient(),
	],
});
