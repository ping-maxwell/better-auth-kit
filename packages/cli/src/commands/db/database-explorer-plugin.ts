import { createAuthEndpoint } from "better-auth/api";
import type {
	BetterAuthClientPlugin,
	BetterAuthOptions,
	BetterAuthPlugin,
} from "better-auth/types";
import { z } from "zod";
import {
	type FieldAttribute as BAFieldAttribute,
	getAuthTables,
} from "better-auth/db";

const whereSchema = z.object({
	field: z.string(),
	operator: z
		.enum([
			"eq",
			"ne",
			"lt",
			"lte",
			"gt",
			"gte",
			"in",
			"contains",
			"starts_with",
			"ends_with",
		])
		.optional(),
	value: z
		.string()
		.or(z.number())
		.or(z.boolean())
		.or(z.date())
		.or(z.array(z.string()))
		.or(z.array(z.number()))
		.or(z.null()),
	connector: z.enum(["AND", "OR"]).optional(),
});

export const dbExplorerPlugin = {
	id: "db-explorer",
	endpoints: {
		//TODO: Implement authorization to use these endpoints
		adapterCreate: createAuthEndpoint(
			"/adapter/create",
			{
				method: "POST",
				body: z.object({
					model: z.string(),
					data: z.record(z.string(), z.any()),
				}),
			},
			async (ctx) => {
				const { model, data } = ctx.body;
				const response = await ctx.context.adapter.create({ data, model });
				return ctx.json(response);
			},
		),
		adapterFindOne: createAuthEndpoint(
			"/adapter/find-one",
			{
				method: "POST",
				body: z.object({
					model: z.string(),
					where: z.array(whereSchema),
					select: z.array(z.string()).optional(),
				}),
				metadata: {},
			},
			async (ctx) => {
				const { model, where, select } = ctx.body;
				return await ctx.context.adapter.findOne({
					model,
					where,
					select,
				});
			},
		),
		adapterFindMany: createAuthEndpoint(
			"/adapter/find-many",
			{
				method: "POST",
				body: z.object({
					model: z.string(),
					where: z.array(whereSchema).optional(),
					sortBy: z
						.object({
							field: z.string(),
							direction: z.enum(["asc", "desc"]),
						})
						.optional(),
					limit: z.number().optional(),
					offset: z.number().optional(),
				}),
				metadata: {},
			},
			async (ctx) => {
				const { model, where, limit, offset, sortBy } = ctx.body;
				return await ctx.context.adapter.findMany({
					model,
					where,
					limit,
					offset,
					sortBy,
				});
			},
		),
		adapterUpdate: createAuthEndpoint(
			"/adapter/update",
			{
				method: "POST",
				body: z.object({
					model: z.string(),
					where: z.array(whereSchema),
					update: z.record(z.string(), z.any()),
				}),
				metadata: {},
			},
			async (ctx) => {
				const { model, where, update } = ctx.body;
				return await ctx.context.adapter.update({ model, where, update });
			},
		),
		adapterUpdateMany: createAuthEndpoint(
			"/adapter/update-many",
			{
				method: "POST",
				body: z.object({
					model: z.string(),
					where: z.array(whereSchema),
					update: z.record(z.string(), z.any()),
				}),
				metadata: {},
			},
			async (ctx) => {
				const { model, where, update } = ctx.body;
				return await ctx.context.adapter.updateMany({
					model,
					where,
					update,
				});
			},
		),
		adapterDelete: createAuthEndpoint(
			"/adapter/delete",
			{
				method: "POST",
				body: z.object({
					model: z.string(),
					where: z.array(whereSchema),
				}),
				metadata: {},
			},
			async (ctx) => {
				const { model, where } = ctx.body;
				return await ctx.context.adapter.delete({ model, where });
			},
		),
		adapterDeleteMany: createAuthEndpoint(
			"/adapter/delete-many",
			{
				method: "POST",
				body: z.object({
					model: z.string(),
					where: z.array(whereSchema),
				}),
				metadata: {},
			},
			async (ctx) => {
				const { model, where } = ctx.body;
				return await ctx.context.adapter.deleteMany({ model, where });
			},
		),
		adapterCount: createAuthEndpoint(
			"/adapter/count",
			{
				method: "POST",
				body: z.object({
					model: z.string(),
					where: z.array(whereSchema).optional(),
				}),
			},
			async (ctx) => {
				const { model, where } = ctx.body;
				return await ctx.context.adapter.count({ model, where });
			},
		),
		adapterGetSchema: createAuthEndpoint(
			"/adapter/get-schema",
			{
				method: "GET",
			},
			async (ctx) => {
				const tables = getAuthTables(ctx.context.options);
				return ctx.json(tables);
			},
		),
		adapterGetDetailedSchema: createAuthEndpoint(
			"/adapter/get-detailed-schema",
			{
				method: "GET",
			},
			async (ctx) => {
				const tables = getDetailedAuthTables(ctx.context.options);
				return ctx.json(tables);
			},
		),
	},
} satisfies BetterAuthPlugin;

