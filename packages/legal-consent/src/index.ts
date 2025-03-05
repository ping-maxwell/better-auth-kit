import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import type { FieldAttribute, FieldType } from "better-auth/db";

export interface LegalConsentOptions {
  /**
   * Wether the user must accept the terms of service.
   */
  requireTOS?: boolean;
  /**
   * Wether the user must accept the privacy policy.
   */
  requirePrivacyPolicy?: boolean;
  /**
   * Wether the user must be above a certain age.
   */
  requireAgeVerification?: boolean;
  /**
   * Wether the user must accept the marketing consent.
   */
  requireMarketingConsent?: boolean;
  /**
   * Wether the user must accept the cookie consent.
   */
  requireCookieConsent?: boolean;
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
  } satisfies LegalConsentOptions;

  const schemaFields: Record<string, FieldAttribute<FieldType>> = {};

  if (opts.requireTOS) {
    schemaFields.tosAccepted = {
      type: "boolean",
      input: true,
      required: true,
      fieldName: opts.schema.tosAccepted,
      defaultValue: false,
    };
  }
  if (opts.requirePrivacyPolicy) {
    schemaFields.privacyPolicyAccepted = {
      type: "boolean",
      input: true,
      required: true,
      fieldName: opts.schema.privacyPolicyAccepted,
      defaultValue: false,
    };
  }
  if (opts.requireAgeVerification) {
    schemaFields.ageVerified = {
      type: "boolean",
      input: true,
      required: true,
      fieldName: opts.schema.ageVerified,
      defaultValue: false,
    };
  }
  if (opts.requireMarketingConsent) {
    schemaFields.marketingConsentAccepted = {
      type: "boolean",
      input: true,
      required: true,
      fieldName: opts.schema.marketingConsentAccepted,
      defaultValue: false,
    };
  }
  if (opts.requireCookieConsent) {
    schemaFields.cookieConsentAccepted = {
      type: "boolean",
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
            if (
              opts.requireTOS &&
              body[opts.schema.tosAccepted] === undefined
            ) {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.TOS_NOT_ACCEPTED,
              });
            }

            if (
              opts.requirePrivacyPolicy &&
              body[opts.schema.privacyPolicyAccepted] === undefined
            ) {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.PRIVACY_NOT_ACCEPTED,
              });
            }

            if (
              opts.requireAgeVerification &&
              body[opts.schema.ageVerified] === undefined
            ) {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.AGE_NOT_ACCEPTED,
              });
            }

            if (
              opts.requireMarketingConsent &&
              body[opts.schema.marketingConsentAccepted] === undefined
            ) {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.MARKETING_NOT_ACCEPTED,
              });
            }

            if (
              opts.requireCookieConsent &&
              body[opts.schema.cookieConsentAccepted] === undefined
            ) {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.COOKIE_NOT_ACCEPTED,
              });
            }

            return {
              context: ctx,
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
