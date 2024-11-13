import { v } from "convex/values";
import { mutation, query } from "./functions";

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, { workspaceId, name }) => {
    const { userId } = ctx;

    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const currentUserMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", workspaceId)
      )
      .first();

    if (!currentUserMember || currentUserMember.role !== "admin") {
      throw new Error("User unauthorized");
    }

    const newChannelId = await ctx.db.insert("channels", {
      workspaceId: workspaceId,
      name: name,
    });

    return newChannelId;
  },
});

export const getAllByWorkspaceId = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) {
      return null;
    }

    const currentUserMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", workspaceId)
      )
      .first();

    if (!currentUserMember) {
      return null;
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
      .collect();
    return channels;
  },
});

export const getOneById = query({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, { id }) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const channel = await ctx.db.get(id);

    if (!channel) {
      return null;
    }

    const currentUserMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .first();

    if (!currentUserMember) {
      return null;
    }

    return channel;
  },
});

export const updateOneById = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const channel = await ctx.db.get(id);
    if (!channel) {
      throw new Error("Channel not found");
    }

    const workspace = await ctx.db.get(channel.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const currentUserMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .first();

    if (!currentUserMember || currentUserMember.role !== "admin") {
      throw new Error("User unauthorized");
    }

    await ctx.db.patch(id, { name });

    return id;
  },
});

export const deleteOneById = mutation({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, { id }) => {
    const { userId } = ctx;

    const channel = await ctx.db.get(id);
    if (!channel) {
      throw new Error("Channel not found");
    }

    const workspace = await ctx.db.get(channel.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const currentUserMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .first();

    if (!currentUserMember || currentUserMember.role !== "admin") {
      throw new Error("User unauthorized");
    }

    await ctx.db.delete(id);
  },
});
