"use client";

import { Id } from "@/convex/_generated/dataModel";

import { useRouter } from "next/navigation";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcnUI/resizable";

import WorkspaceProvider from "@/features/workspace/_components/WorkspaceProvider";
import HeaderNavBar from "@/features/workspace/_components/HeaderNavBar";
import SideBar from "@/features/workspace/_components/SideBar";
import WorkspaceSidebar from "@/features/workspace/_components/WorkspaceSidebar";

import CreateWorkspaceModal from "@/features/workspace/_components/CreateWorkspaceModal";
import CreateChannelModal from "@/features/channel/_components/CreateChannelModal";
import {
  useGetAllWorkspacesByAuth,
  useGetWorkspaceById,
} from "@/features/workspace/api/workspace";
import { useGetCurrentUserRoleInWorkspace } from "@/api/user";
import usePanel from "@/hooks/usePanel";
import WorkspaceLayoutSkeleton from "@/features/workspace/_components/WorkspaceLayoutSkeleton";
import ThreadPanel from "@/features/channel/_components/ThreadPanel";
import ProfilePanel from "@/features/member/_components/ProfilePanel";
import { useEffect } from "react";

type WorkspaceLayoutProps = {
  params: {
    workspaceId: Id<"workspaces">;
  };
  children: React.ReactNode;
};

const WorkspaceLayout = ({ params, children }: WorkspaceLayoutProps) => {
  const router = useRouter();

  const { data: currentWorkspace, isPending: isCurrentWorkspacePending } =
    useGetWorkspaceById(params.workspaceId);
  const { data: userWorkspaces, isPending: isUserWorkspacesPending } =
    useGetAllWorkspacesByAuth();
  const { data: currentUserRoleInfo, isPending: isCurrentUserRoleInfoPending } =
    useGetCurrentUserRoleInWorkspace(params.workspaceId);

  const { parentMessageId, profileMemberId, closePanel } = usePanel();

  const isAdmin = currentUserRoleInfo?.role === "admin";

  const showPanel = !!parentMessageId || !!profileMemberId;

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
        router.replace("/");
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

  if (
    isCurrentWorkspacePending ||
    isUserWorkspacesPending ||
    isCurrentUserRoleInfoPending
  ) {
    return <WorkspaceLayoutSkeleton />;
  }

  if (
    !currentWorkspace ||
    !userWorkspaces ||
    userWorkspaces?.length === 0 ||
    !currentUserRoleInfo
  ) {
    return null;
  }

  return (
    <WorkspaceProvider currentWorkspace={currentWorkspace}>
      <div>
        <HeaderNavBar workspaceId={params.workspaceId} />
        <div className="flex">
          <SideBar
            currentWorkspace={currentWorkspace}
            userWorkspaces={userWorkspaces}
          />

          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="workspace-layout"
          >
            <ResizablePanel
              id="sidebar"
              defaultSize={20}
              minSize={20}
              className="bg-[#5E2C5F] h-[calc(100svh-56px)]"
            >
              <WorkspaceSidebar
                isAdmin={isAdmin}
                workspace={currentWorkspace}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel id="main" minSize={20}>
              {children}
            </ResizablePanel>
            {showPanel && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel
                  id="thread"
                  defaultSize={30}
                  minSize={20}
                  className="shadow-[0_0_8px_rgba(0,0,0,0.25)]"
                >
                  {parentMessageId ? (
                    <ThreadPanel
                      messageId={parentMessageId as Id<"messages">}
                      onClose={closePanel}
                    />
                  ) : profileMemberId ? (
                    <ProfilePanel
                      workspaceId={params.workspaceId}
                      memberId={profileMemberId as Id<"members">}
                      onClose={closePanel}
                    />
                  ) : null}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>

      <CreateWorkspaceModal />
      <CreateChannelModal />
    </WorkspaceProvider>
  );
};

export default WorkspaceLayout;
