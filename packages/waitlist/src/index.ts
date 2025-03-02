import {
  generateId,
  type AuthContext,
  type BetterAuthPlugin,
  type EndpointContext,
} from "better-auth";
import { z, type ZodRawShape, type ZodTypeAny } from "zod";
import type { WaitlistOptions } from "./types";
import { schema, type WaitlistUser } from "./schema";
import { createAuthEndpoint, APIError } from "better-auth/api";
import {
  mergeSchema,
  type FieldAttribute,
  type InferFieldsInput,
} from "better-auth/db";
export * from "./types";

export const ERROR_CODES = {
  MAX_PARTICIPANTS_REACHED: "Maximum waitlist participants reached",
  USER_EXISTS: "User already exists in the waitlist",
} as const;

export const waitlist = (options?: WaitlistOptions) => {
  const opts = {
    enabled: options?.enabled ?? false,
    maximumWaitlistParticipants: options?.maximumWaitlistParticipants ?? null,
    schema: options?.schema,
    waitlistEndConfig: options?.waitlistEndConfig ?? {
      event: "max-signups-reached",
      maximumSignups: -1,
      onWaitlistEnd(users) {},
    },
    additionalFields: options?.additionalFields ?? {},
  } satisfies WaitlistOptions;

  const merged_schema = mergeSchema(schema, opts.schema);
  merged_schema.waitlist.fields = {
    ...merged_schema.waitlist.fields,
    ...opts.additionalFields,
  };

  type WaitlistUserModified = WaitlistUser &
    InferFieldsInput<typeof opts.additionalFields>;

  return {
    id: "waitlist",
    schema: merged_schema,
    $ERROR_CODES: ERROR_CODES,
    endpoints: {
      addWaitlistUser: createAuthEndpoint(
        "/waitlist/add-user",
        {
          method: "POST",
          body: convertAdditionalFieldsToZodSchema({
            ...opts.additionalFields,
            email: { type: "string", required: true },
            name: { type: "string", required: true },
          }) as never as z.ZodType<Omit<WaitlistUser, "id" | "joinedAt">>,
        },
        async (ctx) => {
          const model = Object.keys(merged_schema)[0] as string;
          const { email, name, ...everythingElse } = ctx.body as {
            email: string;
            name: string;
          } & Record<string, any>;

          const found = await ctx.context.adapter.findOne<WaitlistUserModified>(
            {
              model: model,
              where: [{ field: "email", value: email, operator: "eq" }],
            },
          );
          if (found) {
            throw new APIError("BAD_REQUEST", {
              message: ERROR_CODES.USER_EXISTS,
            });
          }

          let count: number | null = null;

          if (opts.maximumWaitlistParticipants) {
            count = await ctx.context.adapter.count({
              model: model,
            });

            if (count >= opts.maximumWaitlistParticipants) {
              throw new APIError("BAD_REQUEST", {
                message: ERROR_CODES.MAX_PARTICIPANTS_REACHED,
              });
            }
          }

          if (opts.waitlistEndConfig.event === "max-signups-reached") {
            if (count === null) {
              count = await ctx.context.adapter.count({
                model: model,
              });
            }
            if (count >= opts.waitlistEndConfig.maximumSignups) {
              const users = await getAllWaitlistUsers({
                ctx,
                modelName: model,
              });
              opts.waitlistEndConfig.onWaitlistEnd(users);
              return;
            }
          } else if (opts.waitlistEndConfig.event === "date-reached") {
            if (new Date() > opts.waitlistEndConfig.date) {
              const users = await getAllWaitlistUsers({
                ctx,
                modelName: model,
              });
              opts.waitlistEndConfig.onWaitlistEnd(users);
              return;
            }
          } else if (opts.waitlistEndConfig.event === "trigger-function") {
            opts.waitlistEndConfig.triggerFunction(async () => {
              const users = await getAllWaitlistUsers({
                ctx,
                modelName: model,
              });
              opts.waitlistEndConfig.onWaitlistEnd(users);
              return;
            });
          }

          const res = await ctx.context.adapter.create<WaitlistUserModified>({
            model: model,
            data: {
              email,
              name,
              id: generateId(),
              joinedAt: new Date(),
              ...everythingElse,
            },
          });

          return ctx.json(res);
        },
      ),
      // removeWaitlistUser: createAuthEndpoint(
      //   "/waitlist/remove-user",
      //   {
      //     method: "POST",
      //     body: z.object({
      //       email: z.string().email(),
      //     }),
      //   },
      //   async (ctx) => {
      //     const { email } = ctx.request.body;

      //     const res = await ctx.context.adapter.delete({
      //       model: model,
      //       where: [{ field: "email", value: email, operator: "eq" }],
      //     });

      //     return ctx.json(res);
      //   },
      // ),
    },
  } satisfies BetterAuthPlugin;
};

function convertAdditionalFieldsToZodSchema(
  additionalFields: Record<string, FieldAttribute>,
) {
  const additionalFieldsZodSchema: ZodRawShape = {};
  for (const [key, value] of Object.entries(additionalFields)) {
    let res: ZodTypeAny;

    if (value.type === "string") {
      res = z.string();
    } else if (value.type === "number") {
      res = z.number();
    } else if (value.type === "boolean") {
      res = z.boolean();
    } else if (value.type === "date") {
      res = z.date();
    } else if (value.type === "string[]") {
      res = z.array(z.string());
    } else {
      res = z.array(z.number());
    }

    if (!value.required) {
      res = res.optional();
    }

    additionalFieldsZodSchema[key] = res;
  }
  return z.object(additionalFieldsZodSchema);
}

async function getAllWaitlistUsers({
  ctx,
  modelName,
  allUserCount,
}: {
  ctx: EndpointContext<
    string,
    {
      method: "POST";
      body: z.ZodObject<
        z.ZodRawShape,
        "strip",
        z.ZodTypeAny,
        {
          [x: string]: any;
        },
        {
          [x: string]: any;
        }
      >;
    },
    AuthContext
  >;
  modelName: string;
  allUserCount?: number;
}) {
  allUserCount =
    allUserCount ??
    (await ctx.context.adapter.count({
      model: modelName,
    }));
  const allUsers = await ctx.context.adapter.findMany<WaitlistUser>({
    model: modelName,
    limit: allUserCount,
  });
  return allUsers;
}
