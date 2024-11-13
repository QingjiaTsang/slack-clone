import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { Id } from "@/convex/_generated/dataModel";

import { usePaginatedQuery } from "convex/react";

export type GetMessagesType = ReturnType<typeof useGetMessages>["results"];

const DEFAULT_PAGINATION_OPTS = {
  initialNumItems: 50,
};

export const useCreateMessage = () =>
  useMutation({
    mutationFn: useConvexMutation(api.messages.create),
  });

export const useGetMessages = (args: {
  workspaceId: Id<"workspaces">;
  messageId?: Id<"messages">;
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
}) =>
  usePaginatedQuery(api.messages.getMessages, args, DEFAULT_PAGINATION_OPTS);
