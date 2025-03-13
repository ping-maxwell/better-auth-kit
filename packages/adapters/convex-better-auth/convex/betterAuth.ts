import { action, internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { ConvexHandler, type ConvexReturnType } from "../src/convex_action";

const { betterAuth, query, insert, update, delete_ } = ConvexHandler({
  action,
  internalQuery,
  internalMutation,
  internal,
}) as ConvexReturnType;

export { betterAuth, query, insert, update, delete_ };
