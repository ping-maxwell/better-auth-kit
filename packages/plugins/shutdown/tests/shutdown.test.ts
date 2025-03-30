import { describe, it, expect } from "vitest";
import { getTestInstance } from "@better-auth-kit/tests";
import { ERROR_CODES, type RevalidationOptions, shutdown } from "../src/index";
import { EventEmitter } from "node:events";

describe("shutdown plugin (rules management)", async () => {
	const { auth, signInWithAdminUser } = await getTestInstance({
		plugins: [
			shutdown({
				allowedRoles: ["admin"],
			}),
		],
	});

	it("Should create rules", async () => {
		const { headers } = await signInWithAdminUser();

		const signupRule = await auth.api.createShutdownRule({
			body: {
				signUp: false,
			},
			headers,
		});
		expect(signupRule.success).toBeTruthy();

		const signInRule = await auth.api.createShutdownRule({
			body: {
				signIn: false,
			},
			headers,
		});
		expect(signInRule.success).toBeTruthy();
	});

	it("Should list rules", async () => {
		const { headers } = await signInWithAdminUser();
		const rules = await auth.api.listShutdownRules({
			headers,
		});
		expect(rules).toHaveLength(2);
	});

	it("Should remove rules", async () => {
		const { headers } = await signInWithAdminUser();
		const rules = await auth.api.listShutdownRules({
			headers,
		});

		const results = await Promise.all(
			rules.map((rule) =>
				auth.api.removeShutdownRule({
					body: {
						id: rule.id,
					},
					headers,
				}),
			),
		);

		expect(results).toHaveLength(rules.length);
		expect(results.every((result) => result.success)).toBeTruthy();

		// Check if the rules are removed
		const nowRules = await auth.api.listShutdownRules({
			headers,
		});
		expect(nowRules).toHaveLength(0);
	});
});

describe("shutdown plugin (by role)", async () => {
	const { auth, testUser, signInWithAdminUser } = await getTestInstance({
		plugins: [
			shutdown({
				allowedRoles: ["admin"],
			}),
		],
	});

	it("Should create multiple shutdown rules", async () => {
		const { headers } = await signInWithAdminUser();

		const signInRule = await auth.api.createShutdownRule({
			body: {
				roles: ["user"],
				signIn: false,
			},
			headers,
		});
		expect(signInRule.success).toBeTruthy();
	});

	it("Should disallow the user sign-in", async () => {
		await expect(() =>
			auth.api.signInEmail({ body: testUser }),
		).rejects.toThrowError(ERROR_CODES.SIGNIN_DISABLED);
	});
});

describe("shutdown plugin (by time)", async () => {
	const { auth, testUser, signInWithAdminUser } = await getTestInstance({
		plugins: [
			shutdown({
				allowedRoles: ["admin"],
			}),
		],
	});

	it("Should create multiple shutdown rules", async () => {
		const { headers } = await signInWithAdminUser();

		const signupRule = await auth.api.createShutdownRule({
			body: {
				signUp: false,
				// disabled since the last 30 minutes
				from: new Date(Date.now() - 1000 * 60 * 30),
				// disabled until the next 30 minutes
				to: new Date(Date.now() + 1000 * 60 * 30),
			},
			headers,
		});
		expect(signupRule.success).toBeTruthy();

		const signInRule = await auth.api.createShutdownRule({
			body: {
				signIn: false,
				// disabled since the last 30 minutes
				from: new Date(Date.now() - 1000 * 60 * 30),
				// disabled until the next 30 minutes
				to: new Date(Date.now() + 1000 * 60 * 30),
			},
			headers,
		});
		expect(signInRule.success).toBeTruthy();
	});

	it("Should disallow the user sign-up", async () => {
		await expect(() =>
			auth.api.signUpEmail({ body: testUser }),
		).rejects.toThrowError(ERROR_CODES.SIGNUP_DISABLED);
	});

	it("Should disallow the user sign-in (from)", async () => {
		await expect(() =>
			auth.api.signInEmail({ body: testUser }),
		).rejects.toThrowError(ERROR_CODES.SIGNIN_DISABLED);
	});
});

