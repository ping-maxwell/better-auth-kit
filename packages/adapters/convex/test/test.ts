import { betterAuth } from "better-auth";
import { convexAdapter } from "./../src";
import { fullApi } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.CONVEX_URL!);

export const auth = betterAuth({
	database: convexAdapter(client, { enable_debug_logs: true }),
	plugins: [],
	//... other options
});
