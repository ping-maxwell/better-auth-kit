import { createAuthClient } from "better-auth/react";
import {
	apiKeyClient,
	emailOTPClient,
	usernameClient,
} from "better-auth/client/plugins";
import { waitlistClient } from "@better-auth-kit/waitlist";
import { reverifyClient } from "@better-auth-kit/reverify/client";

export const authClient = createAuthClient({
	plugins: [
		waitlistClient(),
		apiKeyClient(),
		usernameClient(),
		emailOTPClient(),
		reverifyClient(),
	],
});
