import { Id } from "@/convex/_generated/dataModel";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserRoleInWorkspace } from "@/api/user";
import {
  useGetWorkspaceById,
  useGetAllWorkspacesByAuth,
} from "@/features/workspace/api/workspace";

const useWorkspaceData = (workspaceId: Id<"workspaces">) => {
  const router = useRouter();

  const { data: currentWorkspace, isPending: isCurrentWorkspacePending } =
    useGetWorkspaceById(workspaceId);
  const { data: userWorkspaces, isPending: isUserWorkspacesPending } =
    useGetAllWorkspacesByAuth();
  const { data: currentUserRoleInfo, isPending: isCurrentUserRoleInfoPending } =
    useGetCurrentUserRoleInWorkspace(workspaceId);

  const isLoading =
    isCurrentWorkspacePending ||
    isUserWorkspacesPending ||
    isCurrentUserRoleInfoPending;

  // redirect to home page if the workspace is not found
  useEffect(() => {
    if (
      !isCurrentWorkspacePending &&
      !isUserWorkspacesPending &&
      !isCurrentUserRoleInfoPending
    ) {
      if (
        !currentWorkspace ||
        !userWorkspaces ||
        userWorkspaces?.length === 0 ||
        !currentUserRoleInfo
      ) {
        router.replace("/workspace");
      }
    }
  }, [
    currentWorkspace,
    userWorkspaces,
    currentUserRoleInfo,
    router,
    isCurrentWorkspacePending,
    isUserWorkspacesPending,
    isCurrentUserRoleInfoPending,
  ]);

  return {
    currentWorkspace,
    userWorkspaces,
    currentUserRoleInfo,
    isLoading,
    isAdmin: currentUserRoleInfo?.role === "admin",
  };
};

export default useWorkspaceData;
