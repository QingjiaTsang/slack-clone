import { User } from "@auth/core/types";

import { v } from "convex/values";
import { mutation, query } from "./functions";
import { getMember } from "./helper";

export const getAllByWorkspaceId = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const members = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const membersWithUser = await Promise.all(
      members.map(async (member) => {
        const user = (await ctx.db.get(member.userId)) as User;
        return { ...member, user };
      })
    );

    return membersWithUser;
  },
});

export const getMemberWithUserInfoById = query({
  args: {
    memberId: v.id("members"),
  },
  handler: async (ctx, { memberId }) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(memberId);

    if (!member) {
      return null;
    }

    const currentUserMember = await getMember(ctx, member.workspaceId, userId);

    if (!currentUserMember) {
      return null;
    }

    const targetMemberUser = await ctx.db.get(member.userId);

    if (!targetMemberUser) {
      return null;
    }

    return { ...member, user: targetMemberUser };
  },
});

export const getCurrentUserMemberWithUserInfo = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
    const { userId } = ctx;
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);

    const member = await getMember(ctx, workspaceId, userId);

    if (!member) {
      return null;
    }

    return { ...member, user };
  },
});

export const updateOneById = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, { id, role }) => {
    const { userId } = ctx;

    const targetMember = await ctx.db.get(id);

    if (!targetMember) {
      throw new Error("Member not found");
    }

    const currentUserMember = await getMember(
      ctx,
      targetMember.workspaceId,
      userId
    );

    if (!currentUserMember || currentUserMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    if (id === currentUserMember._id) {
      throw new Error("Cannot update current user's role");
    }

    await ctx.db.patch(id, { role });

    return id;
  },
});

export const deleteOneById = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, { id }) => {
    const { userId } = ctx;

    const targetMember = await ctx.db.get(id);

    if (!targetMember) {
      throw new Error("Member not found");
    }

    const currentUserMember = await getMember(
      ctx,
      targetMember.workspaceId,
      userId
    );

    if (!currentUserMember) {
      throw new Error("Unauthorized");
    }

    if (
      currentUserMember.role === "admin" &&
      currentUserMember._id === targetMember._id
    ) {
      throw new Error("Cannot delete current user");
    }

    // do cascade delete on all related records in messages, conversations, reactions
    const [messages, conversations, reactions] = await Promise.all([
      ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("memberId"), id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), id),
            q.eq(q.field("memberTwoId"), id)
          )
        )
        .collect(),
      ctx.db
        .query("reactions")
        .filter((q) => q.eq(q.field("memberId"), id))
        .collect(),
    ]);

    await Promise.all([
      messages.forEach((message) => ctx.db.delete(message._id)),
      conversations.forEach((conversation) => ctx.db.delete(conversation._id)),
      reactions.forEach((reaction) => ctx.db.delete(reaction._id)),
    ]);

    await ctx.db.delete(id);
  },
});
