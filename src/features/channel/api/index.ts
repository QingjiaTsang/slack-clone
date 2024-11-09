import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { Id } from "@/convex/_generated/dataModel";

export const getAllChannelsByWorkspaceId = (workspaceId: Id<"workspaces">) => useQuery(
  convexQuery(api.channels.getAllByWorkspaceId, { workspaceId }),
);

export const createChannel = () => useMutation({
  mutationFn: useConvexMutation(api.channels.create),
});

export const updateChannel = () => useMutation({
  mutationFn: useConvexMutation(api.channels.updateOneById),
});

export const deleteChannel = () => useMutation({
  mutationFn: useConvexMutation(api.channels.deleteOneById),
});

