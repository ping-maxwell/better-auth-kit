import { Command } from "commander";
import { z } from "zod";
import Configstore from "configstore";
import open from "open";
import path from "node:path";
import chalk from "chalk";

const optionSchema = z.object({
	path: z.string().optional(),
	framework: z.string().optional(),
	d: z.boolean(),
});

const reproAction = async (options: z.infer<typeof optionSchema>) => {
	const opts = optionSchema.parse(options);
	const config = new Configstore("bak-repo", { path: undefined });
	if (opts.d) {
		const targetPath = path.join(
			process.cwd().replace("testing", ""),
			"/testing/reproduction",
		);
		config.set("path", targetPath);
		console.log(
			`⚠️ Since you're on dev mode, we've set the reproduction folder at:`,
			chalk.yellowBright("\n" + targetPath),
		);
	}

	if (!opts.framework) {
		const url = new URL(
			"/reproduction",
			opts.d ? "http://localhost:3001" : "https://better-auth-kit.com",
		).toString();
		await open(url);
		console.log(
			`✅ Your browser should had opened to ${chalk.cyanBright(url)}.`,
		);
		process.exit(0);
	}
};

export const reproCommand = new Command("repro")
	.option(
		"--path <path>",
		"The path to the root directory where reproduction projects are created.",
	)
	.option("--framework <framework>", "The framework to use.")
	.option("-d", "Whether to run in dev mode.", false)
	.action(reproAction);
