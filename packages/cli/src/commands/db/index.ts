import { Command } from "commander";
import { z } from "zod";
import { getConfig } from "../../utils/get-config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { betterAuth } from "better-auth";
import { dbExplorerPlugin } from "./database-explorer-plugin";
import cors from "cors";
import open from "open";

export const dbCommand = new Command("db")
	.option(
		"--config <config>",
		"The path to the auth configuration file. defaults to the first `auth.ts` file found.",
	)
	.option(
		"--dev",
		"Adds localhost:3001 to allowed origins for development mode.",
	)
	.action(dbAction);

const optionSchema = z.object({
	config: z.string().optional(),
	dev: z.boolean().optional(),
});

async function dbAction(options: z.infer<typeof optionSchema>) {
	const opts = optionSchema.parse(options);

	const usersAuth = await getConfig({
		cwd: process.cwd(),
		configPath: opts.config,
		shouldThrowOnError: true,
		shouldReturnFullAuthInstance: true,
	});

	if (!usersAuth) {
		throw new Error("No auth config found");
	}

	// Create an express server and run at a specific special port.
	// Use the user's auth config, provide the database plugin.
	// Configure express server to allow cors from the frontend url.
	// Add our frontend url to the trusted origins.
	// TODO: Update database plugin to be secure.
	// start the server.
	// return the url of the front-end.
	// use `open` lib to automatically open the front-end in the browser.

	const app = express();
	const port = 3572;

	const allowedOrigins = [
		"https://www.better-auth-kit.com",
		"https://better-auth-kit.com",
		"https://better-auth-kit.vercel.app",
		// Only enable this if you want to allow local testing of the Better-Auth-Kit DB explorer.
		...(opts.dev ? ["http://localhost:3001"] : []),
	].filter(Boolean);

	const auth = betterAuth({
		...usersAuth.options,
		plugins: [...(usersAuth.options.plugins ?? []), dbExplorerPlugin],
		trustedOrigins: allowedOrigins,
	});
	app.use(
		cors({
			origin(requestOrigin, callback) {
				if (allowedOrigins.indexOf(requestOrigin || "") !== -1) {
					callback(null, true);
				} else {
					callback(new Error(`Not allowed by CORS domain: "${requestOrigin}"`));
				}
			},
			methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
			credentials: true, // Allow credentials (cookies, authorization headers, etc.)
		}),
	);
	app.all("/api/auth/*splat", toNodeHandler(auth));

	app.use(express.json());

	app.listen(port, () => {
		const url = opts.dev
			? `http://localhost:3001/database`
			: `https://www.better-auth-kit.com/database`;
		console.log(`Visit the database explorer at ${url}`);
		open(url);
	});
}
