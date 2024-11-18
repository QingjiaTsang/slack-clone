import { User } from "@auth/core/types";

import { v } from "convex/values";
import { query } from "./functions";
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
