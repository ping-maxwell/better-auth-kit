import chalk from "chalk";
import type { Adapter, AuthContext } from "better-auth";
import logupdate from "log-update";
import prompts from "prompts";
import type {
	ConvertToSeedGenerator,
	SeedGenerator,
	SeedPrimitiveValue,
} from "./types";
import type { SeedConfig } from "./config";
export * from "./types";
export { dataset as $ } from "./dataset";
export * from "./config";
export * from "./helpers";

export type Table = ReturnType<typeof table>;

export interface SeedHelpers {
	get: <T extends SeedGenerator<any>>(fn: T) => ReturnType<T>;
}

let config: SeedConfig = {};
export function Seed(
	schema_:
		| Record<string, Table>
		| ((helpers: SeedHelpers) => Record<string, Table>),
) {
	return {
		setConfig: (seedConfig: SeedConfig | undefined) => {
			config = seedConfig ?? {};
		},
		execute: async ({ context }: { context: AuthContext }) => {
			const adapter = context.adapter;
			const { deleteRowsBeforeSeeding = false, rows: defaultRowsCount = 100 } =
				config;
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
					try {
						await adapter.deleteMany({
							model,
							where: [],
						});
					} catch (error: any) {
						if (
							error?.message ===
							"Cannot read properties of undefined (reading 'modelName')"
						) {
							logupdate(
								`${chalk.yellowBright("✓")} Missing model ${chalk.cyanBright(
									model,
								)}, skipped.`,
							);
							logupdate.done();
							continue;
						}
						console.log(
							chalk.redBright(
								`Error deleting all rows from model ${chalk.cyanBright(model)}:`,
							),
						);
						console.error(error);
						process.exit(1);
					}
					logupdate(
						`${chalk.greenBright("✓")} Deleted all rows from ${chalk.cyanBright(
							model,
						)}.`,
					);
					logupdate.done();
				}
			}

			const schema =
				typeof schema_ === "function"
					? schema_({
							get(fn) {
								return fn({ adapter, context });
							},
						})
					: schema_;

			console.log();
			console.log(
				`Seeding ${chalk.greenBright(Object.keys(schema).length)} tables...`,
			);
			console.log();
			for (const [key, tableFn] of Object.entries(schema)) {
				logupdate.done();
				logupdate(
					`✋ Preparing to seed the next table... ${chalk.gray(
						`(If you're using foreign keys, this may take a while.)`,
					)}`,
				);

				const { rows, modelName } = await tableFn({
					adapter,
					context,
					defaultRowsCount,
				});
				const model = modelName ?? key;
				let index = 0;
				logupdate(
					`Seeding ${chalk.cyanBright(model)} with ${chalk.greenBright(
						rows.length,
					)} rows...`,
				);
				let skipped = false;
				for (const row of rows) {
					if (skipped) {
						continue;
					}
					index++;
					try {
						await adapter.create({
							model,
							data: row,
						});
					} catch (error: any) {
						if (
							error?.message ===
							"Cannot read properties of undefined (reading 'fields')"
						) {
							logupdate(
								`${chalk.yellowBright("✓")} Missing model ${chalk.cyanBright(
									model,
								)}, skipped. ${chalk.gray(
									`(Make sure your DB has this table)`,
								)}`,
							);
							skipped = true;
							continue;
						}
						console.log(
							chalk.redBright(
								`Error seeding "${chalk.yellowBright(key)}" in model ${chalk.cyanBright(
									modelName,
								)}:`,
							),
						);
						console.error(error);
						process.exit(1);
					}
					logupdate(
						`Seeded ${chalk.cyanBright(
							model,
						)}, rows ${chalk.bold(index)} of ${chalk.bold(rows.length)}`,
					);
				}
				if (!skipped) {
					logupdate(
						`${chalk.greenBright("✓")} Finished seeding ${chalk.cyanBright(
							model,
						)} with ${chalk.bold(rows.length)} rows.`,
					);
				}
			}
		},
	};
}

export function table<
	TableSchema extends Record<string, SeedPrimitiveValue> = {},
>(
	table: ConvertToSeedGenerator<TableSchema>,
	options?: { modelName?: string; count?: number },
) {
	return async ({
		adapter,
		context,
		defaultRowsCount,
	}: { adapter: Adapter; context: AuthContext; defaultRowsCount: number }) => {
		const { modelName, count = defaultRowsCount } = options ?? {};

		const rows: Record<string, SeedPrimitiveValue>[] = [];

		for (let i = 0; i < count; i++) {
			const cols: Record<string, SeedPrimitiveValue> = {};
			for (const key in table) {
				const value = table[key];
				if (typeof value === "function") {
					try {
						cols[key] = await value({ adapter, context });
					} catch (error: any) {
						console.log();
						console.log(
							chalk.redBright(
								`Error seeding "${chalk.yellowBright(key)}" in model ${chalk.cyanBright(
									modelName,
								)}:`,
							),
						);
						console.log(error?.message);
						process.exit(1);
					}
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
