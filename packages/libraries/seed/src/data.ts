import type { Adapter } from "better-auth";
import type { SeedGenerator, SeedPrimitiveValue } from "./types";
import firstNames from "./dataset/first-names";
import lastNames from "./dataset/last-names";
import emailDomains from "./dataset/email-domains";

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
