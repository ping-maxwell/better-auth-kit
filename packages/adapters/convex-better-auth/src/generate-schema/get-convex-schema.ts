import fs from "node:fs/promises";

export const getConvexSchema = async (
  convex_dir_path: string,
): Promise<string> => {
  let files: string[];
  try {
    files = await fs.readdir(convex_dir_path);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Convex directory not found at "${convex_dir_path}". Please run this CLI from the project root directory where the convex directory is located, otherwise specify a convex directory path in your convexAdapter options, under schema_generation.convex_dir_path.`,
      );
    }
    console.error(error);
    throw new Error(
      `Failed to access convex directory at "${convex_dir_path}".`,
    );
  }

  if (!files.includes(`schema.ts`)) return "";
  try {
    const schema_code = await fs.readFile(
      `${convex_dir_path}/schema.ts`,
      "utf8",
    );
    return schema_code;
  } catch (error) {
    console.error(error);
    throw new Error(
      `ConvexAdapter: Failed to read schema.ts file from "${convex_dir_path}".`,
    );
  }
};
