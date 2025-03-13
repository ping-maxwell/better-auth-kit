import { betterAuth } from "better-auth";
import { convexAdapter } from "./../src";
import { fullApi } from "../convex/_generated/api";

export const auth = betterAuth({
	database: convexAdapter(),
	plugins: [],
	//... other options
});
fullApi;
