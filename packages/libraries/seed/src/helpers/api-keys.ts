import { table, type ConvertToSeedGenerator } from "../index";
import { dataset as $ } from "../dataset";

export function apiKeys<
	TableType extends ApiKey,
	ApiKeyModel extends string = "apikey",
>(
	fields?: Partial<ConvertToSeedGenerator<TableType>>,
	options?: {
		/**
		 * Custom model names for the apiKey table
		 */
		modelNames?: {
			apiKey: ApiKeyModel;
		};
		/**
		 * The number of api keys to create
		 *
		 * @default 100
		 */
		count?: number;
	},
) {
	const { modelNames, count = 100 } = options ?? {};
	const apiKeyModel = modelNames?.apiKey ?? "apikey";

	return {
		[apiKeyModel]: table<TableType>(
			//@ts-expect-error
			{
				createdAt: $.randomDate(),
				updatedAt: $.randomDate(),
				id: $.uuid(),
				enabled: $.randomBoolean(),
				expiresAt: $.randomChoice($.nullValue(), $.randomDate()),
				key: $.randomCharacters(32),
				lastRefillAt: $.randomChoice($.randomDate(), $.nullValue()),
				refillInterval: $.randomChoice(
					$.nullValue(),
					$.randomNumber({ min: 1, max: 30 }),
				),
				lastRequest: $.randomChoice($.randomDate(), $.nullValue()),
				rateLimitEnabled: $.randomBoolean(),
				rateLimitMax: $.randomChoice(
					$.randomNumber({ min: 1, max: 1000 }),
					$.nullValue(),
				),
				requestCount: $.randomNumber({ min: 0, max: 1000 }),
				remaining: $.randomNumber({ min: 0, max: 1000 }),
				metadata: $.nullValue(),
				name: $.firstname((name) => `${name}'s API Key`),
				prefix: $.nullValue(),
				rateLimitTimeWindow: $.randomChoice(
					$.randomNumber({ min: 1, max: 1000 }),
					$.nullValue(),
				),
				userId: $.foreignKey({
					field: "id",
					model: "user",
					unique: true,
				}),
				refillAmount: $.randomChoice(
					$.randomNumber({ min: 1, max: 1000 }),
					$.nullValue(),
				),
				permissions: $.custom(() => ""),
				start: $.nullValue(),
				...fields,
			},
			{
				modelName: apiKeyModel,
				count,
			},
		),
	} as {
		[key in ApiKeyModel]: ReturnType<typeof table<TableType>>;
	};
}

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
	metadata: null;
	/**
	 * Permissions for the api key
	 */
	permissions?: string;
};
