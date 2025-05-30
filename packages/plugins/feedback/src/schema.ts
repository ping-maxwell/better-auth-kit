import type { AuthPluginSchema } from "better-auth";

export const schema = {
	feedback: {
		fields: {
			userId: {
				type: "string",
				required: true as boolean,
				input: false,
			},
			text: {
				type: "string",
				required: true,
				input: true,
			},
			createdAt: {
				type: "date",
				required: true,
				input: false,
				defaultValue: () => new Date(),
			},
		},
	},
} satisfies AuthPluginSchema;

export type FeedbackEntry = {
	id: string;
	userId: string;
	text: string;
	createdAt: Date;
};
