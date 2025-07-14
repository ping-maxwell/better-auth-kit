import type { AuthPluginSchema } from "better-auth";

export const schema = {
	referrals: {
		fields: {
			userId: {
				type: "string",
				required: true as boolean,
				input: false,
			},
			referralCode: {
				type: "string",
				required: true,
				input: false,
			},
			referrerId: {
				type: "string",
				required: false,
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

export type ReferralEntry = {
	id: string;
	userId: string;
	referralCode: string;
	referrerId?: string;
	createdAt: Date;
};
