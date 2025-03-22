import chalk from "chalk";
import { build } from "./build";
import { watch } from "node:fs";
import { basename } from "node:path";

export async function buildDev(...args: Parameters<typeof build>) {
	const cwd = process.cwd();
	console.log(
		chalk.cyanBright(`Now watching:`),
		chalk.greenBright(cwd.replace(/[^$]*\/packages/, "/packages")),
	);
	console.log(chalk.gray(`${chalk.bold("dir:")} ${cwd}/src`));
	const srcWatcher = watch(
		`${cwd}/src`,
		{ recursive: true },
		async (event, filename) => {
			console.log("\nBuilding...", chalk.gray(filename));
			await build(...args);
		},
	);

	process.on("SIGINT", () => {
		srcWatcher.close();
		process.exit(0);
	});
}
