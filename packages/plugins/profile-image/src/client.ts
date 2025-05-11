import type { BetterAuthClientPlugin } from "better-auth";
import type { profileImage } from ".";

export const profileImageClient = () => {
	return {
		id: "profileImage",
		$InferServerPlugin: {} as ReturnType<typeof profileImage>,
	} satisfies BetterAuthClientPlugin;
};
