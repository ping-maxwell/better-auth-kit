import { APIError } from "better-auth/api";
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
export declare const ERROR_CODES: {
    readonly TOS_NOT_ACCEPTED: "TOS must be accepted";
    readonly PRIVACY_NOT_ACCEPTED: "Privacy must be accepted";
    readonly AGE_NOT_ACCEPTED: "Age must be accepted";
    readonly MARKETING_NOT_ACCEPTED: "Marketing must be accepted";
    readonly COOKIE_NOT_ACCEPTED: "Cookie must be accepted";
};
export declare const legalConsent: (options?: LegalConsentOptions) => {
    id: "legal-consent";
    hooks: {
        before: {
            matcher: (context: import("better-auth").HookEndpointContext<{}>) => boolean;
            handler: import("better-call").Endpoint<import("better-call").Handler<string, import("better-call").EndpointOptions, {
                context: {
                    body: {
                        [x: string]: any;
                    };
                    context: import("better-auth").AuthContext & {
                        returned?: APIError | Response | Record<string, any>;
                        endpoint: import("better-call").Endpoint;
                    };
                    request: Request | undefined;
                    headers: Headers | undefined;
                    params?: Record<string, string> | undefined;
                    query?: Record<string, string> | undefined;
                    path: string;
                    setHeader: (key: string, value: string) => void;
                    setCookie: (key: string, value: string, options?: import("better-call").CookieOptions) => void;
                    getCookie: (key: string, prefix?: import("better-call").CookiePrefixOptions) => string | undefined;
                    setSignedCookie: (key: string, value: string, secret: string | BufferSource, options?: import("better-call").CookieOptions) => Promise<void>;
                    getSignedCookie: (key: string, secret: string, prefix?: import("better-call").CookiePrefixOptions) => Promise<string | undefined>;
                    redirect: (url: string) => APIError;
                    json: <T>(body: T, option?: {
                        status?: number;
                        statusText?: string;
                        headers?: Record<string, string>;
                        body?: any;
                    }) => {
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: T;
                        _flag: "json";
                    };
                    responseHeader: Headers;
                } | {
                    body: {
                        [x: string]: any;
                    };
                    context: import("better-auth").AuthContext & {
                        returned?: APIError | Response | Record<string, any>;
                        endpoint: import("better-call").Endpoint;
                    };
                    request: Request | undefined;
                    headers?: Headers | undefined;
                    params?: Record<string, string> | undefined;
                    query?: Record<string, string> | undefined;
                    path: string;
                    setHeader: (key: string, value: string) => void;
                    setCookie: (key: string, value: string, options?: import("better-call").CookieOptions) => void;
                    getCookie: (key: string, prefix?: import("better-call").CookiePrefixOptions) => string | undefined;
                    setSignedCookie: (key: string, value: string, secret: string | BufferSource, options?: import("better-call").CookieOptions) => Promise<void>;
                    getSignedCookie: (key: string, secret: string, prefix?: import("better-call").CookiePrefixOptions) => Promise<string | undefined>;
                    redirect: (url: string) => APIError;
                    json: <T>(body: T, option?: {
                        status?: number;
                        statusText?: string;
                        headers?: Record<string, string>;
                        body?: any;
                    }) => {
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: T;
                        _flag: "json";
                    };
                    responseHeader: Headers;
                } | {
                    body: {
                        [x: string]: any;
                    };
                    context: import("better-auth").AuthContext & {
                        returned?: APIError | Response | Record<string, any>;
                        endpoint: import("better-call").Endpoint;
                    };
                    request?: Request | undefined;
                    headers: Headers | undefined;
                    params?: Record<string, string> | undefined;
                    query?: Record<string, string> | undefined;
                    path: string;
                    setHeader: (key: string, value: string) => void;
                    setCookie: (key: string, value: string, options?: import("better-call").CookieOptions) => void;
                    getCookie: (key: string, prefix?: import("better-call").CookiePrefixOptions) => string | undefined;
                    setSignedCookie: (key: string, value: string, secret: string | BufferSource, options?: import("better-call").CookieOptions) => Promise<void>;
                    getSignedCookie: (key: string, secret: string, prefix?: import("better-call").CookiePrefixOptions) => Promise<string | undefined>;
                    redirect: (url: string) => APIError;
                    json: <T>(body: T, option?: {
                        status?: number;
                        statusText?: string;
                        headers?: Record<string, string>;
                        body?: any;
                    }) => {
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: T;
                        _flag: "json";
                    };
                    responseHeader: Headers;
                } | {
                    body: {
                        [x: string]: any;
                    };
                    context: import("better-auth").AuthContext & {
                        returned?: APIError | Response | Record<string, any>;
                        endpoint: import("better-call").Endpoint;
                    };
                    request?: Request | undefined;
                    headers?: Headers | undefined;
                    params?: Record<string, string> | undefined;
                    query?: Record<string, string> | undefined;
                    path: string;
                    setHeader: (key: string, value: string) => void;
                    setCookie: (key: string, value: string, options?: import("better-call").CookieOptions) => void;
                    getCookie: (key: string, prefix?: import("better-call").CookiePrefixOptions) => string | undefined;
                    setSignedCookie: (key: string, value: string, secret: string | BufferSource, options?: import("better-call").CookieOptions) => Promise<void>;
                    getSignedCookie: (key: string, secret: string, prefix?: import("better-call").CookiePrefixOptions) => Promise<string | undefined>;
                    redirect: (url: string) => APIError;
                    json: <T>(body: T, option?: {
                        status?: number;
                        statusText?: string;
                        headers?: Record<string, string>;
                        body?: any;
                    }) => {
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: T;
                        _flag: "json";
                    };
                    responseHeader: Headers;
                };
            }>, import("better-call").EndpointOptions>;
        }[];
    };
    schema: {
        user: {
            fields: Record<string, FieldAttribute<FieldType>>;
            modelName: string;
        };
    };
    $ERROR_CODES: {
        readonly TOS_NOT_ACCEPTED: "TOS must be accepted";
        readonly PRIVACY_NOT_ACCEPTED: "Privacy must be accepted";
        readonly AGE_NOT_ACCEPTED: "Age must be accepted";
        readonly MARKETING_NOT_ACCEPTED: "Marketing must be accepted";
        readonly COOKIE_NOT_ACCEPTED: "Cookie must be accepted";
    };
};
