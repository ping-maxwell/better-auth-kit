import chalk from "chalk";
import dts from "bun-plugin-dts";
import { resolve } from "node:path";

export type Config = {
	entrypoints?: string[];
	enableDts?: boolean;
};

export async function build({
	entrypoints = ["./src/index.ts"],
	enableDts = false,
}: Config = {}) {
	const start = Date.now();
	const res = await Bun.build({
		format: "esm",
		target: "node",
		outdir: resolve(process.cwd(), "dist"),
		minify: true,
		sourcemap: "external",
		entrypoints: entrypoints.map((entrypoint) =>
			resolve(process.cwd(), entrypoint),
		),
		packages: "external",
		plugins: [...(enableDts ? [dts()] : [])],
	});
	res.logs.forEach((log) => {
		console.log(chalk.gray(log));
	});
	if (res.success) {
		console.log(
			`${chalk.greenBright("Success!")}`,
			chalk.gray(`${Date.now() - start}ms`),
		);
	} else {
		console.error(
			`${chalk.redBright("Failed!")}`,
			chalk.gray(`${Date.now() - start}ms`),
		);
	}
}
