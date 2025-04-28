import type { User } from "better-auth";
import type { FieldAttribute } from "better-auth/db";

export interface FeedbackOptions {
	/**
	 * Minimum length of feedback text
	 * @default 10
	 */
	minLength?: number;

	/**
	 * Maximum length of feedback text
	 * @default 500
	 */
	maxLength?: number;

	/**
	 * Optional limit to the number of feedbacks a user can submit
	 * @default undefined (no limit)
	 */
	feedbackLimit?: number;

	/**
	 * Optional function to determine if a user is allowed to submit feedback
	 * @default undefined (all users allowed)
	 */
	canSubmitFeedback?: (user: User) => boolean | Promise<boolean>;

	/**
	 * Whether authentication is required to submit feedback
	 * @default true (only authenticated users can submit feedback)
	 */
	requireAuth?: boolean;

	/**
	 * Custom schema configuration
	 */
	schema?: {
		feedback?: {
			modelName?: string;
			fields?: Record<string, string>;
		};
	};

	/**
	 * Additional fields to add to the feedback schema
	 */
	additionalFields?: Record<string, FieldAttribute>;
}
