import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { Id } from "@/convex/_generated/dataModel";


export const getWorkspaceById = (workspaceId: Id<"workspaces">) => useQuery(
  convexQuery(api.workspaces.getOneById, { id: workspaceId }),
);

export const getCurrentUserRoleInWorkspace = (workspaceId: Id<"workspaces">) => useQuery(
  convexQuery(api.workspaces.getCurrentUserRoleInWorkspace, { id: workspaceId }),
);

export const createWorkspace = () => useMutation({
  mutationFn: useConvexMutation(api.workspaces.create),
});

export const updateWorkspace = () => useMutation({
  mutationFn: useConvexMutation(api.workspaces.updateOneById),
});

export const deleteWorkspace = () => useMutation({
  mutationFn: useConvexMutation(api.workspaces.deleteOneById),
});

export const joinWorkspace = () => useMutation({
  mutationFn: useConvexMutation(api.workspaces.join),
})
