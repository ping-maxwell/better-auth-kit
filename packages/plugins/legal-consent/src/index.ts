import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import type { FieldAttribute, FieldType } from "better-auth/db";

export interface LegalConsentOptions {
	/**
	 * Wether the user must accept the terms of service.
	 */
	requireTOS?: boolean;
	/**
	 * The version of the terms of service.
	 * If not provided, we will save the boolean value. Otherwise, we will save the version string.
	 */
	TosVersion?: string;
	/**
	 * Wether the user must accept the privacy policy.
	 */
	requirePrivacyPolicy?: boolean;
	/**
	 * The version of the privacy policy.
	 * If not provided, we will save the boolean value. Otherwise, we will save the version string.
	 */
	PrivacyPolicyVersion?: string;
	/**
	 * Wether the user must be above a certain age.
	 */
	requireAgeVerification?: boolean;
	/**
	 * The version of the age verification.
	 * If not provided, we will save the boolean value. Otherwise, we will save the version string.
	 */
	AgeVerificationVersion?: string;
	/**
	 * Wether the user must accept the marketing consent.
	 */
	requireMarketingConsent?: boolean;
	/**
	 * The version of the marketing consent.
	 * If not provided, we will save the boolean value. Otherwise, we will save the version string.
	 */
	MarketingConsentVersion?: string;
	/**
	 * Wether the user must accept the cookie consent.
	 */
	requireCookieConsent?: boolean;
	/**
	 * The version of the cookie consent.
	 * If not provided, we will save the boolean value. Otherwise, we will save the version string.
	 */
	CookieConsentVersion?: string;
	/**
	 * Adjust the default schema configuration values.
	 */
	schema?: {
		/**
		 * The name of the user model.
		 *
		 * @default "user"
		 */
		userModelName: string;
		/**
		 * The name of the `tosAccepted` field.
		 *
		 * @default "tosAccepted"
		 */
		tosAccepted: string;
		/**
		 * The name of the `privacyPolicyAccepted` field.
		 */
		privacyPolicyAccepted: string;
		/**
		 * The name of the `ageVerified` field.
		 */
		ageVerified: string;
		/**
		 * The name of the `marketingConsentAccepted` field.
		 */
		marketingConsentAccepted: string;
		/**
		 * The name of the `cookieConsentAccepted` field.
		 */
		cookieConsentAccepted: string;
	};
}

export const ERROR_CODES = {
	TOS_NOT_ACCEPTED: "TOS must be accepted",
	PRIVACY_NOT_ACCEPTED: "Privacy must be accepted",
	AGE_NOT_ACCEPTED: "Age must be accepted",
	MARKETING_NOT_ACCEPTED: "Marketing must be accepted",
	COOKIE_NOT_ACCEPTED: "Cookie must be accepted",
} as const;

