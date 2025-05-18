import { getTestInstance } from "@better-auth-kit/tests";
import { describe, expect, it } from "vitest";
import { ERROR_CODES } from "../src";
import { feedbackClient } from "../src/client";
import { feedback } from "../src/index";
import { betterAuth } from "better-auth";

const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	plugins: [feedback()],
});

describe("feedback plugin with default settings", async () => {
	const { client, testUser, signInWithTestUser } = await getTestInstance(auth, {
		clientOptions: {
			plugins: [feedbackClient()],
		},
	});

	const { headers } = await signInWithTestUser();

	it("Should allow submitting feedback with valid parameters", async () => {
		const response = await client.feedback.submit({
			text: "This is a valid feedback with proper length",
			fetchOptions: {
				headers,
			},
		});

		expect(response.data).toBeDefined();
		expect(response?.data?.id).toBeDefined();
		expect(response?.data?.text).toBe(
			"This is a valid feedback with proper length",
		);
	});

	// it("Should reject feedback that is too short", async () => {
	// 	await expect(
	// 		client.feedback.submit({
	// 			text: "Too short",
	// 			fetchOptions: {
	// 				headers,
	// 			},
	// 		}),
	// 	).rejects.toMatchObject({
	// 		message: ERROR_CODES.FEEDBACK_TOO_SHORT,
	// 	});
	// });

	// it("Should reject feedback that is too long", async () => {
	// 	const longText = "A".repeat(501);
	// 	await expect(
	// 		client.feedback.submit({
	// 			text: longText,
	// 			fetchOptions: {
	// 				headers,
	// 			},
	// 		}),
	// 	).rejects.toMatchObject({
	// 		message: ERROR_CODES.FEEDBACK_TOO_LONG,
	// 	});
	// });

	// it("Should reject feedback without userId when requireAuth is true (default)", async () => {
	// 	await expect(
	// 		client.feedback.submit({
	// 			text: "This is a valid feedback with proper length",
	// 			fetchOptions: {
	// 				headers,
	// 			},
	// 		}),
	// 	).rejects.toMatchObject({
	// 		message: ERROR_CODES.USER_NOT_LOGGED_IN,
	// 	});
	// });

	// it("Should reject feedback with invalid userId", async () => {
	// 	await expect(
	// 		client.feedback.submit({
	// 			text: "This is a valid feedback with proper length",
	// 			fetchOptions: {
	// 				headers,
	// 			},
	// 		}),
	// 	).rejects.toMatchObject({
	// 		message: ERROR_CODES.USER_NOT_FOUND,
	// 	});
	// });
});

// describe("feedback plugin with custom settings", async () => {
// 	describe("with requireAuth=false", async () => {
// 		const auth = betterAuth({
// 			emailAndPassword: {
// 				enabled: true,
// 			},
// 			plugins: [
// 				feedback({
// 					requireAuth: false,
// 					minLength: 5,
// 					maxLength: 50,
// 				}),
// 			],
// 		});
// 		const { client, testUser, signInWithTestUser } = await getTestInstance(
// 			auth,
// 			{
// 				clientOptions: {
// 					plugins: [feedbackClient()],
// 				},
// 			},
// 		);

// 		const { headers } = await signInWithTestUser();

// 		it("Should allow feedback without userId when requireAuth is false", async () => {
// 			const response = await client.feedback.submit({
// 				text: "This is valid feedback",
// 				fetchOptions: {
// 					headers,
// 				},
// 			});

// 			expect(response.data).toBeDefined();
// 			expect(response?.data?.id).toBeDefined();
// 			expect(response?.data?.userId).toBeUndefined();
// 			expect(response?.data?.text).toBe("This is valid feedback");
// 		});

// 		it("Should still verify userId if provided when requireAuth is false", async () => {
// 			await expect(
// 				client.feedback.submit({
// 					text: "This is valid feedback",
// 					fetchOptions: {
// 						headers,
// 					},
// 				}),
// 			).rejects.toMatchObject({
// 				message: ERROR_CODES.USER_NOT_FOUND,
// 			});
// 		});

