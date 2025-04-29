import { Command } from "commander";
import { z } from "zod";
import { getConfig } from "../../utils/get-config";

export const dbCommand = new Command("db")
	.option(
		"--config <config>",
		"The path to the auth configuration file. defaults to the first `auth.ts` file found.",
	)
	.action(dbAction);

const optionSchema = z.object({
	config: z.string().optional(),
});

async function dbAction(options: z.infer<typeof optionSchema>) {
	const opts = optionSchema.parse(options);

	const auth = await getConfig({
		cwd: process.cwd(),
		configPath: opts.config,
		shouldThrowOnError: true,
		shouldReturnFullAuthInstance: true,
	});

	if (!auth) {
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

	console.log(auth);
}
