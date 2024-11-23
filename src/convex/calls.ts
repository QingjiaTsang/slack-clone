import { Id } from "./_generated/dataModel";

import { v } from "convex/values";
import { type QueryCtxWithUserId, mutation, query } from "./functions";
import { getMember, getMemberWithUserInfoById } from "./helper";

import { v4 as uuidv4 } from "uuid";
import { internalMutation } from "./_generated/server";

const checkUsersInCall = async ({
  ctx,
  currentUserMemberId,
  targetMemberId,
}: {
  ctx: QueryCtxWithUserId;
  currentUserMemberId: Id<"members">;
  targetMemberId: Id<"members">;
}) => {
  // check if the current user is busy in any call
  const currentUserCalls = await ctx.db
    .query("calls")
    .withIndex("by_creator_id_and_status")
    .filter((q) =>
      q.or(
        q.eq(q.field("creatorId"), currentUserMemberId),
        q.eq(q.field("recipientId"), currentUserMemberId)
      )
    )
    .filter((q) =>
      q.or(
        q.eq(q.field("status"), "ringing"),
        q.eq(q.field("status"), "ongoing")
      )
    )
    .collect();

  // check if the target user is busy in any call
  const targetUserCalls = await ctx.db
    .query("calls")
    .withIndex("by_creator_id_and_status")
    .filter((q) =>
      q.or(
        q.eq(q.field("creatorId"), targetMemberId),
        q.eq(q.field("recipientId"), targetMemberId)
      )
    )
    .filter((q) =>
      q.or(
        q.eq(q.field("status"), "ringing"),
        q.eq(q.field("status"), "ongoing")
      )
    )
    .collect();

  const isBusy = currentUserCalls.length > 0 || targetUserCalls.length > 0;

  return isBusy;
};

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { workspaceId, conversationId }) => {
    const conversation = await ctx.db.get(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const currentUserMember = await getMemberWithUserInfoById(
      ctx as QueryCtxWithUserId,
      workspaceId,
      ctx.userId
    );

    if (!currentUserMember) {
      throw new Error("Current user is not a member of this workspace");
    }

    if (
      currentUserMember._id !== conversation.memberOneId &&
      currentUserMember._id !== conversation.memberTwoId
    ) {
      throw new Error("Current user is not a participant of this conversation");
    }

    const targetMemberId =
      conversation.memberOneId === currentUserMember._id
        ? conversation.memberTwoId
        : conversation.memberOneId;

    const targetMember = await ctx.db.get(targetMemberId);

    if (!targetMember) {
      throw new Error("Target member not found");
    }

    const targetMemberUserInfo = await ctx.db.get(targetMember.userId);

    if (!targetMemberUserInfo) {
      throw new Error("Target member user info not found");
    }

    const isBusyLine = await checkUsersInCall({
      ctx,
      currentUserMemberId: currentUserMember._id,
      targetMemberId,
    });

    if (isBusyLine) {
      throw new Error("Either user is busy in another call");
    }

    const streamCallId = uuidv4();

    return ctx.db.insert("calls", {
      workspaceId,
      conversationId,
      creatorId: currentUserMember._id,
      creatorName: currentUserMember.user.name!,
      recipientId: targetMemberId,
      recipientName: targetMemberUserInfo.name!,
      status: "ringing",
      statusUpdatedAt: Date.now(),
      startAt: Date.now(),
      ringTimeout: Date.now() + 30 * 1000,
      streamCallId,
    });
  },
});

export const subscribeRingingCall = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    if (!ctx.userId) {
      return null;
    }

    const currentUserMember = await getMember(
      ctx as QueryCtxWithUserId,
      args.workspaceId,
      ctx.userId
    );

    if (!currentUserMember) {
      return null;
    }

    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("memberOneId"), currentUserMember._id),
          q.eq(q.field("memberTwoId"), currentUserMember._id)
        )
      )
      .collect();

    if (!conversations.length) {
      return null;
    }

    const conversationIds = conversations.map(({ _id }) => _id);

    // reference: https://discord.com/channels/1019350475847499849/1309890509929709713
    // Note: we can't rely on the _creationTime of the calls,
    // because it's not guaranteed to be a monotonically increasing value,
    // which causes some problems when a user quickly updates the status of multiple calls
    // so don't do this:
    // const call = await ctx.db
    //   .query("calls")
    //   .withIndex("by_status")
    //   .filter((q) =>
    //     q.and(
    //       q.or(
    //         ...conversationIds.map((id) => q.eq(q.field("conversationId"), id))
    //       ),
    //       q.gt(q.field("ringTimeout"), Date.now())
    //     )
    //   )
    //   .order("desc")
    //   .first();

    const call = await ctx.db
      .query("calls")
      .withIndex("by_statusUpdatedAt")
      .filter((q) =>
        q.and(
          q.or(
            ...conversationIds.map((id) => q.eq(q.field("conversationId"), id))
          ),
          // only get the calls that are ringing and not expired
          q.gt(q.field("ringTimeout"), Date.now())
        )
      )
      .order("desc")
      .first();

    return call;
  },
});

export const updateStatus = mutation({
  args: {
    callId: v.id("calls"),
    status: v.optional(
      v.union(
        v.literal("ongoing"),
        v.literal("ended"),
        v.literal("rejected"),
        v.literal("missed")
      )
    ),
    endAt: v.optional(v.number()),
  },
  handler: async (ctx, { callId, status, endAt }) => {
    const call = await ctx.db.get(callId);

    if (!call) {
      throw new Error("Call not found");
    }

    if (!call.conversationId) {
      throw new Error("Conversation not found");
    }

    const conversation = await ctx.db.get(call.conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const currentUserMember = await getMember(
      ctx as QueryCtxWithUserId,
      conversation.workspaceId,
      ctx.userId
    );

    if (!currentUserMember) {
      throw new Error("Not a member of this workspace");
    }

    if (
      currentUserMember._id !== conversation.memberOneId &&
      currentUserMember._id !== conversation.memberTwoId
    ) {
      throw new Error("Not a participant in this conversation");
    }

    return ctx.db.patch(callId, {
      status,
      endAt,
      statusUpdatedAt: Date.now(),
    });
  },
});

export const getById = query({
  args: {
    workspaceId: v.id("workspaces"),
    callId: v.id("calls"),
  },
  handler: async (ctx, { workspaceId, callId }) => {
    if (!ctx.userId) {
      return null;
    }

    const currentUserMember = await getMember(
      ctx as QueryCtxWithUserId,
      workspaceId,
      ctx.userId
    );

    if (!currentUserMember) {
      return null;
    }

    const call = await ctx.db.get(callId);

    if (!call) {
      return null;
    }

    if (
      call.creatorId !== currentUserMember._id &&
      call.recipientId !== currentUserMember._id
    ) {
      return null;
    }

    return call;
  },
});

// internal mutation, only be called by cron job
export const handleExpiredCalls = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();

    // find all expired calls
    const expiredCalls = await ctx.db
      .query("calls")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "ringing"),
          q.lt(q.field("ringTimeout"), now)
        )
      )
      .collect();

    // update the status of all expired calls
    await Promise.all(
      expiredCalls.map((call) =>
        ctx.db.patch(call._id, {
          status: "missed",
          endAt: now,
        })
      )
    );
  },
});
