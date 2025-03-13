import type { BetterAuthOptions } from "better-auth";
import { getConvexSchema } from "./get-convex-schema";
import { generateImportStage } from "./generate-imports";
import { generateSchemaBuilderStage } from "./generate-schema-builder";

export const generateSchema = async (
  BAOptions: BetterAuthOptions,
  options: { convex_dir_path: string } = {
    convex_dir_path: "./convex",
  },
): Promise<string> => {
  const { convex_dir_path } = options;

  const existing_schema_code: string = await getConvexSchema(convex_dir_path);

  // Step 1. Ensure that the imports are present
  let code: string = generateImportStage(existing_schema_code);
  // Step 2. Add scham code to the defineSchema export
  code = await generateSchemaBuilderStage({ code, BAOptions });

  return code;
};
