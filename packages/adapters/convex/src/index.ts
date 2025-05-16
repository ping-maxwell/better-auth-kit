import type { ConvexHttpClient } from "convex/browser";
import type { Adapter, BetterAuthOptions, Where } from "better-auth";
import { createAdapter } from "better-auth/adapters";
import type { ConvexAdapterOptions } from "./types";
import { queryBuilder } from "./handler/index";
import type { PaginationResult } from "convex/server";
import { countDb, deleteDb, insertDb, updateDb } from "./handler/calls";
import { queryDb } from "./handler/calls";

export type ConvexAdapter = {
	convexClient: ConvexHttpClient;
	config?: ConvexAdapterOptions;
};

type DbInsert = {
	action: "insert";
	tableName: string;
	values: Record<string, any>;
};

type DbQuery = {
	action: "query";
	tableName: string;
	query?: string;
	order?: "asc" | "desc";
	single?: boolean;
	limit?: number;
	paginationOpts?: { numItems: number; cursor?: string };
};

type DbDelete = {
	action: "delete";
	tableName: string;
	query: string;
	deleteAll?: boolean;
};

type DbUpdate = {
	action: "update";
	tableName: string;
	query: string;
	update: Record<string, any>;
};

type DbCount = {
	action: "count";
	tableName: string;
	query?: string;
};

