import { table, type ConvertToSeedGenerator } from "../index";
import { dataset as $ } from "../dataset";

export function apiKey<
	TableType extends Omit<ApiKey, "metadata"> & { metadata: string },
	ModelName extends string = "apiKey",
>(
	fields?: Partial<ConvertToSeedGenerator<TableType>>,
	options?: {
		/**
		 * Custom model name for the api key table
		 */
		modelName?: ModelName;
		/**
		 * The number of users to create
		 *
		 * @default 100
		 */
		count?: number;
	},
) {
	const { modelName, count = 100 } = options ?? {};
	const model = modelName ?? "apiKey";

	return table<TableType>(
		//@ts-expect-error
		{
			enabled: $.randomBoolean(),
			createdAt: $.randomDate("past"),
			updatedAt: $.randomDate("future"),
			expiresAt: $.randomDate("future"),
			requestCount: $.randomNumber(),
			remaining: $.randomNumber(),
			lastRequest: $.randomDate("future"),
			rateLimitEnabled: $.randomBoolean(),
			rateLimitTimeWindow: $.nullValue(),
			rateLimitMax: $.randomNumber(),
			permissions: $.nullValue(),
			metadata: $.nullValue(),
			userId: $.foreignKey({ model: "user", field: "id", unique: true }),
			id: $.uuid(),
			key: $.password(),
			lastRefillAt: $.randomDate(),
			name: $.firstname((name) => `${name}'s API Key`),
			prefix: $.randomCharacters(5),
			refillAmount: $.randomNumber(),
			refillInterval: $.randomNumber(),
			start: $.nullValue(),
			...fields,
		},
		{
			count,
			model,
		},
	);
}

//TODO: Remove this once better-auth exports the types
type ApiKey = {
	/**
	 * ID
	 */
	id: string;
	/**
	 * The name of the key
	 */
	name: string | null;
	/**
	 * Shows the first few characters of the API key, including the prefix.
	 * This allows you to show those few characters in the UI to make it easier for users to identify the API key.
	 */
	start: string | null;
	/**
	 * The API Key prefix. Stored as plain text.
	 */
	prefix: string | null;
	/**
	 * The hashed API key value
	 */
	key: string;
	/**
	 * The owner of the user id
	 */
	userId: string;
	/**
	 * The interval in which the `remaining` count is refilled by day
	 *
	 * @example 1 // every day
	 */
	refillInterval: number | null;
	/**
	 * The amount to refill
	 */
	refillAmount: number | null;
	/**
	 * The last refill date
	 */
	lastRefillAt: Date | null;
	/**
	 * Sets if key is enabled or disabled
	 *
	 * @default true
	 */
	enabled: boolean;
	/**
	 * Whether the key has rate limiting enabled.
	 */
	rateLimitEnabled: boolean;
	/**
	 * The duration in milliseconds
	 */
	rateLimitTimeWindow: number | null;
	/**
	 * Maximum amount of requests allowed within a window
	 */
	rateLimitMax: number | null;
	/**
	 * The number of requests made within the rate limit time window
	 */
	requestCount: number;
	/**
	 * Remaining requests (every time api key is used this should updated and should be updated on refill as well)
	 */
	remaining: number | null;
	/**
	 * When last request occurred
	 */
	lastRequest: Date | null;
	/**
	 * Expiry date of a key
	 */
	expiresAt: Date | null;
	/**
	 * created at
	 */
	createdAt: Date;
	/**
	 * updated at
	 */
	updatedAt: Date;
	/**
	 * Extra metadata about the apiKey
	 */
	metadata: Record<string, any> | null;
	/**
	 * Permissions for the api key
	 */
	permissions?: string;
};
