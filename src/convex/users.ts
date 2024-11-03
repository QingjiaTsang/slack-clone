import { query } from "./functions";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});
