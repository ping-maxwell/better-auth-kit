import type { InferOptionSchema, User } from "better-auth";
import type { schema, WaitlistUser } from "./schema";
import type { FieldAttribute } from "better-auth/db";

interface WaitlistEndConfig_base {
  event: "max-signups-reached" | "date-reached" | "trigger-only";
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
  /**
   * The waitlist will end once your maximum signup count is reached.
   * 
   * Note: The `trigger` function will still work.
   */
  event: "max-signups-reached";
  /**
   * The maximum number of signups that can be reached before the waitlist ends.
   */
  maximumSignups: number;
}

interface WaitlistEndConfig_date extends WaitlistEndConfig_base {
  /**
   * When the given `date` value has reached, the waitlist ends. 
   * 
   * Note: This won't work if you're running Better Auth in a serverless enviroment.
   * 
   * The `trigger` function will still work.
   */
  event: "date-reached";
  /**
   * The date which the waitlist ends.
   */
  date: Date;
}

interface WaitlistEndConfig_trigger extends WaitlistEndConfig_base {
  /**
   * The only way to end the waitlist is for you to call the `trigger` function.
   */
  event: "trigger-only";
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
  /**
   * Wether to disable sign in & sign ups while the waitlist is active.
   * 
   * @default false
   */
  disableSignInAndSignUp?: boolean;
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
