import { betterAuth, type BetterAuthOptions } from "better-auth";
import { afterAll, beforeAll, describe, expect, it, test } from "vitest";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { convexAdapter } from "./../src/index";
import { runAdapterTest } from "better-auth/adapters/test";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./../convex/_generated/api.js";

describe("Handle Convex Adapter", async () => {
	it("should successfully add the Convex Adapter", async () => {
		const client = new ConvexHttpClient(process.env.CONVEX_URL as string);

		const auth = betterAuth({
			database: convexAdapter(client),
		});

		expect(auth).toBeDefined();
		expect(auth.options.database).toBeDefined();
		expect(auth.options.database({}).id).toEqual("convex");
	});
});

describe("Run BetterAuth Adapter tests", async () => {
	const client = new ConvexHttpClient(process.env.CONVEX_URL as string);

	beforeAll(async () => {
		await client.mutation(api.tests.removeAll, {});
	});
	afterAll(async () => {
		await client.mutation(api.tests.removeAll, {});
	});

	const adapter = convexAdapter(client, {
		debugLogs: { isRunningAdapterTests: true },
	});

	await runAdapterTest({
		getAdapter: async (customOptions = {}) => {
			return adapter({ ...customOptions });
		},
		disableTests: {
			CREATE_MODEL_SHOULD_ALWAYS_RETURN_AN_ID: false,
			DELETE_MODEL: true,
			FIND_MODEL: true,
			FIND_MODEL_WITH_MODIFIED_FIELD_NAME: true,
			FIND_MODEL_WITH_SELECT: true,
			FIND_MODEL_WITHOUT_ID: true,
			SHOULD_DELETE_MANY: true,
			SHOULD_FIND_MANY: true,
			SHOULD_FIND_MANY_WITH_CONTAINS_OPERATOR: true,
			SHOULD_FIND_MANY_WITH_LIMIT: true,
			SHOULD_FIND_MANY_WITH_OFFSET: true,
			SHOULD_FIND_MANY_WITH_SORT_BY: true,
			SHOULD_FIND_MANY_WITH_WHERE: true,
			SHOULD_FIND_MANY_WITH_OPERATORS: true,
			SHOULD_NOT_THROW_ON_DELETE_RECORD_NOT_FOUND: true,
			SHOULD_NOT_THROW_ON_RECORD_NOT_FOUND: true,
			SHOULD_PREFER_GENERATE_ID_IF_PROVIDED: true,
			SHOULD_SEARCH_USERS_WITH_ENDS_WITH: true,
			SHOULD_SEARCH_USERS_WITH_STARTS_WITH: true,
			SHOULD_UPDATE_WITH_MULTIPLE_WHERE: true,
			SHOULD_WORK_WITH_REFERENCE_FIELDS: true,
			// UPDATE_MODEL: true,
		},
	});
	test("should find many with offset and limit", async () => {
		// At this point, `user` contains 8 rows.
		// offset of 2 returns 6 rows
		// limit of 2 returns 2 rows
		const res = await adapter({}).findMany({
			model: "user",
			offset: 2,
			limit: 2,
		});
		expect(res.length).toBe(2);
	});
});

const createTestOptions = (): BetterAuthOptions => ({
	user: {
		fields: { email: "email_address" },
		additionalFields: {
			test: {
				type: "string",
				defaultValue: "test",
			},
		},
	},
	session: {
		modelName: "sessions",
	},
});

describe("Authentication Flow Tests", async () => {
	const opts = createTestOptions();
	const testUser = {
		email: "test-email@email.com",
		password: "password",
		name: "Test Name",
	};
	const client = new ConvexHttpClient(process.env.CONVEX_URL as string);

	beforeAll(async () => {
		await client.mutation(api.tests.removeAll, {});
	});
	afterAll(async () => {
		await client.mutation(api.tests.removeAll, {});
	});

	const auth = betterAuth({
		...opts,
		database: convexAdapter(client),
		emailAndPassword: {
			enabled: true,
		},
	});

	it("should successfully sign up a new user", async () => {
		const user = await auth.api.signUpEmail({ body: testUser });
		console.log(user, testUser);
		expect(user).toBeDefined();
	});

	it("should successfully sign in an existing user", async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		console.log(testUser);
		const user = await auth.api.signInEmail({ body: testUser });
		expect(user.user).toBeDefined();
	});
});
