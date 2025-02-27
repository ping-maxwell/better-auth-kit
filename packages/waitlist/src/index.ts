import type { BetterAuthPlugin } from "better-auth";
import type { WaitlistOptions } from "./types";
export * from "./types";

export const ERROR_CODES = {} as const;

export const waitlist = (options?: WaitlistOptions) => {
  const opts = {
    enabled: options?.enabled ?? false,
    maximumWaitlistParticipants: options?.maximumWaitlistParticipants ?? null,
    schema: options?.schema ?? {},
    waitlistEndConfig: options?.waitlistEndConfig ?? {
      event: "max-signups-reached",
      maximumSignups: -1,
    },
  } satisfies WaitlistOptions;

  return {
    id: "waitlist",
    schema: {
      waitlist: {
        fields: {
          email: {
            type: "string",
            required: true,
            input: true,
          },
          joinedAt: {
            type: "date",
            required: true,
            input: false,
            defaultValue: new Date(),
          },
          invitedBy: {
            type: "string",
            required: false,
            input: true,
            references: {
              field: "id",
              model: "waitlist",
              onDelete: "cascade",
            },
            defaultValue: null,
          },
        },
      },
      waitlistInvites: {
        fields: {
          email: {
            type: "string",
            required: true,
            input: true,
          },
          invitedBy: {
            type: "string",
            required: false,
            input: true,
            references: {
              field: "id",
              model: "waitlist",
              onDelete: "cascade",
            },
            defaultValue: null,
          },
          createdAt: {
            type: "date",
            required: true,
            input: false,
            defaultValue: new Date(),
          },
          expiresAt: {
            type: "date",
            required: false,
            input: false,
          },
        },
      },
    },
    $ERROR_CODES: ERROR_CODES,
  } satisfies BetterAuthPlugin;
};