describe("shutdown plugin (by multiple conditions)", async () => {
	const { auth, testUser, adminUser, signInWithAdminUser, changeUserRole } =
		await getTestInstance({
			plugins: [
				shutdown({
					allowedRoles: ["admin"],
				}),
			],
		});

	const otherUser = {
		email: "other@other.com",
		name: "other user",
		password: "other123456",
	};

	it("Should allow a user to sign-up", async () => {
		const user = await auth.api.signUpEmail({
			body: otherUser,
		});

		expect(user.user).toMatchObject({
			email: otherUser.email,
			name: otherUser.name,
		});

		// change user role from 'user' to 'other'
		await changeUserRole(user.user.id, "other");
	});

	it("isSignupAllowed() should return true", async () => {
		expect(await auth.api.isSignupAllowed()).toStrictEqual({
			allowed: true,
		});
	});

	it("isSignInAllowed() should return true", async () => {
		expect(await auth.api.isSignInAllowed()).toStrictEqual({
			allowed: true,
		});
	});

	it("Should create multiple shutdown rules", async () => {
		const { headers } = await signInWithAdminUser();

		const rule = await auth.api.createShutdownRule({
			body: {
				signUp: false,
				signIn: false,
				// disable only for the user role
				roles: ["user"],
				// disabled since the last 30 minutes
				from: new Date(Date.now() - 1000 * 60 * 30),
				// disabled until the next 30 minutes
				to: new Date(Date.now() + 1000 * 60 * 30),
			},
			headers,
		});
		expect(rule.success).toBeTruthy();
	});

	it("Should disallow the user sign-up", async () => {
		await expect(() =>
			auth.api.signUpEmail({ body: testUser }),
		).rejects.toThrowError(ERROR_CODES.SIGNUP_DISABLED);
	});

	it("isSignupAllowed() should return false", async () => {
		expect(await auth.api.isSignupAllowed()).toStrictEqual({
			allowed: false,
		});
	});

	it("isSignInAllowed() should return false", async () => {
		expect(await auth.api.isSignInAllowed()).toStrictEqual({
			allowed: false,
		});
	});

	it("Should disallow any user sign-in (still allowing 'admin'/'other' roles)", async () => {
		// allow admin user to sign in
		expect(await auth.api.signInEmail({ body: adminUser })).toMatchObject({
			user: {
				email: adminUser.email,
			},
		});
		// allow otherUser user to sign in
		expect(await auth.api.signInEmail({ body: otherUser })).toMatchObject({
			user: {
				email: otherUser.email,
			},
		});
		// disallow any other user sign-in
		await expect(() =>
			auth.api.signInEmail({ body: testUser }),
		).rejects.toThrowError(ERROR_CODES.SIGNIN_DISABLED);
	});
});

describe("shutdown plugin (external cache revalidation)", async () => {
	const ev = new EventEmitter();

	// This a sample cache implementation using only EventEmitter
	const cache: RevalidationOptions = {
		requireRevalidation: (cb) => ev.on("shutdown:sync", cb),
		onRulesChanged: () => ev.emit("shutdown:sync"),
	};

	const { auth, signInWithAdminUser } = await getTestInstance({
		plugins: [
			shutdown({
				allowedRoles: ["admin"],
				cache,
			}),
		],
	});

	it("Should create rules", async () => {
		const { headers } = await signInWithAdminUser();

		const signupRule = await auth.api.createShutdownRule({
			body: {
				signUp: false,
			},
			headers,
		});
		expect(signupRule.success).toBeTruthy();

		const signInRule = await auth.api.createShutdownRule({
			body: {
				signIn: false,
			},
			headers,
		});
		expect(signInRule.success).toBeTruthy();
	});

	it("Should list rules", async () => {
		const { headers } = await signInWithAdminUser();
		const rules = await auth.api.listShutdownRules({
			headers,
		});
		expect(rules).toHaveLength(2);
	});

	it("Should remove rules", async () => {
		const { headers } = await signInWithAdminUser();
		const rules = await auth.api.listShutdownRules({
			headers,
		});

		const results = await Promise.all(
			rules.map((rule) =>
				auth.api.removeShutdownRule({
					body: {
						id: rule.id,
					},
					headers,
				}),
			),
		);

		expect(results).toHaveLength(rules.length);
		expect(results.every((result) => result.success)).toBeTruthy();

		// Check if the rules are removed
		const nowRules = await auth.api.listShutdownRules({
			headers,
		});
		expect(nowRules).toHaveLength(0);
	});
});
