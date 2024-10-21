import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Note: consistent error handling practice in this project:
// for query, it doesn't throws error in order to avoid error handling in RSC and RCC for code briefness
// but for mutation, it's allowed to throw errors because it's always using react-query to handle error in client side

export const createWorkspace = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const joinCode = Math.random().toString(36).substring(2, 8);

    const newWorkspaceId = await ctx.db.insert("workspaces", {
      name: name,
      userId: userId,
      joinCode: joinCode,
    })

    return newWorkspaceId;
  }
});

export const getWorkspacesByAuth = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    return await ctx.db.query("workspaces").filter((q) => q.eq(q.field("userId"), userId)).collect();
  }
});

export const getWorkspaceById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const workspace = await ctx.db.get(id);
    if (workspace?.userId !== userId) {
      return null;
    }

    return workspace;
  }
});