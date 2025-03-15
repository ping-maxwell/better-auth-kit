import chalk from "chalk";
import type { Adapter } from "better-auth";
import logupdate from "log-update";
import firstNames from "./dataset/first-names";
import lastNames from "./dataset/last-names";
import emailDomains from "./dataset/email-domains";
import prompts from "prompts";

/**
 * A primitive value that can be used as a value in your database.
 */
export type SeedPrimitiveValue = string | number | boolean | null | Date;

/**
 * A function which would be called everytime a row is generated
 *
 * Must return a value of type SeedPrimitiveValue
 */
export type SeedGenerator<T extends SeedPrimitiveValue = SeedPrimitiveValue> =
	(helpers: { adapter: Adapter }) => Promise<T> | T;

export function seed<Schema extends Record<string, ReturnType<typeof table>>>(
	schema: Schema,
	options: {
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
			for await (const [key, tableFn] of Object.entries(schema)) {
				const { rows, modelName } = await tableFn({ adapter });
				const model = modelName ?? key;
				logupdate(
					`Seeding ${chalk.cyanBright(model)} with ${chalk.greenBright(
						rows.length,
					)} rows...`,
				);
				let index = 0;
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
				logupdate.done();
			}
		},
	};
}

type ConvertToSeedGenerator<T extends Record<string, SeedPrimitiveValue>> = {
	[K in keyof T]: SeedGenerator<T[K]>;
};

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
const firstname = (): SeedGenerator<string> => {
	return () => rng(firstNames) as string;
};

const lastname = (): SeedGenerator<string> => {
	return () => rng(lastNames) as string;
};

const alreadyUsedRows: { model: string; field: string; id: string }[] = [];

export const funcs = {
	firstname,
	lastname,
	first_and_lastname: (): SeedGenerator<string> => {
		return ({ adapter }: { adapter: Adapter }) =>
			`${firstname()({ adapter })}${lastname()({ adapter })}`;
	},
	uuid: (): SeedGenerator<string> => {
		return () => crypto.randomUUID();
	},
	email: (): SeedGenerator<string> => {
		return ({ adapter }: { adapter: Adapter }) =>
			`${firstname()({ adapter })}_${lastname()({ adapter })}@${rng(emailDomains)}`;
	},
	boolean: ({
		probability = 0.5,
	}: {
		/**
		 * The probability of the boolean value being true (0-1)
		 * @default 0.5
		 */
		probability?: number;
	} = {}): SeedGenerator<boolean> => {
		return () => Math.random() < probability;
	},
	date: (): SeedGenerator<Date> => {
		return () => new Date();
	},
	string: (cb: () => string): SeedGenerator<string> => {
		return cb;
	},
	forignKey: <FieldType extends SeedPrimitiveValue = any>({
		model,
		field,
		unique = false,
	}: {
		model: string;
		field: string;
		unique?: boolean;
	}): SeedGenerator<FieldType> => {
		const res: SeedGenerator<FieldType> = async ({ adapter }) => {
			const randomRow = await adapter.findOne<{
				id: string;
				[field]: FieldType;
			}>({
				model,
				where: unique
					? alreadyUsedRows.map((x) => ({
							field: "id",
							value: x.id,
							operator: "ne",
						}))
					: [],
				select: [field, "id"],
			});

			if (!randomRow) {
				throw new Error(`No rows found for model ${model}`);
			}

			alreadyUsedRows.push({
				model,
				field,
				id: randomRow.id,
			});

			return randomRow[field] as FieldType;
		};
		return res;
	},
} satisfies Record<string, (...args: any[]) => SeedGenerator>;

function rng(items: any[]) {
	return items[Math.floor(Math.random() * items.length)];
}
