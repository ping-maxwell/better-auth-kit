import { createAuthClient } from "better-auth/react";
import { waitlistClient } from "better-auth-waitlist/client";

export const authClient = createAuthClient({
  plugins: [waitlistClient()],
});
