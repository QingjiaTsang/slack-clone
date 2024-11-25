import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";

export const useCreateCall = () =>
  useMutation<
    Id<"calls">,
    Error,
    {
      workspaceId: Id<"workspaces">;
      conversationId: Id<"conversations">;
    }
  >({
    mutationFn: useConvexMutation(api.calls.create),
  });

export const useSubscribeRingingCall = () =>
  useQuery(convexQuery(api.calls.subscribeRingingCall, {}));

export const useUpdateCallStatus = () =>
  useMutation({
    mutationFn: useConvexMutation(api.calls.updateStatus),
  });
