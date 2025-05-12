import { getTestInstance, tryCatch } from "@better-auth-kit/tests";
import { beforeAll, describe, expect, it } from "vitest";
import { auth } from "./auth";

const { resetDatabase, client } = await getTestInstance(auth);

describe("Legal Consent Plugin", () => {
	beforeAll(async () => {
		await resetDatabase();
	});

	it("Should fail if TOS is not accepted", async () => {
		const { data, error } = await tryCatch(
			auth.api.signUpEmail({
				body: {
					email: "test@test.com",
					password: crypto.randomUUID(),
					name: "test user",
					tosAccepted: false,
				},
			}),
		);
		expect(data).toBeNull();
		expect(error).toBeDefined();
		expect(error?.body?.code).toEqual("TOS_MUST_BE_ACCEPTED");
	});

	it("Should succeed if TOS is accepted", async () => {
		const { data, error } = await tryCatch(
			auth.api.signUpEmail({
				body: {
					email: "test2@test.com",
					password: crypto.randomUUID(),
					name: "test user 2",
					tosAccepted: true,
				},
			}),
		);
		expect(data).toBeDefined();
		expect(error).toBeNull();
	});
});

describe("Legal Consent Plugin - Auth Client", () => {
	beforeAll(async () => {
		await resetDatabase();
	});

	it("Should fail if TOS is not accepted", async () => {
		const { data, error } = await client.signUp.email({
			email: "test@test.com",
			password: crypto.randomUUID(),
			name: "test user",
			//@ts-ignore
			tosAccepted: false,
		});
		expect(data).toBeNull();
		expect(error).toBeDefined();
		expect(error?.code).toEqual("TOS_MUST_BE_ACCEPTED");
	});

	it("Should succeed if TOS is accepted", async () => {
		const { data, error } = await client.signUp.email({
			email: "test@test.com",
			password: crypto.randomUUID(),
			name: "test user",
			//@ts-ignore
			tosAccepted: true,
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();
	});
});
