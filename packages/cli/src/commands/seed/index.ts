import { Command } from "commander";
import { getConfig, jitiOptions } from "../../utils/get-config";
import { z } from "zod";
import yoctoSpinner from "yocto-spinner";
import path from "node:path";
import { getCommonAuthLocations } from "../../utils/get-common-auth-locations";
import { existsSync } from "node:fs";
import { loadConfig } from "c12";
import type { Adapter } from "better-auth";

const optionSchema = z.object({
	cwd: z.string(),
	configPath: z.string().optional(),
});

const seedAction = async (options: z.infer<typeof optionSchema>) => {
	const opts = optionSchema.parse(options);

	const spinner = yoctoSpinner({
		text: "Loading config...",
	}).start();

	const auth = await getConfig({
		cwd: opts.cwd,
		configPath: opts.configPath,
		shouldThrowOnError: true,
		shouldReturnFullAuthInstance: true,
	});

	if (auth === null) {
		spinner.error(
			"No config found. Please run this command in the root of your project. Otherwise, provide a --cwd flag to specificy the current working directory, or --config flag to specify the path to the config file.",
		);
		console.log(
			{ cwd: opts.cwd, configPath: opts.configPath },
			path.join(opts.cwd, opts.configPath ?? "auth.ts"),
		);
		return;
	}

	spinner.success("Config loaded");

	const seedFilePaths = getCommonAuthLocations(["seed.ts", "seed.js"]);

	let hasSeedFile: string | false = false;

	for (const seedFilePath of seedFilePaths) {
		if (existsSync(seedFilePath)) {
			hasSeedFile = path.join(opts.cwd, seedFilePath);
		}
	}

	if (!hasSeedFile) {
		spinner.error(
			"No seed file found. Please create a `seed.ts` or `seed.js` file next to your `auth.ts` file.",
		);
		return;
	}

	const { config } = await loadConfig<{
		fn: (adapter: Adapter) => Promise<void>;
	}>({
		configFile: hasSeedFile,
		dotenv: true,
		jitiOptions: jitiOptions(opts.cwd),
	});

	// spinner.success("Seed file executed successfully");
	const adapter = (await auth.$context).adapter;
	await config.fn(adapter);
};
export const seedCommand = new Command("seed")
	.option("-c, --cwd <cwd>", "The working directory.", process.cwd())
	.option(
		"--config <config>",
		"The path to the auth configuration file. defaults to the first `auth.ts` file found.",
	)
	.action(seedAction);