// 		it("Should allow feedback with valid userId when requireAuth is false", async () => {
// 			const response = await client.feedback.submit({
// 				text: "This is valid feedback",
// 				fetchOptions: {
// 					headers,
// 				},
// 			});

// 			expect(response.data).toBeDefined();
// 			expect(response?.data?.userId).toBe(testUser.id);
// 		});

// 		it("Should respect custom minLength setting", async () => {
// 			await expect(
// 				client.feedback.submit({
// 					text: "Four", // Less than minLength of 5
// 					fetchOptions: {
// 						headers,
// 					},
// 				}),
// 			).rejects.toMatchObject({
// 				message: ERROR_CODES.FEEDBACK_TOO_SHORT,
// 			});
// 		});

// 		it("Should respect custom maxLength setting", async () => {
// 			const longText = "A".repeat(51); // Greater than maxLength of 50
// 			await expect(
// 				client.feedback.submit({
// 					text: longText,
// 					fetchOptions: {
// 						headers,
// 					},
// 				}),
// 			).rejects.toMatchObject({
// 				message: ERROR_CODES.FEEDBACK_TOO_LONG,
// 			});
// 		});
// 	});

// 	describe("with feedbackLimit", async () => {
// 		const auth = betterAuth({
// 			emailAndPassword: {
// 				enabled: true,
// 			},
// 			plugins: [
// 				feedback({
// 					feedbackLimit: 2,
// 					minLength: 5,
// 				}),
// 			],
// 		});
// 		const { client, testUser, signInWithTestUser } = await getTestInstance(
// 			auth,
// 			{
// 				clientOptions: {
// 					plugins: [feedbackClient()],
// 				},
// 			},
// 		);

// 		const { headers } = await signInWithTestUser();

// 		it("Should enforce feedbackLimit setting", async () => {
// 			// Submit first feedback (should succeed)
// 			await client.feedback.submit({
// 				text: "First feedback",
// 				fetchOptions: {
// 					headers,
// 				},
// 			});

// 			// Submit second feedback (should succeed)
// 			await client.feedback.submit({
// 				text: "Second feedback",
// 				fetchOptions: {
// 					headers,
// 				},
// 			});

// 			// Submit third feedback (should fail due to limit)
// 			await expect(
// 				client.feedback.submit({
// 					text: "Third feedback",
// 					fetchOptions: {
// 						headers,
// 					},
// 				}),
// 			).rejects.toMatchObject({
// 				message: ERROR_CODES.FEEDBACK_LIMIT_REACHED,
// 			});
// 		});
// 	});

// 	describe("with canSubmitFeedback", async () => {
// 		const auth = betterAuth({
// 			emailAndPassword: {
// 				enabled: true,
// 			},
// 			plugins: [
// 				feedback({
// 					canSubmitFeedback: (user) =>
// 						//@ts-ignore
// 						user.role === "admin",
// 				}),
// 			],
// 		});

// 		const { client, testUser, signInWithTestUser } = await getTestInstance(
// 			auth as any,
// 			{
// 				clientOptions: {
// 					plugins: [feedbackClient()],
// 				},
// 			},
// 		);

// 		const { headers } = await signInWithTestUser();

// 		it("Should enforce canSubmitFeedback function", async () => {
// 			// We're testing with a regular user that doesn't have admin role
// 			await expect(
// 				client.feedback.submit({
// 					text: "This feedback should be rejected due to user role",
// 					fetchOptions: {
// 						headers,
// 					},
// 				}),
// 			).rejects.toMatchObject({
// 				message: ERROR_CODES.USER_NOT_ALLOWED,
// 			});

// 			// Note: Testing with an admin user would require modifying the test user
// 			// in the test instance, which is beyond the scope of this test
// 		});
// 	});
// });
