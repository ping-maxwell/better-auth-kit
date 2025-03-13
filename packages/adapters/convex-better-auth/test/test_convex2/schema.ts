import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	messages: defineTable({
		author: v.string(),
		body: v.boolean(),
		optional_body: v.optional(v.boolean()),
	}),
});
