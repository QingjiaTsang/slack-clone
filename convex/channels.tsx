import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, { workspaceId, name }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const currentUserMember = await ctx.db.query("members")
      .withIndex("by_user_id_and_workspace_id", (q) => q.eq("userId", userId).eq("workspaceId", workspaceId))
      .first();

    if (!currentUserMember || currentUserMember.role !== "admin") {
      throw new Error("User unauthorized");
    }

    const newChannelId = await ctx.db.insert("channels", {
      workspaceId: workspaceId,
      name: name,
    });

    return newChannelId;
  }
})

export const getAllByWorkspaceId = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null
    }

    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      return null
    }

    const currentUserMember = await ctx.db.query("members")
      .withIndex("by_user_id_and_workspace_id", (q) => q.eq("userId", userId).eq("workspaceId", workspaceId))
      .first();

    if (!currentUserMember) {
      return null
    }

    const channels = await ctx.db.query("channels").withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId)).collect();
    return channels;
  }
})