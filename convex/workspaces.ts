import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Note: consistent error handling practice in this project:
// for query, it doesn't throws error in order to avoid error handling in RSC and RCC for code briefness
// but for mutation, it's allowed to throw errors because it's always using react-query to handle error in client side

export const create = mutation({
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

    await ctx.db.insert("members", {
      workspaceId: newWorkspaceId,
      userId: userId,
      role: "admin",
    });

    return newWorkspaceId;
  }
});

export const getAllByAuth = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const members = await ctx.db.query("members").filter(q => q.eq(q.field("userId"), userId)).collect();

    const workspaces = (await Promise.all(members.map((member) =>
      ctx.db.get(member.workspaceId)
    ))).filter((workspace) => !!workspace);


    return workspaces;
  }
});

export const getOneById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const workspacePromise = ctx.db.get(id);

    const memberPromise = ctx.db.query("members").filter(q => q.eq(q.field("userId"), userId)).first();

    const [workspace, member] = await Promise.all([workspacePromise, memberPromise]);

    if (!workspace || !member) {
      return null;
    }

    return workspace;
  }
});