export const convexAdapter = (
	client: ConvexHttpClient,
	config?: ConvexAdapterOptions,
) =>
	createAdapter({
		config: {
			adapterId: "convex",
			adapterName: "Convex Adapter",
			supportsJSON: false,
			debugLogs: config?.debugLogs,
			supportsDates: false,
		},
		adapter: ({}) => {
			function filterInvalidOperators(where: Where[] | undefined): void {
				if (!where) return;
				const invalidOps = ["contains", "starts_with", "ends_with"];
				if (
					where.filter((w) => invalidOps.includes(w.operator || "")).length > 0
				) {
					throw new Error(
						`Convex does not support ${invalidOps.join(", ")} operators`,
					);
				}
			}

			function transformWhereOperators(where: Where[] | undefined): Where[] {
				if (!where) return [];
				const new_where: Where[] = [];

				for (const w of where) {
					if (w.operator === "in") {
						(w.value as []).forEach((v, i) => {
							new_where.push({
								field: w.field,
								value: v,
								operator: "eq",
								connector: i < (w.value as []).length - 1 ? "OR" : undefined,
							});
						});
					} else {
						new_where.push(w);
					}
				}

				return new_where;
			}

			async function db(
				options: DbInsert | DbQuery | DbDelete | DbUpdate | DbCount,
			) {
				if (options.action === "query") {
					return await queryDb(client, {
						tableName: options.tableName,
						order: options.order,
						query: options.query,
						single: options.single,
						limit: options.limit,
						paginationOpts: options.paginationOpts,
					});
				}
				if (options.action === "insert") {
					return await insertDb(client, {
						tableName: options.tableName,
						values: options.values,
					});
				}
				if (options.action === "delete") {
					return await deleteDb(client, {
						tableName: options.tableName,
						query: options.query,
						deleteAll: options.deleteAll,
					});
				}
				if (options.action === "update") {
					return await updateDb(client, {
						tableName: options.tableName,
						query: options.query,
						update: options.update,
					});
				}
				if (options.action === "count") {
					return await countDb(client, {
						tableName: options.tableName,
						query: options.query,
					});
				}
				return "";
			}

			return {
				async create({ data, model, select }) {
					const res = await db({
						action: "insert",
						tableName: model,
						values: data,
					});
					return res;
				},
				async findOne({ model, where, select }) {
					const res = await db({
						action: "query",
						tableName: model,
						query: queryBuilder((q) => {
							const eqs = where.map((w) => q.eq(w.field, w.value));
							return eqs.reduce((acc, cur, indx) =>
								q[
									(where[indx - 1].connector || "AND").toLowerCase() as
										| "and"
										| "or"
								](acc, cur),
							);
						}),
						single: true,
					});
					return res;
				},
				async findMany({ model, where: where_, limit, offset, sortBy }) {
					filterInvalidOperators(where_);
					const where = transformWhereOperators(where_);

					const queryString =
						where && where.length > 0
							? queryBuilder((q) => {
									const eqs = where.map((w) =>
										//@ts-ignore
										q[w.operator || "eq"](w.field, w.value),
									);
									if (eqs.length === 1) return eqs[0];
									return eqs.reduce((acc, cur, indx) =>
										q[
											(where[indx - 1].connector || "AND").toLowerCase() as
												| "and"
												| "or"
										](acc, cur),
									);
								})
							: null;
					if (typeof offset === "number") {
						let continueCursor = undefined;
						let isDone = false;

						const results = [];

						while (!isDone) {
							const opts = (await db({
								action: "query",
								tableName: model,
								query: queryString ?? undefined,
								order: sortBy?.direction,
								single: false,
								limit: limit,
								paginationOpts: {
									numItems: 100,
									cursor: continueCursor,
								},
							})) as PaginationResult<any>;
							continueCursor = opts.continueCursor;
							results.push(...opts.page);
							if (results.length >= offset + (limit || 1)) {
								isDone = true;
								const result = limit
									? results.slice(offset, offset + limit)
									: results.slice(offset);

								return result;
							}
						}
					} else {
						const res = await db({
							action: "query",
							tableName: model,
							query: queryString ? queryString : undefined,
							order: sortBy?.direction,
							single: false,
							limit: limit,
						});
						return res;
					}
				},
				async update({ model, where: where_, update }) {
					filterInvalidOperators(where_);
					const where = transformWhereOperators(where_);
					console.log(update, where);
					const res = await db({
						action: "update",
						tableName: model,
						query: queryBuilder((q) => {
							const eqs = where.map((w) =>
								//@ts-ignore
								q[w.operator || "eq"](w.field, w.value),
							);
							return eqs.reduce((acc, cur, indx) =>
								q[
									(where[indx - 1].connector || "AND").toLowerCase() as
										| "and"
										| "or"
								](acc, cur),
							);
						}),
						update: update as any,
					});
					console.log(`Result:`, res);
					return res;
				},
				async updateMany({ model, where: where_, update }) {
					filterInvalidOperators(where_);
					const where = transformWhereOperators(where_);
					const res = await db({
						action: "update",
						tableName: model,
						query: queryBuilder((q) => {
							const eqs = where.map((w) =>
								//@ts-ignore
								q[w.operator || "eq"](w.field, w.value),
							);
							return eqs.reduce((acc, cur, indx) =>
								q[
									(where[indx - 1].connector || "AND").toLowerCase() as
										| "and"
										| "or"
								](acc, cur),
							);
						}),
						update: update as any,
					});
					return res;
				},
				async delete({ model, where: where_ }) {
					filterInvalidOperators(where_);
					const where = transformWhereOperators(where_);
					const res = await db({
						action: "delete",
						tableName: model,
						query: queryBuilder((q) => {
							const eqs = where.map((w) =>
								//@ts-ignore
								q[w.operator || "eq"](w.field, w.value),
							);
							return eqs.reduce((acc, cur, indx) =>
								q[
									(where[indx - 1].connector || "AND").toLowerCase() as
										| "and"
										| "or"
								](acc, cur),
							);
						}),
					});
					return res;
				},
				async deleteMany({ model, where: where_ }) {
					filterInvalidOperators(where_);
					const where = transformWhereOperators(where_);
					const res = await db({
						action: "delete",
						tableName: model,
						query: queryBuilder((q) => {
							const eqs = where.map((w) =>
								//@ts-ignore
								q[w.operator || "eq"](w.field, w.value),
							);
							return eqs.reduce((acc, cur, indx) =>
								q[
									(where[indx - 1].connector || "AND").toLowerCase() as
										| "and"
										| "or"
								](acc, cur),
							);
						}),
						deleteAll: true,
					});
					return res;
				},
				async count({ model, where: where_ }) {
					filterInvalidOperators(where_);
					const where = transformWhereOperators(where_);
					const res = await db({
						action: "count",
						tableName: model,
						query: queryBuilder((q) => {
							const eqs = where.map((w) =>
								//@ts-ignore
								q[w.operator || "eq"](w.field, w.value),
							);
							return eqs.reduce((acc, cur, indx) =>
								q[
									(where[indx - 1].connector || "AND").toLowerCase() as
										| "and"
										| "or"
								](acc, cur),
							);
						}),
					});
					return res;
				},
			};
		},
	});
