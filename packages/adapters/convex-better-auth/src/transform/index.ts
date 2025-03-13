import { generateId } from "better-auth";
import { getAuthTables, type FieldAttribute } from "better-auth/db";
import type { ConvexAdapterOptions } from "../types";
import type { BetterAuthOptions, Where } from "better-auth";
import type { ConvexClient } from "convex/browser";
import {
  queryDb,
  deleteDb,
  insertDb,
  updateDb,
  countDb,
} from "./../convex_action/calls";

export const createTransform = ({
  config,
  options,
  client,
}: {
  config: ConvexAdapterOptions;
  options: BetterAuthOptions;
  client: ConvexClient;
}) => {
  const schema = getAuthTables(options);

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

  async function db(options: DbInsert | DbQuery | DbDelete | DbUpdate | DbCount) {
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

  const getModelName = (model: string) => {
    return schema[model].modelName !== model ? schema[model].modelName : model;
  };

  function filterInvalidOperators(where: Where[] | undefined): void {
    if (!where) return;
    const invalidOps = ["contains", "starts_with", "ends_with"];
    if (where.filter((w) => invalidOps.includes(w.operator || "")).length > 0) {
      throw new Error(
        `Convex does not support ${invalidOps.join(", ")} operators`,
      );
    }
  }

  const useDatabaseGeneratedId = options?.advanced?.generateId === false;
  return {
    transformInput(
      data: Record<string, any>,
      model: string,
      action: "create" | "update",
    ) {
      const transformedData: Record<string, any> =
        useDatabaseGeneratedId || action === "update"
          ? {}
          : {
              id: options.advanced?.generateId
                ? options.advanced.generateId({
                    model,
                  })
                : data.id || generateId(),
            };
      const fields = schema[model].fields;
      for (const field in fields) {
        const value = data[field];
        if (value === undefined && !fields[field].defaultValue) {
          continue;
        }
        transformedData[fields[field].fieldName || field] = withApplyDefault(
          value,
          fields[field],
          action,
        );
      }
      for (const field in transformedData) {
        if (field === "id") {
          delete transformedData[field];
        } else if (field === "createdAt") {
          delete transformedData[field];
        } else if (transformedData[field] instanceof Date) {
          transformedData[field] = transformedData[field].toISOString();
        }
      }
      return transformedData;
    },
    transformOutput(data: Record<string, any>, model: string) {
      for (const field in data) {
        const modelname = getModelName(model);
        // convert any fields that are dates to Date objects
        if (schema[modelname]?.fields[field]?.type === "date") {
          data[field] = new Date(data[field]);
        }
        // convert Convex default values to their corresponding Better Auth supported names.
        if (field === "_id") {
          data.id = data[field];
          delete data[field];
        } else if (field === "_creationTime") {
          data.createdAt = new Date(data[field]);
          delete data[field];
        }
      }
      return data;
    },
    getModelName,
    db,
    filterInvalidOperators,
    transformWhereOperators,
  };
};

function withApplyDefault(
  value: any,
  field: FieldAttribute,
  action: "create" | "update",
) {
  if (action === "update") return value;
  if (value === undefined || value === null) {
    if (field.defaultValue) {
      if (typeof field.defaultValue === "function") {
        return field.defaultValue();
      }
      return field.defaultValue;
    }
  }
  return value;
}
