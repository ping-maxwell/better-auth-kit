import type {
	AnyDataModel,
	MutationBuilder,
	QueryBuilder,
} from "convex/server";
import type { AdapterDebugLogs } from "better-auth/adapters";

export type ConvexQuery = QueryBuilder<AnyDataModel, "public">;

export type ConvexAdapterOptions = {
	convex_dir_path?: string;
	debugLogs?: AdapterDebugLogs;
};

export type ConvexMutation = MutationBuilder<AnyDataModel, "public">;