export const dbExplorerClientPlugin = {
	id: "db-explorer-client",
	pathMethods: {
		"/adapter/create": "POST",
		"/adapter/find-one": "POST",
		"/adapter/find-many": "POST",
		"/adapter/update": "POST",
		"/adapter/update-many": "POST",
		"/adapter/delete": "POST",
		"/adapter/delete-many": "POST",
		"/adapter/count": "POST",
		"/adapter/get-schema": "GET",
		"/adapter/get-detailed-schema": "GET",
	},
	$InferServerPlugin: dbExplorerPlugin,
} satisfies BetterAuthClientPlugin;

type FieldAttribute = BAFieldAttribute & { plugin: string };

type BetterAuthDbSchema = Record<
	string,
	{
		/**
		 * The name of the table in the database
		 */
		modelName: string;
		/**
		 * The fields of the table
		 */
		fields: Record<string, FieldAttribute>;
		/**
		 * Whether to disable migrations for this table
		 * @default false
		 */
		disableMigrations?: boolean;
		/**
		 * The order of the table
		 */
		order?: number;
	}
>;

export const getDetailedAuthTables = (
	options: BetterAuthOptions,
): BetterAuthDbSchema => {
	const idField = {
		type: "string",
		plugin: "",
		required: true,
		//@ts-expect-error - In the future, BA will provide this.
		isPrimaryKey: true,
	} satisfies FieldAttribute;

	const pluginSchema = options.plugins?.reduce(
		(acc, plugin) => {
			const schema = plugin.schema;
			if (!schema) return acc;
			for (const [key, value] of Object.entries(schema)) {
				const fields: Record<string, BAFieldAttribute> = value.fields || {};
				const updatedFields: Record<string, FieldAttribute> = {};
				const accumulatedFields: Record<string, FieldAttribute> =
					acc[key]?.fields || {};
				// biome-ignore lint/performance/noDelete: <explanation>
				delete accumulatedFields.id;
				for (const [fieldName, field] of Object.entries(fields)) {
					updatedFields[fieldName] = {
						...field,
						plugin: plugin.id,
					};
				}
				acc[key] = {
					fields: {
						id: idField,
						...accumulatedFields,
						...updatedFields,
					},
					modelName: value.modelName || key,
				};
			}
			return acc;
		},
		{} as Record<
			string,
			{ fields: Record<string, FieldAttribute>; modelName: string }
		>,
	);

	const shouldAddRateLimitTable = options.rateLimit?.storage === "database";
	const rateLimitTable = {
		rateLimit: {
			modelName: options.rateLimit?.modelName || "rateLimit",
			fields: {
				id: idField,
				key: {
					type: "string",
					fieldName: options.rateLimit?.fields?.key || "key",
					plugin: "",
				},
				count: {
					type: "number",
					fieldName: options.rateLimit?.fields?.count || "count",
					plugin: "",
				},
				lastRequest: {
					type: "number",
					bigint: true,
					fieldName: options.rateLimit?.fields?.lastRequest || "lastRequest",
					plugin: "",
				},
			},
		},
	} satisfies BetterAuthDbSchema;

	const { user, session, account, ...pluginTables } = pluginSchema || {};

	const sessionTable = {
		session: {
			modelName: options.session?.modelName || "session",
			fields: {
				id: idField,
				expiresAt: {
					type: "date",
					required: true,
					fieldName: options.session?.fields?.expiresAt || "expiresAt",
					plugin: "",
				},
				token: {
					type: "string",
					required: true,
					fieldName: options.session?.fields?.token || "token",
					plugin: "",
					unique: true,
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: options.session?.fields?.createdAt || "createdAt",
					plugin: "",
				},
				updatedAt: {
					type: "date",
					required: true,
					fieldName: options.session?.fields?.updatedAt || "updatedAt",
					plugin: "",
				},
				ipAddress: {
					type: "string",
					required: false,
					fieldName: options.session?.fields?.ipAddress || "ipAddress",
					plugin: "",
				},
				userAgent: {
					type: "string",
					required: false,
					fieldName: options.session?.fields?.userAgent || "userAgent",
					plugin: "",
				},
				userId: {
					type: "string",
					fieldName: options.session?.fields?.userId || "userId",
					references: {
						model: options.user?.modelName || "user",
						field: "id",
						onDelete: "cascade",
					},
					required: true,
					plugin: "",
				},
				...session?.fields,
				...options.session?.additionalFields,
			},
			order: 2,
		},
	} satisfies BetterAuthDbSchema;

	const result = {
		user: {
			modelName: options.user?.modelName || "user",
			fields: {
				id: idField,
				name: {
					type: "string",
					required: true,
					fieldName: options.user?.fields?.name || "name",
					sortable: true,
					plugin: "",
				},
				email: {
					type: "string",
					unique: true,
					required: true,
					fieldName: options.user?.fields?.email || "email",
					sortable: true,
					plugin: "",
				},
				emailVerified: {
					type: "boolean",
					defaultValue: () => false,
					required: true,
					fieldName: options.user?.fields?.emailVerified || "emailVerified",
					plugin: "",
				},
				image: {
					type: "string",
					required: false,
					fieldName: options.user?.fields?.image || "image",
					plugin: "",
				},
				createdAt: {
					type: "date",
					defaultValue: () => new Date(),
					required: true,
					fieldName: options.user?.fields?.createdAt || "createdAt",
					plugin: "",
				},
				updatedAt: {
					type: "date",
					defaultValue: () => new Date(),
					required: true,
					fieldName: options.user?.fields?.updatedAt || "updatedAt",
					plugin: "",
				},
				...user?.fields,
				...options.user?.additionalFields,
			},
			order: 1,
		},
		//only add session table if it's not stored in secondary storage
		...(!options.secondaryStorage || options.session?.storeSessionInDatabase
			? sessionTable
			: {}),
		account: {
			modelName: options.account?.modelName || "account",
			fields: {
				id: idField,
				accountId: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.accountId || "accountId",
					plugin: "",
				},
				providerId: {
					type: "string",
					required: true,
					fieldName: options.account?.fields?.providerId || "providerId",
					plugin: "",
				},
				userId: {
					type: "string",
					references: {
						model: options.user?.modelName || "user",
						field: "id",
						onDelete: "cascade",
					},
					required: true,
					fieldName: options.account?.fields?.userId || "userId",
					plugin: "",
				},
				accessToken: {
					type: "string",
					required: false,
					fieldName: options.account?.fields?.accessToken || "accessToken",
					plugin: "",
				},
				refreshToken: {
					type: "string",
					required: false,
					fieldName: options.account?.fields?.refreshToken || "refreshToken",
					plugin: "",
				},
				idToken: {
					type: "string",
					required: false,
					fieldName: options.account?.fields?.idToken || "idToken",
					plugin: "",
				},
				accessTokenExpiresAt: {
					type: "date",
					required: false,
					fieldName:
						options.account?.fields?.accessTokenExpiresAt ||
						"accessTokenExpiresAt",
					plugin: "",
				},
				refreshTokenExpiresAt: {
					plugin: "",
					type: "date",
					required: false,
					fieldName:
						options.account?.fields?.accessTokenExpiresAt ||
						"refreshTokenExpiresAt",
				},
				scope: {
					type: "string",
					required: false,
					fieldName: options.account?.fields?.scope || "scope",
					plugin: "",
				},
				password: {
					type: "string",
					required: false,
					fieldName: options.account?.fields?.password || "password",
					plugin: "",
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: options.account?.fields?.createdAt || "createdAt",
					plugin: "",
				},
				updatedAt: {
					type: "date",
					required: true,
					fieldName: options.account?.fields?.updatedAt || "updatedAt",
					plugin: "",
				},
				...account?.fields,
			},
			order: 3,
		},
		verification: {
			modelName: options.verification?.modelName || "verification",
			fields: {
				id: idField,
				identifier: {
					type: "string",
					required: true,
					fieldName: options.verification?.fields?.identifier || "identifier",
					plugin: "",
				},
				value: {
					type: "string",
					required: true,
					fieldName: options.verification?.fields?.value || "value",
					plugin: "",
				},
				expiresAt: {
					type: "date",
					required: true,
					fieldName: options.verification?.fields?.expiresAt || "expiresAt",
					plugin: "",
				},
				createdAt: {
					type: "date",
					required: false,
					defaultValue: () => new Date(),
					fieldName: options.verification?.fields?.createdAt || "createdAt",
					plugin: "",
				},
				updatedAt: {
					type: "date",
					required: false,
					defaultValue: () => new Date(),
					fieldName: options.verification?.fields?.updatedAt || "updatedAt",
					plugin: "",
				},
			},
			order: 4,
		},
		...pluginTables,
		...(shouldAddRateLimitTable ? rateLimitTable : {}),
	} satisfies BetterAuthDbSchema;
	return result;
};
