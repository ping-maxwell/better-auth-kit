import type { BetterAuthOptions } from "better-auth";
import type { InstantDB, InstantAdapterOptions } from "../types";
import { type FieldAttribute, getAuthTables, getSchema } from "better-auth/db";
import { id } from "@instantdb/core";

export const createTransform = (
	db: InstantDB,
	config: InstantAdapterOptions,
	options: BetterAuthOptions,
) => {
	const schema = getAuthTables(options);

	function getField(model: string, field: string) {
		if (field === "id") {
			return field;
		}
		const f = schema[model].fields[field];
		return f.fieldName || field;
	}

	const useDatabaseGeneratedId = options?.advanced?.generateId === false;
	return {
		getSchema,
		transformInput(
			data: Record<string, any>,
			model: string,
			action: "create" | "update",
		) {
			const transformedData: Record<string, any> =
				useDatabaseGeneratedId || action === "update"
					? {}
					: {
							id: options.advanced?.generateId
								? options.advanced.generateId({
										model,
									})
								: data.id || (config.generateId ? config.generateId() : id()),
						};
			const fields = schema[model].fields;
			for (const field in fields) {
				let value = data[field];
				if (value === undefined && !fields[field].defaultValue && !fields[field].transform?.input) {
					continue;
				}
				if (fields[field].transform?.input) {
					value = fields[field].transform.input(value);
				}
				transformedData[fields[field].fieldName || field] = withApplyDefault(
					value,
					fields[field],
					action,
				);
			}
			return transformedData;
		},
		transformOutput(
			data: Record<string, any>,
			model: string,
			select: string[] = [],
		) {
			if (!data) return null;
			const transformedData: Record<string, any> =
				data.id || data._id
					? select.length === 0 || select.includes("id")
						? {
								id: data.id,
							}
						: {}
					: {};
			const tableSchema = schema[model].fields;
			for (const key in tableSchema) {
				if (select.length && !select.includes(key)) {
					continue;
				}
				const field = tableSchema[key];
				if (field) {
					let value = data[field.fieldName || key];
					if (field.type === "date") value = new Date(value);
					if (field.transform?.output) {
						value = field.transform.output(value);
					}
					transformedData[key] = value;
				}
			}
			return transformedData as any;
		},
		getField,
	};
};

export function withApplyDefault(
	value: any,
	field: FieldAttribute,
	action: "create" | "update",
) {
	if (action === "update") {
		return value;
	}
	if (value === undefined || value === null) {
		if (field.defaultValue) {
			if (typeof field.defaultValue === "function") {
				return field.defaultValue();
			}
			return field.defaultValue;
		}
	}
	return value;
}
