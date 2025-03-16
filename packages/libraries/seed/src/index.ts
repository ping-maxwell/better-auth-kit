import chalk from "chalk";
import type { Adapter } from "better-auth";
import logupdate from "log-update";
import prompts from "prompts";
import type { ConvertToSeedGenerator, SeedPrimitiveValue } from "./types";
export * from "./types";

export function seed(
	schema: Record<string, ReturnType<typeof table>>,
	options: {
		/**
		 * Rows per table it should generate.
		 *
		 * Note: if a given table has been provided with a row count to generate, this will be ignored.
		 *
		 * @default 100
		 */
		rows?: number;
		/**
		 * Delete rows before seeding.
		 * @default false
		 */
		deleteRowsBeforeSeeding?:
			| false
			| {
					enabled: boolean;
					/**
					 * The rows to delete before seeding.
					 *
					 * Note: If certain tables can't be deleted due to foreign key constraints,
					 * the seeding will fail. Make sure to delete rows in the correct order.
					 */
					rows: string[];
			  };
	} = {},
) {
	const { deleteRowsBeforeSeeding = false } = options;
	return {
		fn: async (adapter: Adapter) => {
			if (deleteRowsBeforeSeeding && deleteRowsBeforeSeeding.enabled) {
				console.log();
				const { confirm } = await prompts({
					type: "confirm",
					name: "confirm",
					message: `Are you sure you want to delete all rows from tables: ${chalk.greenBright(
						deleteRowsBeforeSeeding.rows.join(", "),
					)}?`,
				});
				if (!confirm) {
					console.log("Aborting...");
					return;
				}
				console.log(
					`Deleting all rows from tables: ${chalk.greenBright(
						deleteRowsBeforeSeeding.rows.join(", "),
					)}`,
				);
				console.log();
				for (const model of deleteRowsBeforeSeeding.rows) {
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
				const { rows, modelName } = await tableFn({ adapter });
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
): ({ adapter }: { adapter: Adapter }) => Promise<{
	modelName?: string;
	rows: Record<string, SeedPrimitiveValue>[];
}> {
	return async ({ adapter }: { adapter: Adapter }) => {
		const { modelName, count = 100 } = options ?? {};

		const rows: Record<string, SeedPrimitiveValue>[] = [];

		for (let i = 0; i < count; i++) {
			const cols: Record<string, SeedPrimitiveValue> = {};
			for (const key in table) {
				const value = table[key];
				if (typeof value === "function") {
					cols[key] = await value({ adapter });
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
