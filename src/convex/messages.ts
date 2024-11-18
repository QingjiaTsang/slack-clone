import { Doc, Id } from "./_generated/dataModel";

import { v } from "convex/values";
import { type QueryCtxWithUserId, mutation, query } from "./functions";
import { paginationOptsValidator } from "convex/server";
import { getMember } from "./helper";

const populateReactions = (
  ctx: QueryCtxWithUserId,
  messageId: Id<"messages">
) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

// to get the last message info of the thread
const populateThread = async (
  ctx: QueryCtxWithUserId,
  messageId: Id<"messages">
) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      name: undefined,
      timestamp: 0,
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      name: undefined,
      timestamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    name: lastMessageUser?.name,
    timestamp: lastMessage._creationTime,
  };
};

const populateUser = (ctx: QueryCtxWithUserId, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtxWithUserId, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

const getConversationIdForReply = async ({
  ctx,
  channelId,
  conversationId,
  parentMessageId,
}: {
  ctx: QueryCtxWithUserId;
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}) => {
  // if the message is within a conversation, or it's a reply to a message in a thread within the conversation,
  // we need to get the conversationId from the parentMessage
  // because from client, we only know the workspaceId, channelId, parentMessageId,
  // but not the conversationId which is exactly what we need
  if (!channelId && !conversationId && parentMessageId) {
    const parentMessage = await ctx.db.get(parentMessageId);
    if (!parentMessage) {
      throw new Error("Parent message not found");
    }
    return parentMessage.conversationId;
  }
  return conversationId;
};

const formatReactions = (reactions: Doc<"reactions">[]) => {
  const reactionsWithCount = reactions.map((reaction) => ({
    ...reaction,
    count: reactions.filter((r) => r.value === reaction.value).length,
  }));

  const groupedReactions = reactionsWithCount.reduce(
    (acc, reaction) => {
      const existingReaction = acc.find((r) => r.value === reaction.value);
      if (!existingReaction) {
        acc.push({
          ...reaction,
          memberIds: [reaction.memberId],
        });
      } else {
        existingReaction.memberIds.push(reaction.memberId);
      }
      return acc;
    },
    [] as (Doc<"reactions"> & { count: number; memberIds: Id<"members">[] })[]
  );

  return groupedReactions.map(({ memberId: _memberId, ...rest }) => rest);
};

const enrichMessageWithDetails = async (
  ctx: QueryCtxWithUserId,
  message: Doc<"messages">
) => {
  const member = await ctx.db.get(message.memberId);
  const user = member ? await populateUser(ctx, member.userId) : null;

  if (!member || !user) {
    throw new Error("Member or user not found");
  }

  const currentMember = await getMember(ctx, message.workspaceId, ctx.userId!);

  if (!currentMember) {
    throw new Error("Unauthorized");
  }

  const { memberId: _memberId, ...messageWithoutMemberId } = message;
  const thread = await populateThread(ctx, message._id);
  const image = message.image
    ? {
        url: (await ctx.storage.getUrl(message.image)) || undefined,
        storageId: message.image,
      }
    : undefined;
  const reactions = await populateReactions(ctx, message._id);
  const formattedReactions = formatReactions(reactions);

  // it's building something like this for each message:
  // {
  //   "_creationTime": 1731168723283.952,
  //   "_id": "kh7bses4bn7t2ez02f7sv5j309749p98",
  //   "body": "{\"ops\":[{\"insert\":\"新图\\n\"}]}",
  //   "channelId": "kd7bx3jpg14xn43pz3teg46y9573nhtz",
  //   "image": {
  //     "url": "https://next-horse-726.convex.cloud/api/storage/cd19209d-1c12-4725-975b-2d64164b1374",
  //     "storageId": "cd19209d-1c12-4725-975b-2d64164b1374"
  //   },
  //   "member": {
  //     "_creationTime": 1729670977660.7295,
  //     "_id": "k97dykhf9x84k174jk0qtmamxh736y3n",
  //     "role": "admin",
  //     "userId": "k179r5dzd8rw0nxn26cjyrdw7n72es8w",
  //     "workspaceId": "k5795r2z8fr5qez3ybbzyn7j3573731c"
  //   },
  //   "reactions": [
  //     {
  //       "_creationTime": 1731260225198.7231,
  //       "_id": "ks7483xyhjg6gpxs885vxs57ws74bd36",
  //       "count": 1,
  //       "memberIds": [
  //         "k97dykhf9x84k174jk0qtmamxh736y3n"
  //       ],
  //       "messageId": "kh7bses4bn7t2ez02f7sv5j309749p98",
  //       "value": "😋",
  //       "workspaceId": "k5795r2z8fr5qez3ybbzyn7j3573731c"
  //     }
  //   ],
  //   "threadCount": 0,
  //   "threadImage": undefined,
  //   "threadName": undefined,
  //   "threadTimestamp": 0,
  //   "updatedAt": 1731168723284,
  //   "user": {
  //     "_creationTime": 1728647249721.6646,
  //     "_id": "k179r5dzd8rw0nxn26cjyrdw7n72es8w",
  //     "email": "366209274@qq.com",
  //     "emailVerificationTime": 1731067330466,
  //     "image": "https://avatars.githubusercontent.com/u/39949421?v=4",
  //     "name": "zengqingjia"
  //   },
  //   "workspaceId": "k5795r2z8fr5qez3ybbzyn7j3573731c"
  // }

  return {
    ...messageWithoutMemberId,
    image,
    member,
    user,
    reactions: formattedReactions,
    threadCount: thread.count,
    threadImage: thread.image,
    threadName: thread.name,
    threadTimestamp: thread.timestamp,
  };
};

export const getMessages = query({
  args: {
    messageId: v.optional(v.id("messages")),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (
    ctx,
    { channelId, parentMessageId, conversationId, paginationOpts }
  ) => {
    if (!ctx.userId) {
      throw new Error("User Unauthorized");
    }

    const _conversationId = await getConversationIdForReply({
      ctx,
      channelId,
      conversationId,
      parentMessageId,
    });

    // if parentMessageId is null, it means the message is not a reply
    // otherwise, it's a reply which will not show in the message list
    const result = await ctx.db
      .query("messages")
      .withIndex(
        "by_channel_id_and_parent_message_id_and_conversation_id",
        (q) =>
          q
            .eq("channelId", channelId)
            .eq("parentMessageId", parentMessageId)
            .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(paginationOpts);

    return {
      ...result,
      page: (
        await Promise.all(
          result.page.map((message) => enrichMessageWithDetails(ctx, message))
        )
      ).filter(Boolean),
    };
  },
});

export const getOneById = query({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, { messageId }) => {
    try {
      if (!ctx.userId) {
        throw new Error("User Unauthorized");
      }

      const message = await ctx.db.get(messageId);
      if (!message) {
        return null;
      }

      return await enrichMessageWithDetails(ctx, message);
    } catch (_error) {
      return null;
    }
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (
    ctx,
    { body, image, workspaceId, channelId, parentMessageId, conversationId }
  ) => {
    const { userId } = ctx;

    const member = await getMember(ctx, workspaceId, userId);

    if (!member) {
      throw new Error("Member not found");
    }

    // if the message is a reply to a message in a thread within the conversation,
    // we need to get the conversationId from the parentMessage
    // because from client, we only know the workspaceId, channelId, parentMessageId,
    // but not the conversationId which is exactly what we need
    let _conversationId = conversationId;
    if (!channelId && !conversationId && parentMessageId) {
      const parentMessage = await ctx.db.get(parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversationId = parentMessage.conversationId;
    }

    const newMessageId = await ctx.db.insert("messages", {
      body,
      image,
      memberId: member._id,
      workspaceId,
      channelId,
      parentMessageId,
      conversationId: _conversationId,
    });

    return newMessageId;
  },
});

export const updateOneById = mutation({
  args: {
    messageId: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, { messageId, body }) => {
    const message = await ctx.db.get(messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, ctx.userId);

    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(messageId, {
      body,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const deleteOneById = mutation({
  args: {
    messageId: v.id("messages"),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { messageId, imageStorageId }) => {
    const message = await ctx.db.get(messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, ctx.userId);

    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }

    if (imageStorageId) {
      await ctx.storage.delete(imageStorageId);
    }
    await ctx.db.delete(messageId);

    return messageId;
  },
});
