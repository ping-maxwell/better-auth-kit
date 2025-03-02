import type { InferOptionSchema, User } from "better-auth";
import type { schema, WaitlistUser } from "./schema";
import type { FieldAttribute } from "better-auth/db";

interface WaitlistEndConfig_base {
  event: "max-signups-reached" | "date-reached" | "trigger-function";
  onWaitlistEnd: (
    /**
     * The users that are currently in the waitlist.
     * From here, you could either immediately migrate them to a new user, send them emails to inform them of the waitlist end, or do whatever you want.
     *
     * Note: If you extended the waitlist schema, then the type definition for the waitlistUser will be incorrect.
     */
    users: WaitlistUser[],
  ) => void;
}

interface WaitlistEndConfig_maxSignups extends WaitlistEndConfig_base {
  event: "max-signups-reached";
  /**
   * The maximum number of signups that can be reached before the waitlist ends.
   */
  maximumSignups: number;
}

interface WaitlistEndConfig_date extends WaitlistEndConfig_base {
  event: "date-reached";
  /**
   * The date which the waitlist ends.
   */
  date: Date;
}

interface WaitlistEndConfig_trigger extends WaitlistEndConfig_base {
  event: "trigger-function";
  /**
   * The function which provides a `trigger` which you can call at any time to end the waitlist.
   *
   * @example
   * ```ts
   * const waitlistEndConfig = {
   *   event: "custom-trigger-function",
   *   triggerFunction: (trigger) => {
   *     setTimeout(() => {
   *       trigger();
   *     }, 1000 * 60 * 60 * 24); // triggers at the end of 24 hours
   *   }
   * }
   * ```
   */
  triggerFunction: (trigger: () => void) => void;
}

export type WaitlistEndConfig =
  | WaitlistEndConfig_maxSignups
  | WaitlistEndConfig_date
  | WaitlistEndConfig_trigger;

interface WaitlistOptions_base {
  /**
   * The maximum number of users that can be added to the waitlist.
   * If null, there is no limit.
   *
   * @default null
   */
  maximumWaitlistParticipants?: number | null;
  /**
   * schema for the waitlist plugin. Use this to rename fields.
   */
  schema?: InferOptionSchema<typeof schema>;
  /**
   * Extend the `waitlist` schema with additional fields.
   */
  additionalFields?: Record<string, FieldAttribute>;
}

interface WaitlistOptions_enabled extends WaitlistOptions_base {
  /**
   * Whether the waitlist is enabled.
   *
   * @default false
   */
  enabled: true;
  /**
   * The configuration for when the waitlist ends.
   */
  waitlistEndConfig: WaitlistEndConfig;
}

interface WaitlistOptions_disabled extends WaitlistOptions_base {
  /**
   * Whether the waitlist is enabled.
   *
   * @default false
   */
  enabled: false;
  /**
   * The configuration for when the waitlist ends.
   */
  waitlistEndConfig?: WaitlistEndConfig;
}

export type WaitlistOptions =
  | WaitlistOptions_enabled
  | WaitlistOptions_disabled;
