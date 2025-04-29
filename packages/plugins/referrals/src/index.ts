import { generateId, type BetterAuthPlugin, type User } from "better-auth";
import {
	createAuthEndpoint,
	sessionMiddleware,
	createAuthMiddleware,
} from "better-auth/api";
import {
	mergeSchema,
	type FieldAttribute,
	type InferFieldsInput,
} from "better-auth/db";
import { z, type ZodRawShape, type ZodTypeAny } from "zod";
import { schema, type ReferralEntry } from "./schema";
import type { ReferralsOptions } from "./types";
export * from "./client";
export * from "./schema";
export * from "./types";

// Default referral code generator
const defaultGenerateReferralCode = (length: number): string => {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

export const ERROR_CODES = {
	INVALID_REFERRAL_CODE: "Invalid referral code",
	USER_NOT_FOUND: "User not found",
	USER_NOT_ALLOWED: "You are not allowed to use referrals",
} as const;

export const referrals = (options?: ReferralsOptions) => {
	const opts = {
		urlFormat: options?.urlFormat ?? "?ref=",
		baseUrl: options?.baseUrl ?? "/",
		codeLength: options?.codeLength ?? 8,
		canUseReferrals: options?.canUseReferrals,
		generateReferralCode:
			options?.generateReferralCode ?? defaultGenerateReferralCode,
		onReferral: options?.onReferral,
		schema: options?.schema,
		additionalFields: options?.additionalFields ?? {},
	} satisfies ReferralsOptions;

	// Start with a deep copy of the schema
	// Use manual deep copy to handle functions that structuredClone can't handle
	const baseSchema = {
		referrals: {
			...schema.referrals,
			fields: {
				...schema.referrals.fields,
			},
		},
	};

	// Now merge with user-provided schema
	const merged_schema = mergeSchema(baseSchema, opts.schema);
	merged_schema.referrals.fields = {
		...merged_schema.referrals.fields,
		...opts.additionalFields,
	};

	type ReferralEntryModified = ReferralEntry &
		InferFieldsInput<typeof opts.additionalFields>;

	const model = Object.keys(merged_schema)[0];

	return {
		id: "referrals",
		schema: merged_schema,
		$ERROR_CODES: ERROR_CODES,

		hooks: {
			// Hook into the sign up process to handle referrals
			after: [
				{
					matcher(context) {
						return (
							context.path?.startsWith("/callback") ||
							context.path?.startsWith("/oauth2/callback")
						);
					},
					handler: createAuthMiddleware(async (ctx) => {
						if (!ctx.context.session?.user) return;

						const user = ctx.context.session.user;

						// Try to get referral code from URL
						const url = ctx.request?.url;
						const referralCode = url
							? new URL(url, "http://localhost").searchParams.get("ref")
							: null;

						if (!referralCode) return;

						// Find the referrer using the code
						const referrer =
							await ctx.context.adapter.findOne<ReferralEntryModified>({
								model,
								where: [
									{
										field: "referralCode",
										value: referralCode,
										operator: "eq",
									},
								],
							});

						if (!referrer) return;

						// Create a record of this referral
						await ctx.context.adapter.create<ReferralEntryModified>({
							model,
							data: {
								id: generateId(),
								userId: user.id,
								referrerId: referrer.userId,
								referralCode: opts.generateReferralCode(opts.codeLength),
								createdAt: new Date(),
							} as ReferralEntryModified,
						});

						// Trigger onReferral callback if provided
						if (opts.onReferral) {
							const referrerUser = await ctx.context.adapter.findOne<User>({
								model: "user",
								where: [{ field: "id", value: referrer.userId }],
							});

							if (referrerUser) {
								await Promise.resolve(
									opts.onReferral({
										userId: user.id,
										referrerId: referrer.userId,
										referralCode,
									}),
								);
							}
						}
					}),
				},
			],
		},

		endpoints: {
			// Endpoint to get referral URL
			getReferralUrl: createAuthEndpoint(
				"/referrals/url",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					if (!ctx.context.session?.user) {
						throw ctx.error("UNAUTHORIZED", {
							message: ERROR_CODES.USER_NOT_FOUND,
						});
					}

					const user = ctx.context.session.user;

					// Check if user is allowed to use referrals
					if (opts.canUseReferrals) {
						const isAllowed = await Promise.resolve(opts.canUseReferrals(user));
						if (!isAllowed) {
							throw ctx.error("FORBIDDEN", {
								message: ERROR_CODES.USER_NOT_ALLOWED,
							});
						}
					}

					// Find the user's referral entry
					const referralEntry =
						await ctx.context.adapter.findOne<ReferralEntryModified>({
							model,
							where: [{ field: "userId", value: user.id, operator: "eq" }],
						});

					if (!referralEntry) {
						// Create a new referral entry if not found
						const newEntry =
							await ctx.context.adapter.create<ReferralEntryModified>({
								model,
								data: {
									id: generateId(),
									userId: user.id,
									referralCode: opts.generateReferralCode(opts.codeLength),
									createdAt: new Date(),
								} as ReferralEntryModified,
							});

						const referralUrl = `${opts.baseUrl}${opts.urlFormat}${newEntry.referralCode}`;

						return ctx.json({
							code: newEntry.referralCode,
							url: referralUrl,
						});
					}

					const referralUrl = `${opts.baseUrl}${opts.urlFormat}${referralEntry.referralCode}`;

					return ctx.json({
						code: referralEntry.referralCode,
						url: referralUrl,
					});
				},
			),

			// Endpoint to check if a referral code is valid
			validateReferralCode: createAuthEndpoint(
				"/referrals/validate",
				{
					method: "POST",
					body: z.object({
						code: z.string(),
					}),
				},
				async (ctx) => {
					const { code } = ctx.body;

					// Find referral entry with this code
					const referralEntry =
						await ctx.context.adapter.findOne<ReferralEntryModified>({
							model,
							where: [{ field: "referralCode", value: code, operator: "eq" }],
						});

					if (!referralEntry) {
						throw ctx.error("BAD_REQUEST", {
							message: ERROR_CODES.INVALID_REFERRAL_CODE,
						});
					}

					return ctx.json({
						valid: true,
						referrerId: referralEntry.userId,
					});
				},
			),

			// Endpoint to get who referred the current user
			getMyReferrer: createAuthEndpoint(
				"/referrals/my-referrer",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					if (!ctx.context.session?.user) {
						throw ctx.error("UNAUTHORIZED", {
							message: ERROR_CODES.USER_NOT_FOUND,
						});
					}

					const user = ctx.context.session.user;

					// Find the entry where the current user was referred
					const referralEntry =
						await ctx.context.adapter.findOne<ReferralEntryModified>({
							model,
							where: [{ field: "userId", value: user.id, operator: "eq" }],
						});

					if (!referralEntry || !referralEntry.referrerId) {
						return ctx.json(null);
					}

					// Get the referrer user info
					const referrer = await ctx.context.adapter.findOne<User>({
						model: "user",
						where: [
							{ field: "id", value: referralEntry.referrerId, operator: "eq" },
						],
					});

					return ctx.json({
						referrerId: referralEntry.referrerId,
						referrer: referrer || null,
						createdAt: referralEntry.createdAt,
					});
				},
			),

			// Endpoint to get users referred by the current user
			getMyReferrals: createAuthEndpoint(
				"/referrals/my-referrals",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					if (!ctx.context.session?.user) {
						throw ctx.error("UNAUTHORIZED", {
							message: ERROR_CODES.USER_NOT_FOUND,
						});
					}

					const user = ctx.context.session.user;

					// Find all entries where the current user is the referrer
					const referralEntries =
						await ctx.context.adapter.findMany<ReferralEntryModified>({
							model,
							where: [{ field: "referrerId", value: user.id, operator: "eq" }],
						});

					if (!referralEntries.length) {
						return ctx.json([]);
					}

					// Get user info for all referred users
					const referredUserIds = referralEntries.map((entry) => entry.userId);
					const referredUsers = await ctx.context.adapter.findMany<User>({
						model: "user",
						where: [{ field: "id", value: referredUserIds, operator: "in" }],
					});

					// Map users to referral entries
					const referrals = referralEntries.map((entry) => {
						const referredUser = referredUsers.find(
							(user) => user.id === entry.userId,
						);
						return {
							userId: entry.userId,
							user: referredUser || null,
							createdAt: entry.createdAt,
						};
					});

					return ctx.json(referrals);
				},
			),

			// Endpoint to get referral count for the current user
			getReferralCount: createAuthEndpoint(
				"/referrals/count",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					if (!ctx.context.session?.user) {
						throw ctx.error("UNAUTHORIZED", {
							message: ERROR_CODES.USER_NOT_FOUND,
						});
					}

					const user = ctx.context.session.user;

					// Count all entries where the current user is the referrer
					const count = await ctx.context.adapter.count({
						model,
						where: [{ field: "referrerId", value: user.id, operator: "eq" }],
					});

					return ctx.json({ count });
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
