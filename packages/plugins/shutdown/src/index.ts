import { type Adapter, type BetterAuthPlugin } from "better-auth";
import {
	APIError,
	createAuthEndpoint,
	createAuthMiddleware,
	sessionMiddleware,
} from "better-auth/api";

export interface Rule {
	id: string;
	roles: string[];
	signIn?: boolean;
	signUp?: boolean;
	from?: number;
	to?: number;
}

import { z } from "zod";

export interface RevalidationOptions {
	/**
	 * The function that should be called to revalidate the rules.
	 */
	requireRevalidation: (cb: () => void) => any;
	/**
	 * The function that will be called when the rules are changed.
	 */
	onRulesChanged: () => any;
}

export interface ShutdownOptions {
	/**
	 * The roles that are allowed to list/create/remove shutdown rules.
	 * @default ["admin"]
	 */
	allowedRoles?: string[];

	/**
	 * The adapter to use for external storage (e.g. Redis) to revalidate the rules.
	 * @default undefined
	 */
	cache?: RevalidationOptions;
}

export const ERROR_CODES = {
	SIGNIN_DISABLED: "Sign-in is disabled",
	SIGNUP_DISABLED: "Sign-up is disabled",
} as const;

export const shutdown = ({
	allowedRoles = ["admin"],
	cache,
}: ShutdownOptions) => {
	const rules: Rule[] = [];
	let freshRules = false;

	cache?.requireRevalidation(() => {
		freshRules = false;
	});

	const sync = async () => {
		if (cache) {
			cache.onRulesChanged();
		} else {
			freshRules = false;
		}
	};

	const getRules = async (adapter: Adapter) => {
		if (!freshRules) {
			const results = await adapter.findMany<Rule & { roles: string }>({
				model: "shutdown-rules",
				where: [],
			});
			rules.length = 0;
			rules.push(
				...results.map((r) => ({
					...r,
					roles: r.roles.split(",").filter(Boolean),
				})),
			);
			freshRules = true;
		}
		return rules;
	};

	const testRules = async ({
		type,
		adapter,
		role,
		message,
	}: {
		type: "signIn" | "signUp";
		role?: string;
		adapter: Adapter;
		message: string;
	}) => {
		const rules = await getRules(adapter);
		const today = Date.now();

		const isDisabled = rules.some(({ roles, from, to, ...rule }) => {
			let block = !rule[type];

			if (roles.length && role) {
				block &&= roles.includes(role);
			}

			if (from) {
				block &&= block && from < today;
			}

			if (to) {
				block &&= block && to > today;
			}

			return block;
		});

		if (isDisabled) {
			throw new APIError("BAD_REQUEST", {
				message,
			});
		}
	};

	return {
		id: "shutdown",
		endpoints: {
			listShutdownRules: createAuthEndpoint(
				"/shutdown",
				{
					method: "GET",
					use: [sessionMiddleware],
				},
				async (ctx) => {
					const session = ctx.context.session;
					if (!session || !allowedRoles.includes(session.user.role)) {
						return ctx.json([]);
					}
					return ctx.json(await getRules(ctx.context.adapter));
				},
			),
			isSignupAllowed: createAuthEndpoint(
				"/shutdown/is-signup-allowed",
				{
					method: "GET",
				},
				async (ctx) => {
					try {
						await testRules({
							type: "signUp",
							adapter: ctx.context.adapter,
							message: ERROR_CODES.SIGNUP_DISABLED,
						});
						return ctx.json({ allowed: true });
					} catch (error) {
						return ctx.json({ allowed: false });
					}
				},
			),
			isSignInAllowed: createAuthEndpoint(
				"/shutdown/is-signin-allowed",
				{
					method: "GET",
				},
				async (ctx) => {
					try {
						await testRules({
							type: "signIn",
							adapter: ctx.context.adapter,
							message: ERROR_CODES.SIGNIN_DISABLED,
						});
						return ctx.json({ allowed: true });
					} catch (error) {
						return ctx.json({ allowed: false });
					}
				},
			),
			createShutdownRule: createAuthEndpoint(
				"/shutdown/create",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: z.object({
						roles: z
							.array(z.string())
							.default([])
							.transform((it) => it.join(",")),
						signIn: z.boolean().default(true),
						signUp: z.boolean().default(true),
						from: z.date().nullish().default(null),
						to: z.date().nullish().default(null),
					}),
				},
				async (ctx) => {
					const session = ctx.context.session;
					if (!session || !allowedRoles.includes(session.user.role)) {
						return ctx.json({ success: false });
					}

					const rule = await ctx.context.adapter.create({
						model: "shutdown-rules",
						data: {
							id: ctx.context.generateId({
								model: "shutdown-rules",
							}),
							...ctx.body,
						},
					});

					sync();

					return ctx.json({ success: true, ruleId: rule.id });
				},
			),
			removeShutdownRule: createAuthEndpoint(
				"/shutdown/remove",
				{
					method: "POST",
					use: [sessionMiddleware],
					body: z.object({
						id: z.string(),
					}),
				},
				async (ctx) => {
					const session = ctx.context.session;

					if (!session || !allowedRoles.includes(session.user.role)) {
						return ctx.json({ success: false });
					}

					await ctx.context.adapter.delete({
						model: "shutdown-rules",
						where: [
							{
								field: "id",
								operator: "eq",
								value: ctx.body.id,
							},
						],
					});

					sync();

					return ctx.json({ success: true });
				},
			),
		},
		hooks: {
			before: [
				{
					matcher: (context) => context.path.startsWith("/sign-in/email"),
					handler: createAuthMiddleware(async (ctx) => {
						const user = await ctx.context.adapter.findOne<{ role: string }>({
							model: "user",
							select: ["role"],
							where: [
								{
									field: "email",
									operator: "eq",
									value: ctx.body.email,
								},
							],
						});
						if (!user?.role || !allowedRoles.includes(user.role)) {
							await testRules({
								type: "signIn",
								role: user?.role,
								adapter: ctx.context.adapter,
								message: ERROR_CODES.SIGNIN_DISABLED,
							});
						}
						return { context: ctx };
					}),
				},
				{
					matcher: (context) => context.path.startsWith("/sign-up/email"),
					handler: createAuthMiddleware(async (ctx) => {
						await testRules({
							type: "signUp",
							adapter: ctx.context.adapter,
							message: ERROR_CODES.SIGNUP_DISABLED,
						});
						return { context: ctx };
					}),
				},
			],
		},
		schema: {
			"shutdown-rules": {
				fields: {
					roles: {
						type: "string",
						fieldName: "roles",
						input: false,
						required: false,
						defaultValue: null,
					},
					signIn: {
						type: "boolean",
						fieldName: "sign-in",
						input: false,
						required: false,
						defaultValue: true,
					},
					signUp: {
						type: "boolean",
						fieldName: "sign-up",
						input: false,
						required: false,
						defaultValue: true,
					},
					from: {
						type: "date",
						fieldName: "from",
						input: false,
						required: false,
						defaultValue: null,
					},
					to: {
						type: "date",
						fieldName: "to",
						input: false,
						required: false,
						defaultValue: null,
					},
				},
			},
		},
		$ERROR_CODES: ERROR_CODES,
	} satisfies BetterAuthPlugin;
};
