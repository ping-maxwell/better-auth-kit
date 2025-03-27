import type { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

export async function queryDb(
	client: ConvexHttpClient,
	args: {
		tableName: string;
		query?: string;
		order?: "asc" | "desc";
		single?: boolean;
		limit?: number;
		paginationOpts?: { numItems: number; cursor?: string };
	},
) {
	return await client.action(anyApi.betterAuth.betterAuth, {
		action: "query",
		value: args,
	});
}

export async function countDb(
	client: ConvexHttpClient,
	args: {
		tableName: string;
		query?: string;
	},
) {
	return await client.action(anyApi.betterAuth.betterAuth, {
		action: "count",
		value: args,
	});
}

export async function insertDb(
	client: ConvexHttpClient,
	args: {
		tableName: string;
		values: Record<string, any>;
	},
) {
	const call = await client.action(anyApi.betterAuth.betterAuth, {
		action: "insert",
		value: args,
	});
	return call;
}
export async function updateDb(
	client: ConvexHttpClient,
	args: {
		tableName: string;
		query: string;
		update: Record<string, any>;
	},
) {
	const call = await client.action(anyApi.betterAuth.betterAuth, {
		action: "update",
		value: args,
	});
	return call;
}
export async function deleteDb(
	client: ConvexHttpClient,
	args: {
		tableName: string;
		query: string;
		deleteAll?: boolean;
	},
) {
	const call = await client.action(anyApi.betterAuth.betterAuth, {
		action: "delete",
		value: args,
	});
	return call;
}
