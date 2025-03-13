import { mutation } from "./_generated/server";

export const removeAll = mutation({
  args: {},
  handler: async (ctx, args) => {
    //@ts-ignore
    const users = await ctx.db.query("user").collect();
    for (const user of users) {
      //@ts-ignore
      await ctx.db.delete(user._id);
    }
    //@ts-ignore
    const sessions = await ctx.db.query("session").collect();
    for (const session of sessions) {
      //@ts-ignore
      await ctx.db.delete(session._id);
    }
    //@ts-ignore
    const accounts = await ctx.db.query("account").collect();
    for (const acc of accounts) {
      //@ts-ignore
      await ctx.db.delete(acc._id);
    }
  },
});
