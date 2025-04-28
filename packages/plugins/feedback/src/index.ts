import { generateId, type BetterAuthPlugin, type User } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import {
	mergeSchema,
	type FieldAttribute,
	type InferFieldsInput,
} from "better-auth/db";
import { z, type ZodRawShape, type ZodTypeAny } from "zod";
import { schema, type FeedbackEntry } from "./schema";
import type { FeedbackOptions } from "./types";
export * from "./client";
export * from "./schema";
export * from "./types";

export const ERROR_CODES = {
	FEEDBACK_TOO_SHORT: "Feedback text is too short",
	FEEDBACK_TOO_LONG: "Feedback text is too long",
	USER_NOT_LOGGED_IN: "User must be logged in to submit feedback",
	USER_NOT_FOUND: "User not found",
	FEEDBACK_LIMIT_REACHED: "You have reached your feedback submission limit",
	USER_NOT_ALLOWED: "You are not allowed to submit feedback",
} as const;

export const feedback = (options?: FeedbackOptions) => {
	const opts = {
		minLength: options?.minLength ?? 10,
		maxLength: options?.maxLength ?? 500,
		feedbackLimit: options?.feedbackLimit,
		canSubmitFeedback: options?.canSubmitFeedback,
		requireAuth: options?.requireAuth ?? true,
		schema: options?.schema,
		additionalFields: options?.additionalFields ?? {},
	} satisfies FeedbackOptions;

	// Start with a fresh copy of the schema
	// preserve Date objects & other non-JSON types
	const baseSchema = structuredClone(schema);

	// If authentication is not required, mark the userId field as not required
	if (!opts.requireAuth && baseSchema.feedback.fields.userId) {
		baseSchema.feedback.fields.userId.required = false;
	}

	// Now merge with user-provided schema
	const merged_schema = mergeSchema(baseSchema, opts.schema);
	merged_schema.feedback.fields = {
		...merged_schema.feedback.fields,
		...opts.additionalFields,
	};

	type FeedbackEntryModified = FeedbackEntry &
		InferFieldsInput<typeof opts.additionalFields>;

	const model = Object.keys(merged_schema)[0] as string;

	return {
		id: "feedback",
		schema: merged_schema,
		$ERROR_CODES: ERROR_CODES,
		endpoints: {
			submitFeedback: createAuthEndpoint(
				"/feedback/submit",
				{
					method: "POST",
					body: convertAdditionalFieldsToZodSchema({
						...opts.additionalFields,
						text: { type: "string", required: true },
						userId: { type: "string", required: opts.requireAuth },
					}) as never as z.ZodType<Omit<FeedbackEntry, "id" | "createdAt">>,
				},
				async (ctx) => {
					const { text, userId, ...everythingElse } = ctx.body as {
						text: string;
						userId?: string;
					} & Record<string, any>;

					// Validate feedback text length
					if (text.length < opts.minLength) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.FEEDBACK_TOO_SHORT,
						});
					} else if (text.length > opts.maxLength) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.FEEDBACK_TOO_LONG,
						});
					}

					let user: User | null = null;
					let finalUserId: string | undefined = undefined;

					// Handle authentication requirement
					if (opts.requireAuth) {
						if (!userId) {
							throw ctx.error("BAD_REQUEST", {
								message: ERROR_CODES.USER_NOT_LOGGED_IN,
							});
						}

						// Validate the userId
						user = await ctx.context.adapter.findOne<User>({
							model: "user",
							where: [{ field: "id", value: userId, operator: "eq" }],
						});

						if (!user) {
							throw ctx.error("BAD_REQUEST", {
								message: ERROR_CODES.USER_NOT_FOUND,
							});
						}

						finalUserId = user.id;

						// Check if user is allowed to submit feedback
						if (opts.canSubmitFeedback && user) {
							const isAllowed = await Promise.resolve(
								opts.canSubmitFeedback(user),
							);
							if (!isAllowed) {
								throw ctx.error("FORBIDDEN", {
									message: ERROR_CODES.USER_NOT_ALLOWED,
								});
							}
						}

						// Check if user has reached feedback limit
						if (opts.feedbackLimit) {
							const feedbackCount = await ctx.context.adapter.count({
								model,
								where: [{ field: "userId", value: userId, operator: "eq" }],
							});

							if (feedbackCount >= opts.feedbackLimit) {
								throw ctx.error("FORBIDDEN", {
									message: ERROR_CODES.FEEDBACK_LIMIT_REACHED,
								});
							}
						}
					} else if (userId) {
						// Validate the userId
						user = await ctx.context.adapter.findOne<User>({
							model: "user",
							where: [{ field: "id", value: userId, operator: "eq" }],
						});

						if (!user) {
							throw ctx.error("BAD_REQUEST", {
								message: ERROR_CODES.USER_NOT_FOUND,
							});
						}

						finalUserId = user.id;
					}

					const res = await ctx.context.adapter.create<FeedbackEntryModified>({
						model: model,
						data: {
							id: generateId(),
							userId: finalUserId,
							text,
							createdAt: new Date(),
							...everythingElse,
						} as FeedbackEntryModified,
					});

					return ctx.json(res);
				},
			),
		},
	} satisfies BetterAuthPlugin;
};

function convertAdditionalFieldsToZodSchema(
	additionalFields: Record<string, FieldAttribute>,
) {
	const additionalFieldsZodSchema: ZodRawShape = {};
	for (const [key, value] of Object.entries(additionalFields)) {
		let res: ZodTypeAny;

		if (value.type === "string") {
			res = z.string();
		} else if (value.type === "number") {
			res = z.number();
		} else if (value.type === "boolean") {
			res = z.boolean();
		} else if (value.type === "date") {
			res = z.date();
		} else if (value.type === "string[]") {
			res = z.array(z.string());
		} else {
			res = z.array(z.number());
		}

		if (!value.required) {
			res = res.optional();
		}

		additionalFieldsZodSchema[key] = res;
	}
	return z.object(additionalFieldsZodSchema);
}
