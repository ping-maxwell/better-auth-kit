export interface SeedConfig {
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
				 * The models to delete all rows from before seeding.
				 *
				 * Note: If certain tables can't be deleted due to foreign key constraints,
				 * the seeding will fail. Make sure to delete rows in the correct order.
				 */
				models: string[];
		  };
}

export function seedConfig(config: SeedConfig) {
	return config;
}
