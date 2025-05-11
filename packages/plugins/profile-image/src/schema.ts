import type { AuthPluginSchema } from "better-auth";

export const schema = {
	profileImage: {
		fields: {
			userId: {
				type: "string",
				required: true,
				input: false,
			},
			url: {
				type: "string",
				required: true,
				input: false,
			},
			key: {
				type: "string",
				required: false,
				input: false,
			},
			filename: {
				type: "string",
				required: false,
				input: false,
			},
			mimeType: {
				type: "string",
				required: true,
				input: false,
			},
			size: {
				type: "number",
				required: true,
				input: false,
			},
			createdAt: {
				type: "date",
				required: true,
				input: false,
				defaultValue: () => new Date(),
			},
			updatedAt: {
				type: "date",
				required: true,
				input: false,
				defaultValue: () => new Date(),
			},
		},
	},
} satisfies AuthPluginSchema;

export type ProfileImageEntry = {
	id: string;
	userId: string;
	url: string;
	key?: string;
	filename?: string;
	mimeType: string;
	size: number;
	createdAt: Date;
	updatedAt: Date;
};
