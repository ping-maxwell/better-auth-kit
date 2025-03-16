import type { Adapter } from "better-auth";

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

export type ConvertToSeedGenerator<
	T extends Record<string, SeedPrimitiveValue>,
> = {
	[K in keyof T]: SeedGenerator<T[K]>;
};
