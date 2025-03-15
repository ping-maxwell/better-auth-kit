import { describe, it, expect } from "vitest";
import { getTestInstance } from "@better-auth-kit/tests";
import { reverify } from "../src/index";
import { reverifyClientPlugin } from "../src/client";

describe("reverify plugin", async () => {
	const { auth, client, testUser, signInWithTestUser } = await getTestInstance(
		{
			plugins: [reverify()],
		},
		{
			clientOptions: {
				plugins: [reverifyClientPlugin()],
			},
		},
	);

	const { headers } = await signInWithTestUser();

	it("Should correctly verify the user's identity via password using auth-client instance", async () => {
		const { data: isValid } = await client.reverify.password({
			password: testUser.password,
			fetchOptions: {
				headers,
			},
		});
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
