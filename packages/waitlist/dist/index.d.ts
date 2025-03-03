import { z } from "zod";
import type { WaitlistOptions } from "./types";
import { type WaitlistUser } from "./schema";
export * from "./types";
export * from "./client";
export declare const ERROR_CODES: {
    readonly MAX_PARTICIPANTS_REACHED: "Maximum waitlist participants reached";
    readonly USER_EXISTS: "User already exists in the waitlist";
};
export declare const waitlist: (options?: WaitlistOptions) => {
    id: "waitlist";
    schema: {
        waitlist: {
            fields: {
                email: {
                    type: "string";
                    required: true;
                    input: true;
                };
                joinedAt: {
                    type: "date";
                    required: true;
                    input: false;
                    defaultValue: Date;
                };
            };
        };
    };
    $ERROR_CODES: {
        readonly MAX_PARTICIPANTS_REACHED: "Maximum waitlist participants reached";
        readonly USER_EXISTS: "User already exists in the waitlist";
    };
    endpoints: {
        addWaitlistUser: {
            <C extends [{
                body: Omit<WaitlistUser, "joinedAt" | "id">;
                method?: "POST" | undefined;
                query?: Record<string, any> | undefined;
                params?: Record<string, any> | undefined;
                request?: Request | undefined;
                headers?: HeadersInit | undefined;
                asResponse?: boolean | undefined;
                returnHeaders?: boolean | undefined;
                use?: import("better-auth").Middleware[] | undefined;
                path?: string | undefined;
            }]>(...inputCtx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : C extends [{
                returnHeaders: true;
            }] ? {
                headers: Headers;
                response: (WaitlistUser & {
                    [x: string]: string | number | boolean | Date | string[] | number[] | (string & Record<never, never>);
                } & {
                    [x: string]: string | number | boolean | Date | string[] | number[] | (string & Record<never, never>) | null | undefined;
                }) | undefined;
            } : (WaitlistUser & {
                [x: string]: string | number | boolean | Date | string[] | number[] | (string & Record<never, never>);
            } & {
                [x: string]: string | number | boolean | Date | string[] | number[] | (string & Record<never, never>) | null | undefined;
            }) | undefined>;
            options: {
                method: "POST";
                body: z.ZodType<Omit<WaitlistUser, "id" | "joinedAt">>;
            } & {
                use: any[];
            };
            path: "/waitlist/add-user";
        };
    };
};
