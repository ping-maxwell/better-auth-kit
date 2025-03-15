import type {
	AnyDataModel,
	MutationBuilder,
	QueryBuilder,
} from "convex/server";

export type ConvexQuery = QueryBuilder<AnyDataModel, "public">;

export type ConvexAdapterOptions = {
	convex_dir_path?: string;
	enable_debug_logs?: boolean;
};

export type ConvexMutation = MutationBuilder<AnyDataModel, "public">;
