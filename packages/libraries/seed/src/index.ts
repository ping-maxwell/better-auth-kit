import chalk from "chalk";
import type { Adapter, AuthContext } from "better-auth";
import logupdate from "log-update";
import prompts from "prompts";
import type { ConvertToSeedGenerator, SeedPrimitiveValue } from "./types";
import type { SeedConfig } from "./config";
export * from "./types";
export { dataset as $ } from "./dataset";
export * from "./config";
export * from "./helpers";

export type Table = ReturnType<typeof table>;

let config: SeedConfig = {};
export function Seed(schema: Record<string, Table>) {
	return {
		setConfig: (seedConfig: SeedConfig) => {
			config = seedConfig;
		},
		execute: async (adapter: Adapter, context: AuthContext) => {
			const { deleteRowsBeforeSeeding = false } = config;
			if (deleteRowsBeforeSeeding && deleteRowsBeforeSeeding.enabled) {
				console.log();
				const { confirm } = await prompts({
					type: "confirm",
					name: "confirm",
					message: `Are you sure you want to delete all rows from tables: ${chalk.greenBright(
						deleteRowsBeforeSeeding.models.join(", "),
					)}?`,
				});
				if (!confirm) {
					console.log("Aborting...");
					return;
				}
				console.log(
					`Deleting all rows from tables: ${chalk.greenBright(
						deleteRowsBeforeSeeding.models.join(", "),
					)}`,
				);
				console.log();
				for (const model of deleteRowsBeforeSeeding.models) {
					logupdate(`Deleting all rows from ${chalk.cyanBright(model)}...`);
					await adapter.deleteMany({
						model,
						where: [],
					});
					logupdate(
						`${chalk.greenBright("✓")} Deleted all rows from ${chalk.cyanBright(
							model,
						)}.`,
					);
					logupdate.done();
				}
			}
			console.log();
			console.log(
				`Seeding ${chalk.greenBright(Object.keys(schema).length)} tables...`,
			);
			console.log();
			for (const [key, tableFn] of Object.entries(schema)) {
				logupdate.done();
				logupdate(
					`✋ Preparing to seed the next table...\n${chalk.gray(
						`(If you're using foreign keys, this may take a while.)`,
					)}`,
				);
				const { rows, modelName } = await tableFn({ adapter, context });
				const model = modelName ?? key;
				let index = 0;
				logupdate(
					`Seeding ${chalk.cyanBright(model)} with ${chalk.greenBright(
						rows.length,
					)} rows...`,
				);
				for (const row of rows) {
					index++;
					await adapter.create({
						model,
						data: row,
					});
					logupdate(
						`Seeded ${chalk.cyanBright(
							model,
						)}, rows ${chalk.bold(index)} of ${chalk.bold(rows.length)}`,
					);
				}
				logupdate(
					`${chalk.greenBright("✓")} Finished seeding ${chalk.cyanBright(
						model,
					)} with ${chalk.bold(rows.length)} rows.`,
				);
			}
		},
	};
}

export function table<
	TableSchema extends Record<string, SeedPrimitiveValue> = {},
>(
	table: ConvertToSeedGenerator<TableSchema>,
	options?: { modelName?: string; count?: number },
): ({
	adapter,
	context,
}: { adapter: Adapter; context: AuthContext }) => Promise<{
	modelName?: string;
	rows: Record<string, SeedPrimitiveValue>[];
}> {
	return async ({
		adapter,
		context,
	}: { adapter: Adapter; context: AuthContext }) => {
		const { modelName, count = 100 } = options ?? {};

		const rows: Record<string, SeedPrimitiveValue>[] = [];

		for (let i = 0; i < count; i++) {
			const cols: Record<string, SeedPrimitiveValue> = {};
			for (const key in table) {
				const value = table[key];
				if (typeof value === "function") {
					cols[key] = await value({ adapter, context });
				}
			}
			rows.push(cols);
		}

		return {
			modelName,
			rows,
		};
	};
}
