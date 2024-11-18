import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";

export type GetOrCreateConversationQueryType = ReturnType<
  typeof useGetOrCreateConversation
>["data"];

export const useGetOrCreateConversation = () =>
  useMutation({
    mutationFn: useConvexMutation(api.conversations.getOrCreate),
  });
