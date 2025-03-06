import { createAuthClient } from "better-auth/react";
import { apiKeyClient } from "better-auth/client/plugins";
import { waitlistClient } from "better-auth-waitlist";

export const authClient = createAuthClient({
	plugins: [waitlistClient(), apiKeyClient()],
});
