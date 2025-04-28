import type { BetterAuthClientPlugin } from "better-auth";
import type { feedback } from ".";

export const feedbackClient = () => {
	return {
		id: "feedback",
		$InferServerPlugin: {} as ReturnType<typeof feedback>,
	} satisfies BetterAuthClientPlugin;
};
