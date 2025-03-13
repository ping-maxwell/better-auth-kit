const imports = [
	`import { defineSchema, defineTable } from "convex/server";`,
	`import { v } from "convex/values";`,
];

export const generateImportStage = (code: string) => {
	let has_first_import = false;
	let has_second_import = false;
	if (
		code.includes("defineSchema") &&
		code.includes(`defineTable`) &&
		code.includes(`convex/server`)
	)
		has_first_import = true;
	if (code.includes("v") && code.includes(`convex/values`))
		has_second_import = true;

	if (has_first_import && has_second_import) return code;
	return `${!has_first_import ? `${imports[0]}\n` : ""}${!has_second_import ? `${imports[1]}\n` : ""}${code}`;
};
