import type { User } from "better-auth";
import type { FieldAttribute } from "better-auth/db";

export interface ReferralsOptions {
	/**
	 * Format for the URL referral
	 * @default "?ref="
	 */
	urlFormat?: string;

	/**
	 * Base URL for referral links
	 * @default "/" (homepage)
	 */
	baseUrl?: string;

	/**
	 * Length of the generated referral code
	 * @default 8
	 */
	codeLength?: number;

	/**
	 * Optional function to determine if a user can use referrals
	 * @default undefined (all users allowed)
	 */
	canUseReferrals?: (user: User) => boolean | Promise<boolean>;

	/**
	 * Optional custom referral code generator
	 * @default internal alphanumeric generator
	 */
	generateReferralCode?: (length: number) => string;

	/**
	 * Handler called when a referral is detected during signup
	 */
	onReferral?: (params: {
		userId: string;
		referrerId: string;
		referralCode: string;
	}) => Promise<void> | void;

	/**
	 * Custom schema configuration
	 */
	schema?: {
		referrals?: {
			modelName?: string;
			fields?: Record<string, string>;
		};
	};

	/**
	 * Additional fields to add to the referrals schema
	 */
	additionalFields?: Record<string, FieldAttribute>;
}
