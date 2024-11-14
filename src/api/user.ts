import { api } from "@/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "@/convex/_generated/dataModel";

export const useGetCurrentUser = () =>
  useQuery(convexQuery(api.users.getCurrentUser, {}));

export const useGetCurrentUserRoleInWorkspace = (
  workspaceId: Id<"workspaces">
) =>
  useQuery(
    convexQuery(api.workspaces.getCurrentUserRoleInWorkspace, {
      id: workspaceId,
    })
  );
