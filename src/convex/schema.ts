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
  })
    .index("by_workspace_id", ["workspaceId"]),

  messages: defineTable({
    body: v.string(),
    image: v.string(),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    // todo: add conversationId
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_member_id", ["memberId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_updated_at", ["updatedAt"])
});

export default schema;
