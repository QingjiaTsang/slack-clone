import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

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

export const useGetMemberWithUserInfoById = (memberId: Id<"members">) =>
  useQuery(convexQuery(api.members.getMemberWithUserInfoById, { memberId }));

export const useGetCurrentUserMemberWithUserInfo = (
  workspaceId: Id<"workspaces">
) =>
  useQuery(
    convexQuery(api.members.getCurrentUserMemberWithUserInfo, { workspaceId })
  );
