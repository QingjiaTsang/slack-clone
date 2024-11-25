import { Id } from "./_generated/dataModel";

import { v } from "convex/values";
import { type QueryCtxWithUserId, mutation, query } from "./functions";
import { getMemberWithUserInfoById } from "./helper";

import { internalMutation } from "./_generated/server";

const checkUsersInCall = async ({
  ctx,
  currentMemberUserId,
  targetMemberUserId,
}: {
  ctx: QueryCtxWithUserId;
  currentMemberUserId: Id<"users">;
  targetMemberUserId: Id<"users">;
}) => {
  // check if the current user is busy in any call
  const currentUserCalls = await ctx.db
    .query("calls")
    .withIndex("by_creator_id_and_status")
    .filter((q) =>
      q.or(
        q.eq(q.field("creatorUserId"), currentMemberUserId),
        q.eq(q.field("recipientUserId"), currentMemberUserId)
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
        q.eq(q.field("creatorUserId"), targetMemberUserId),
        q.eq(q.field("recipientUserId"), targetMemberUserId)
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
      currentMemberUserId: currentUserMember.userId,
      targetMemberUserId: targetMember.userId,
    });

    if (isBusyLine) {
      throw new Error("Either user is busy in another call");
    }

    return ctx.db.insert("calls", {
      workspaceId,
      conversationId,
      creatorId: currentUserMember._id,
      creatorUserId: currentUserMember.userId,
      creatorName: currentUserMember.user.name!,
      recipientId: targetMemberId,
      recipientUserId: targetMember.userId,
      recipientName: targetMemberUserInfo.name!,
      status: "ringing",
      statusUpdatedAt: Date.now(),
      startAt: Date.now(),
      ringTimeout: Date.now() + 30 * 1000,
    });
  },
});

export const subscribeRingingCall = query({
  args: {},
  handler: async (ctx) => {
    if (!ctx.userId) {
      return null;
    }

    // reference: https://discord.com/channels/1019350475847499849/1309890509929709713
    // Note: we can't rely on the _creationTime of the calls,
    // because it's not guaranteed to be a monotonically increasing value,
    // which causes some problems when a user quickly updates the status of multiple calls
    // so just use the statusUpdatedAt for index and order instead
    const call = await ctx.db
      .query("calls")
      .withIndex("by_statusUpdatedAt")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("creatorUserId"), ctx.userId),
            q.eq(q.field("recipientUserId"), ctx.userId)
          ),
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
        v.literal("missed"),
        v.literal("cancelled")
      )
    ),
    endAt: v.optional(v.number()),
  },
  handler: async (ctx, { callId, status, endAt }) => {
    const call = await ctx.db.get(callId);

    if (!call) {
      throw new Error("Call not found");
    }

    if (
      call.creatorUserId !== ctx.userId &&
      call.recipientUserId !== ctx.userId
    ) {
      throw new Error("Not a participant in this call");
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
    callId: v.id("calls"),
  },
  handler: async (ctx, { callId }) => {
    if (!ctx.userId) {
      return null;
    }

    const call = await ctx.db.get(callId);

    if (!call) {
      return null;
    }

    if (
      call.creatorUserId !== ctx.userId &&
      call.recipientUserId !== ctx.userId
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
