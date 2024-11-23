import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  workspaces: defineTable({
    name: v.string(),
    creatorId: v.id("users"),
    joinCode: v.string(),
  }),

  members: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_user_id_and_workspace_id", ["userId", "workspaceId"]),

  channels: defineTable({
    workspaceId: v.id("workspaces"),
    name: v.string(),
  }).index("by_workspace_id", ["workspaceId"]),

  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  }).index("by_workspace_id", ["workspaceId"]),

  /**
   * message types:
   * 1. most regular message in a workspace's channel: having a workspaceId and channelId, without conversationId and parentMessageId
   * 2. reply to a message in a thread within a particular channel: having a workspaceId, channelId, parentMessageId, without conversationId
   * 3. direct message to a member: having a workspaceId, conversationId, without channelId, parentMessageId
   * 4. reply to a message in a thread within a particular conversation: having a workspaceId, parentMessageId, conversationId
   */
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_member_id", ["memberId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_channel_id_and_parent_message_id_and_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),

  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"])
    .index("by_message_id_and_member_id", ["messageId", "memberId"]),

  calls: defineTable({
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),

    creatorId: v.id("members"),
    creatorName: v.string(),

    recipientId: v.id("members"),
    recipientName: v.string(),

    status: v.union(
      v.literal("ringing"),
      v.literal("ongoing"),
      v.literal("ended"),
      v.literal("rejected"),
      v.literal("missed")
    ),
    statusUpdatedAt: v.number(),

    startAt: v.number(),
    endAt: v.optional(v.number()),
    streamCallId: v.string(),
    ringTimeout: v.number(),
  })
    .index("by_conversation_id_and_status", ["conversationId", "status"])
    .index("by_creator_id_and_status", ["creatorId", "status"])
    .index("by_recipient_id_and_status", ["recipientId", "status"])
    .index("by_workspace_id_and_status", ["workspaceId", "status"])
    .index("by_statusUpdatedAt", ["statusUpdatedAt"])
    .index("by_status", ["status"]),
});

export default schema;
