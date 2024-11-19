import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { Id } from "@/convex/_generated/dataModel";

export const useGetWorkspaceById = (workspaceId: Id<"workspaces">) =>
  useQuery(convexQuery(api.workspaces.getOneById, { id: workspaceId }));

export const useGetAllWorkspacesByAuth = () =>
  useQuery(convexQuery(api.workspaces.getAllByAuth, {}));

export const useCreateWorkspace = () =>
  useMutation({
    mutationFn: useConvexMutation(api.workspaces.create),
  });

export const useUpdateWorkspace = () =>
  useMutation({
    mutationFn: useConvexMutation(api.workspaces.updateOneById),
  });

export const useDeleteWorkspace = () =>
  useMutation({
    mutationFn: useConvexMutation(api.workspaces.deleteOneById),
  });

export const useGetAllChannelsByWorkspaceId = (workspaceId: Id<"workspaces">) =>
  useQuery(convexQuery(api.channels.getAllByWorkspaceId, { workspaceId }));

export const useGetAllMembersByWorkspaceId = (workspaceId: Id<"workspaces">) =>
  useQuery(convexQuery(api.members.getAllByWorkspaceId, { workspaceId }));
