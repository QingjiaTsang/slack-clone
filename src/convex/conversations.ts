import { Id } from "./_generated/dataModel";

import { v } from "convex/values";
import {
  type QueryCtxWithUserId,
  type MutationCtxWithUserId,
  mutation,
} from "./functions";
import { getMember } from "./helper";

const getConversation = async ({
  ctx,
  workspaceId,
  currentUserMemberId,
  targetMemberId,
}: {
  ctx: QueryCtxWithUserId;
  workspaceId: Id<"workspaces">;
  currentUserMemberId: Id<"members">;
  targetMemberId: Id<"members">;
}) => {
  return ctx.db
    .query("conversations")
    .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
    .filter((q) =>
      q.or(
        q.and(
          q.eq(q.field("memberOneId"), currentUserMemberId),
          q.eq(q.field("memberTwoId"), targetMemberId)
        ),
        q.and(
          q.eq(q.field("memberOneId"), targetMemberId),
          q.eq(q.field("memberTwoId"), currentUserMemberId)
        )
      )
    )
    .first();
};

const createConversation = async ({
  ctx,
  workspaceId,
  currentUserMemberId,
  targetMemberId,
}: {
  ctx: MutationCtxWithUserId;
  workspaceId: Id<"workspaces">;
  currentUserMemberId: Id<"members">;
  targetMemberId: Id<"members">;
}) => {
  const newConversationId = await ctx.db.insert("conversations", {
    workspaceId,
    memberOneId: currentUserMemberId,
    memberTwoId: targetMemberId,
  });

  const newConversation = await ctx.db.get(newConversationId);

  if (!newConversation) {
    throw new Error("Failed to create conversation");
  }

  return newConversation;
};

export const getOrCreate = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    targetMemberId: v.id("members"),
  },
  handler: async (ctx, { workspaceId, targetMemberId }) => {
    if (!ctx.userId) {
      return null;
    }

    const currentUserMember = await getMember(ctx, workspaceId, ctx.userId);

    if (!currentUserMember || currentUserMember?.workspaceId !== workspaceId) {
      return null;
    }

    const conversation = await getConversation({
      ctx: ctx as QueryCtxWithUserId,
      workspaceId,
      currentUserMemberId: currentUserMember._id,
      targetMemberId,
    });

    if (!conversation) {
      return await createConversation({
        ctx: ctx as MutationCtxWithUserId,
        workspaceId,
        currentUserMemberId: currentUserMember._id,
        targetMemberId,
      });
    }

    return conversation;
  },
});
