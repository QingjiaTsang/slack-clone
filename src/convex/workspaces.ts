import { v } from "convex/values";
import { mutation, query } from "./functions";
import { generateJoinCode } from "../lib/generateJoinCode";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const { userId } = ctx;

    const joinCode = generateJoinCode();

    const newWorkspaceId = await ctx.db.insert("workspaces", {
      name: name,
      creatorId: userId,
      joinCode: joinCode,
    });

    await ctx.db.insert("members", {
      workspaceId: newWorkspaceId,
      userId: userId,
      role: "admin",
    });

    return newWorkspaceId;
  },
});

export const join = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    joinCode: v.string(),
  },
  handler: async (ctx, { workspaceId, joinCode }) => {
    const { userId } = ctx;

    const workspace = await ctx.db.get(workspaceId);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", workspaceId)
      )
      .first();

    if (member) {
      throw new Error("User already in this workspace");
    }

    if (workspace.joinCode.toUpperCase() !== joinCode.toUpperCase()) {
      throw new Error("Invalid join code");
    }

    const newMemberId = await ctx.db.insert("members", {
      workspaceId: workspaceId,
      userId: userId,
      role: "member",
    });

    return newMemberId;
  },
});

export const getAllByAuth = query({
  args: {},
  handler: async (ctx) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const members = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    const workspaces = (
      await Promise.all(members.map((member) => ctx.db.get(member.workspaceId)))
    ).filter((workspace) => !!workspace);

    return workspaces;
  },
});

export const getOneById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const workspacePromise = ctx.db.get(id);

    const memberPromise = ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    const [workspace, member] = await Promise.all([
      workspacePromise,
      memberPromise,
    ]);

    if (!workspace || !member) {
      return null;
    }

    return workspace;
  },
});

export const getPublicInfoById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const workspace = await ctx.db.get(id);
    if (!workspace) {
      return null;
    }

    return workspace;
  },
});

export const deleteOneById = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }) => {
    const { userId } = ctx;

    const workspace = await ctx.db.get(id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const userMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", id)
      )
      .first();

    if (!userMember || userMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // do cascade delete on all related records in members, channels, messages, conversations, reactions
    const [members, channels, messages, conversations, reactions] =
      await Promise.all([
        ctx.db
          .query("members")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
          .collect(),
        ctx.db
          .query("channels")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
          .collect(),
        ctx.db
          .query("messages")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
          .collect(),
        ctx.db
          .query("conversations")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
          .collect(),
        ctx.db
          .query("reactions")
          .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
          .collect(),
      ]);

    await Promise.all([
      ctx.db.delete(id),
      ...members.map((member) => ctx.db.delete(member._id)),
      ...channels.map((channel) => ctx.db.delete(channel._id)),
      ...messages.map((message) => ctx.db.delete(message._id)),
      ...conversations.map((conversation) => ctx.db.delete(conversation._id)),
      ...reactions.map((reaction) => ctx.db.delete(reaction._id)),
    ]);
  },
});

export const updateOneById = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
    joinCode: v.string(),
  },
  handler: async (ctx, { id, name, joinCode }) => {
    if (!name && !joinCode) {
      throw new Error("Either name or joinCode must be provided");
    }

    const { userId } = ctx;

    const workspace = await ctx.db.get(id);

    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const userMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", id)
      )
      .first();

    if (!userMember || userMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, { name, joinCode });

    return id;
  },
});

export const getCurrentUserRoleInWorkspace = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id_and_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", id)
      )
      .first();
    return member;
  },
});
