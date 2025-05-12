import { reverifyClientPlugin } from "../src/client";

import { getTestInstance, tryCatch } from "@better-auth-kit/tests";
import { beforeAll, describe, expect, it } from "vitest";
import { auth } from "./auth";
import type { User } from "better-auth";

const { resetDatabase, client, signUpWithTestUser, testUser } =
	await getTestInstance(auth, {
		clientOptions: {
			plugins: [reverifyClientPlugin()],
		},
	});

describe("reverify plugin", async () => {
	let headers: Headers;
	beforeAll(async () => {
		await resetDatabase();
		const result = await signUpWithTestUser();
		headers = result.headers;
	});

	it("Should correctly verify the user's identity via password using auth-client instance", async () => {
		const { data: isValid, error } = await client.reverify.password({
			password: testUser.password,
			fetchOptions: {
				headers,
			},
		});
		console.log(isValid, error);
		if (error) {
			console.error(error);
			throw error;
		}
		expect(isValid?.valid).toBe(true);

		const { data: isInvalid } = await client.reverify.password({
			password: "wrong_password",
			fetchOptions: {
				headers,
			},
		});

		expect(isInvalid?.valid).toBe(false);
	});

	it("Should correctly verify the user's identity via password using auth-server instance", async () => {
		const { valid } = await auth.api.reverifyPassword({
			body: {
				password: testUser.password,
			},
			headers,
		});
		expect(valid).toBe(true);

		const { valid: invalid } = await auth.api.reverifyPassword({
			body: {
				password: "wrong_password",
			},
			headers,
		});
		expect(invalid).toBe(false);
	});
});
