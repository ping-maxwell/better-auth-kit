import type { AuthPluginSchema } from "better-auth";

export const schema = {
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
    },
  },
} satisfies AuthPluginSchema;

export type WaitlistUser = {
  id: string;
  email: string;
  name: string;
  joinedAt: Date;
};