export const legalConsent = (options?: LegalConsentOptions) => {
	const opts = {
		requireAgeVerification: options?.requireAgeVerification ?? false,
		requireTOS: options?.requireTOS ?? false,
		requirePrivacyPolicy: options?.requirePrivacyPolicy ?? false,
		requireMarketingConsent: options?.requireMarketingConsent ?? false,
		requireCookieConsent: options?.requireCookieConsent ?? false,
		schema: {
			userModelName: options?.schema?.userModelName ?? "user",
			tosAccepted: options?.schema?.tosAccepted ?? "tosAccepted",
			ageVerified: options?.schema?.ageVerified ?? "ageVerified",
			marketingConsentAccepted:
				options?.schema?.marketingConsentAccepted ?? "marketingConsentAccepted",
			privacyPolicyAccepted:
				options?.schema?.privacyPolicyAccepted ?? "privacyPolicyAccepted",
			cookieConsentAccepted:
				options?.schema?.cookieConsentAccepted ?? "cookieConsentAccepted",
		},
		TosVersion: options?.TosVersion,
		PrivacyPolicyVersion: options?.PrivacyPolicyVersion,
		AgeVerificationVersion: options?.AgeVerificationVersion,
		MarketingConsentVersion: options?.MarketingConsentVersion,
		CookieConsentVersion: options?.CookieConsentVersion,
	} satisfies LegalConsentOptions;

	const schemaFields: Record<string, FieldAttribute<FieldType>> = {};

	if (opts.requireTOS) {
		schemaFields.tosAccepted = {
			type: opts.TosVersion ? "string" : "boolean",
			input: true,
			required: true,
			fieldName: opts.schema.tosAccepted,
			defaultValue: false,
		};
	}
	if (opts.requirePrivacyPolicy) {
		schemaFields.privacyPolicyAccepted = {
			type: opts.PrivacyPolicyVersion ? "string" : "boolean",
			input: true,
			required: true,
			fieldName: opts.schema.privacyPolicyAccepted,
			defaultValue: false,
		};
	}
	if (opts.requireAgeVerification) {
		schemaFields.ageVerified = {
			type: opts.AgeVerificationVersion ? "string" : "boolean",
			input: true,
			required: true,
			fieldName: opts.schema.ageVerified,
			defaultValue: false,
		};
	}
	if (opts.requireMarketingConsent) {
		schemaFields.marketingConsentAccepted = {
			type: opts.MarketingConsentVersion ? "string" : "boolean",
			input: true,
			required: true,
			fieldName: opts.schema.marketingConsentAccepted,
			defaultValue: false,
		};
	}
	if (opts.requireCookieConsent) {
		schemaFields.cookieConsentAccepted = {
			type: opts.CookieConsentVersion ? "string" : "boolean",
			input: true,
			required: true,
			fieldName: opts.schema.cookieConsentAccepted,
			defaultValue: false,
		};
	}

	return {
		id: "legal-consent",
		hooks: {
			before: [
				{
					matcher: (context) => context.path.startsWith("/sign-up/email"),
					handler: createAuthMiddleware(async (ctx) => {
						const body = ctx.body;
						const newBody = { ...body };

						if (opts.requireTOS) {
							if (!body[opts.schema.tosAccepted])
								throw new APIError("BAD_REQUEST", {
									message: ERROR_CODES.TOS_NOT_ACCEPTED,
								});

							newBody[opts.schema.tosAccepted] = opts.TosVersion ?? true;
						}

						if (opts.requirePrivacyPolicy) {
							if (!body[opts.schema.privacyPolicyAccepted])
								throw new APIError("BAD_REQUEST", {
									message: ERROR_CODES.PRIVACY_NOT_ACCEPTED,
								});

							newBody[opts.schema.privacyPolicyAccepted] =
								opts.PrivacyPolicyVersion ?? true;
						}

						if (opts.requireAgeVerification) {
							if (!body[opts.schema.ageVerified])
								throw new APIError("BAD_REQUEST", {
									message: ERROR_CODES.AGE_NOT_ACCEPTED,
								});

							newBody[opts.schema.ageVerified] =
								opts.AgeVerificationVersion ?? true;
						}

						if (opts.requireMarketingConsent) {
							if (!body[opts.schema.marketingConsentAccepted])
								throw new APIError("BAD_REQUEST", {
									message: ERROR_CODES.MARKETING_NOT_ACCEPTED,
								});

							newBody[opts.schema.marketingConsentAccepted] =
								opts.MarketingConsentVersion ?? true;
						}

						if (opts.requireCookieConsent) {
							if (!body[opts.schema.cookieConsentAccepted])
								throw new APIError("BAD_REQUEST", {
									message: ERROR_CODES.COOKIE_NOT_ACCEPTED,
								});

							newBody[opts.schema.cookieConsentAccepted] =
								opts.CookieConsentVersion ?? true;
						}

						return {
							context: {
								...ctx,
								body: newBody,
							} as typeof ctx,
						};
					}),
				},
			],
		},
		schema: {
			user: {
				fields: schemaFields,
				modelName: opts.schema.userModelName,
			},
		},
		$ERROR_CODES: ERROR_CODES,
	} satisfies BetterAuthPlugin;
};
