import { v } from "convex/values";
import { mutation } from "./functions";
import { Id } from "./_generated/dataModel";
import { QueryCtx } from "./_generated/server";

const getMember = (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_user_id_and_workspace_id", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .first();
};

export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, { messageId, value }) => {
    const { userId } = ctx;

    const message = await ctx.db.get(messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member) {
      throw new Error("Unauthorized");
    }

    const existingReaction = await ctx.db
      .query("reactions")
      .withIndex("by_message_id_and_member_id", (q) =>
        q.eq("messageId", messageId).eq("memberId", member._id)
      )
      .first();

    // add
    if (!existingReaction) {
      const reactionId = await ctx.db.insert("reactions", {
        messageId,
        value,
        memberId: member._id,
        workspaceId: message.workspaceId,
      });

      return reactionId;
    }

    // update
    if (existingReaction.value !== value) {
      await ctx.db.patch(existingReaction._id, {
        value,
      });
      return existingReaction._id;
    }

    // remove
    await ctx.db.delete(existingReaction._id);
  },
});
