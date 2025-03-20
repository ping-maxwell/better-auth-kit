import type { AuthPluginSchema } from "better-auth";
import { z } from "zod";

export const emailreverification = {
	emailreverification: {
		fields: {
			userId: {
				type: "string",
				references: {
					field: "id",
					model: "user",
					onDelete: "cascade",
				},
				required: true,
			},
			createdAt: {
				type: "date",
				required: true,
				defaultValue: () => new Date(),
			},
			type: {
				type: "string",
				required: true,
				validator: {
					input: z.enum(["link", "otp"]),
					output: z.enum(["link", "otp"]),
				},
			},
			value: {
				type: "string",
				required: true,
			},
		},
	},
} satisfies AuthPluginSchema;
