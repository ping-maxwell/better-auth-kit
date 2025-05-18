import { createAuthClient } from "better-auth/react";
import { profileImageClient } from "@better-auth-kit/profile-image";

export const authClient = createAuthClient({
	plugins: [profileImageClient()],
});
