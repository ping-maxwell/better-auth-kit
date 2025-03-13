import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	message: defineTable({
		x: v.number(),
	}),
});
