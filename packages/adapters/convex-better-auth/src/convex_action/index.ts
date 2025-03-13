import type {
  ActionBuilder,
  MutationBuilder,
  PaginationOptions,
  QueryBuilder,
  RegisteredAction,
  RegisteredMutation,
  RegisteredQuery,
} from "convex/server";
import { v } from "convex/values";
import { stringToQuery } from "./helpers";

function replaceFields(key: string) {
  switch (key) {
    case "id":
      return "_id";
    case "createdAt":
      return "_creationTime";
    default:
      return key;
  }
}

const q_ = {
  eq: (key: string, value: any) =>
    `q.eq(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  add: (key: string, value: any) =>
    `q.add(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  sub: (key: string, value: any) =>
    `q.sub(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  mul: (key: string, value: any) =>
    `q.mul(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  div: (key: string, value: any) =>
    `q.div(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  mod: (key: string, value: any) =>
    `q.mod(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  neg: (key: string, value: any) =>
    `q.neg(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  gt: (key: string, value: any) =>
    `q.gt(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  lt: (key: string, value: any) =>
    `q.lt(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  gte: (key: string, value: any) =>
    `q.gte(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  lte: (key: string, value: any) =>
    `q.lte(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  in: (key: string, value: any) =>
    `q.in(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  ne: (key: string, value: any) =>
    `q.neq(q.field("${replaceFields(key)}"), ${JSON.stringify(value)})`,
  and: (...args: any[]) => `q.and(${args.join(", ")})`,
  or: (...args: any[]) => `q.or(${args.join(", ")})`,
};

export function queryBuilder(cb: (q: typeof q_) => string) {
  return cb(q_);
}

export type ConvexReturnType = {
  betterAuth: RegisteredAction<
    "public",
    {
      action: string;
      value: any;
    },
    Promise<any>
  >;
  query: RegisteredQuery<
    "internal",
    {
      tableName: string;
      query?: string;
      order?: "asc" | "desc";
      single?: boolean;
      limit?: number;
      offset?: number;
    },
    Promise<any>
  >;
  insert: RegisteredMutation<
    "internal",
    {
      tableName: string;
      values: Record<string, any>;
    },
    Promise<any>
  >;
  update: RegisteredMutation<
    "internal",
    {
      tableName: string;
      query: any;
      update: any;
    },
    void
  >;
  delete_: RegisteredMutation<
    "internal",
    {
      tableName: string;
      query: any;
      deleteAll?: boolean;
    },
    Promise<void>
  >;
};

export function ConvexHandler<
  Action extends ActionBuilder<any, "public"> = ActionBuilder<{}, "public">,
  Query extends QueryBuilder<any, "internal"> = QueryBuilder<{}, "internal">,
  Mutation extends MutationBuilder<any, "internal"> = MutationBuilder<
    {},
    "internal"
  >,
>({
  action,
  internalQuery,
  internalMutation,
  internal,
}: {
  action: Action;
  internalQuery: Query;
  internalMutation: Mutation;
  internal: {
    betterAuth: {
      query: any;
      insert: any;
      update: any;
      delete_: any;
    };
  } & Record<string, any>;
}): ConvexReturnType {
  const betterAuth = action({
    args: { action: v.string(), value: v.any() },
    handler: async (ctx, args) => {
      if (args.action === "query") {
        // console.log(`Query:`, args.value);

        const data = (await ctx.runQuery(internal.betterAuth.query, {
          query: args.value.query,
          tableName: args.value.tableName,
          limit: args.value.limit,
          offset: args.value.offset,
          order: args.value.order,
          single: args.value.single,
          paginationOpts: args.value.paginationOpts,
        })) as unknown as any;
        return data;
      }
      if (args.action === "insert") {
        try {
          const _id = await ctx.runMutation(internal.betterAuth.insert, {
            tableName: args.value.tableName,
            values: args.value.values,
          });
          return {
            _id: _id,
            ...args.value.values,
          };
        } catch (error) {
          return error;
        }
      }
      if (args.action === "update") {
        const res = await ctx.runMutation(internal.betterAuth.update, {
          tableName: args.value.tableName,
          query: args.value.query,
          update: args.value.update,
        });
        return res;
      }
      if (args.action === "delete") {
        const res = await ctx.runMutation(internal.betterAuth.delete_, {
          tableName: args.value.tableName,
          query: args.value.query,
          deleteAll: args.value.deleteAll,
        });
        return res;
      }
    },
  });
  const query = internalQuery({
    args: {
      tableName: v.string(),
      query: v.optional(v.any()),
      /**
       * asc or desc
       */
      order: v.optional(v.string()),
      /**
       * Only get the first.
       */
      single: v.optional(v.boolean()),
      limit: v.optional(v.number()),
      paginationOpts: v.optional(
        v.object({
          numItems: v.optional(v.number()),
          cursor: v.optional(v.string()),
        }),
      ),
    },
    //@ts-ignore
    handler: async (
      ctx,
      args: {
        tableName: string;
        query?: string;
        order?: "asc" | "desc";
        single?: boolean;
        limit?: number;
        paginationOpts?: { numItems: number; cursor?: string };
      },
    ) => {
      let query = ctx.db.query(args.tableName).order(args.order || "asc");

      if (args.query) {
        query = query.filter((q) => {
          return stringToQuery(args.query!, q);
        });
      }
      if (args.paginationOpts) {
        return await query.paginate(args.paginationOpts as PaginationOptions);
      }
      if (args.single === true) {
        return await query.first();
      }
      if (typeof args.limit === "number") {
        return await query.take(args.limit);
      }
      return await query.collect();
    },
  });

  const insert = internalMutation({
    args: {
      tableName: v.string(),
      values: v.any(),
    },
    handler: async (
      ctx,
      args: {
        tableName: string;
        values: Record<string, any>;
      },
    ) => {
      return await ctx.db.insert(args.tableName, args.values);
    },
  });

  const update = internalMutation({
    args: {
      tableName: v.string(),
      query: v.any(),
      update: v.any(),
    },
    async handler(ctx, { tableName, update, query }) {
      const res = await ctx.db
        .query(tableName)
        .filter((q) => {
          return stringToQuery(query, q);
        })
        .first();
      //If no result found for that query, than there is no mutation needed.
      if (!res) return;
      await ctx.db.patch(res._id, update);
      return Object.assign(res, update);
    },
  });

  const delete_ = internalMutation({
    args: {
      tableName: v.string(),
      query: v.any(),
      deleteAll: v.optional(v.boolean()),
    },
    async handler(ctx, { tableName, query, deleteAll }) {
      const r = ctx.db.query(tableName).filter((q) => {
        return stringToQuery(query, q);
      });
      if (!deleteAll) {
        const res = await r.first();
        //If no result found for that query, than there is no mutation needed.
        if (!res) return;
        await ctx.db.delete(res._id);
        return;
      }
      const res = await r.collect();
      if (!res) return;
      res.forEach((r) => {
        ctx.db.delete(r._id);
      });
      return;
    },
  });

  return { betterAuth, query, insert, update, delete_ };
}
