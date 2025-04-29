import { Command } from "commander";
import { getConfig, jitiOptions } from "../../utils/get-config";
import { z } from "zod";
import yoctoSpinner from "yocto-spinner";
import path from "node:path";
import { getCommonAuthLocations } from "../../utils/get-common-auth-locations";
import { existsSync, lstatSync, readdirSync } from "node:fs";
import { loadConfig } from "c12";
import type { AuthContext } from "better-auth";
import type { SeedConfig } from "@better-auth-kit/seed";
import chalk from "chalk";
import prompt from "prompts";

const optionSchema = z.object({
	cwd: z.string(),
	config: z.string().optional(),
	runAll: z.boolean().optional(),
});

const seedAction = async (options: z.infer<typeof optionSchema>) => {
	const opts = optionSchema.parse(options);

	const spinner = yoctoSpinner({
		text: "Loading config...",
	}).start();
	const auth = await getConfig({
		cwd: opts.cwd,
		configPath: opts.config,
		shouldThrowOnError: true,
		shouldReturnFullAuthInstance: true,
	});

	if (auth === null) {
		spinner.error(
			"No config found. Please run this command in the root of your project. Otherwise, provide a --cwd flag to specificy the current working directory, or --config flag to specify the path to the config file.",
		);
		console.log(
			{ cwd: opts.cwd, configPath: opts.config },
			path.join(opts.cwd, opts.config ?? "auth.ts"),
		);
		return;
	}

	spinner.success("Auth config loaded");

	const seedFilePaths = getCommonAuthLocations(["seed.ts", "seed.js"]);
	const seedFolderPaths = getCommonAuthLocations(["seed"]);

	let hasSeedFile: string | false = false;
	let hasSeedFolder: string | false = false;

	const basePath = opts.config
		? path.dirname(path.join(opts.cwd, opts.config))
		: opts.cwd;
	for (const seedFolderPath of seedFolderPaths) {
		if (
			existsSync(path.join(basePath, seedFolderPath)) &&
			lstatSync(path.join(basePath, seedFolderPath)).isDirectory()
		) {
			hasSeedFolder = path.join(basePath, seedFolderPath);
		}
	}
	for (const seedFilePath of seedFilePaths) {
		if (existsSync(path.join(basePath, seedFilePath))) {
			hasSeedFile = path.join(basePath, seedFilePath);
		}
	}

	if (!hasSeedFile && !hasSeedFolder) {
		console.error(
			"No seed file found. Please create a `seed.ts` or `seed.js` file next to your `auth.ts` file.",
		);
		return;
	}
	const context = await auth.$context;

	if (hasSeedFolder) {
		const seedFiles = readdirSync(hasSeedFolder, "utf-8");
		let res: { seedFiles: string[] } = { seedFiles };
		if (!opts.runAll) {
			res = await prompt({
				type: "multiselect",
				name: "seedFiles",
				message: "Select the seed files you want to execute",
				choices: seedFiles.map((file) => ({
					title: file,
					value: file,
				})),
				instructions: false,
			});
		}
		for (const seedFile of res.seedFiles) {
			console.log(`Executing seed file: ${chalk.cyanBright(seedFile)}`);
			await executeSeedFile(path.join(hasSeedFolder, seedFile), opts, context);
			console.log();
		}
	} else if (hasSeedFile) {
		await executeSeedFile(hasSeedFile, opts, context);
	}
};
export const seedCommand = new Command("seed")
	.option("-c, --cwd <cwd>", "The working directory.", process.cwd())
	.option(
		"--config <config>",
		"The path to the auth configuration file. defaults to the first `auth.ts` file found.",
	)
	.option(`--run-all`, "Run all seed files in the seed folder.")
	.action(seedAction);

async function executeSeedFile(
	seedFilePath: string,
	opts: z.infer<typeof optionSchema>,
	context: AuthContext,
) {
	console.log(seedFilePath);
	const { config } = await loadConfig<{
		seed?: {
			execute: (ops: {
				context: AuthContext;
			}) => Promise<void>;
			setConfig: (config: SeedConfig | undefined) => void;
		};
		config?: SeedConfig;
	}>({
		configFile: seedFilePath,
		dotenv: true,
		jitiOptions: jitiOptions(opts.cwd),
		cwd: opts.cwd,
	});

	if (!config.seed) {
		console.error(
			chalk.redBright("Error: ") +
				"Missing `seed` export function in your seed file.",
		);
		return;
	}
	config.seed.setConfig(config.config);
	await config.seed.execute({ context });
}
