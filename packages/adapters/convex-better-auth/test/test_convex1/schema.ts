import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	messages: defineTable({
		author: v.string(),
		body: v.boolean(),
		optional_body: v.optional(v.boolean()),
	}),
	testTable: defineTable({
		say: v.string(),
		say2: v.boolean(),
		hello: v.int64(),
	}),
});
