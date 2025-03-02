import { createAuthClient } from "better-auth/react";
import { waitlistClient } from "better-auth-waitlist";

export const authClient = createAuthClient({
  plugins: [waitlistClient()],
});
