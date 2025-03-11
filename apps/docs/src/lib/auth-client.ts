import { createAuthClient } from "better-auth/react";
import { apiKeyClient, usernameClient } from "better-auth/client/plugins";
import { waitlistClient } from "@better-auth-kit/waitlist";

export const authClient = createAuthClient({
	plugins: [
		// waitlistClient(),
		apiKeyClient(),
		usernameClient(),
	],
});
