"use client";

import { Id } from "@/convex/_generated/dataModel";

import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcnUI/resizable";

import WorkspaceProvider from "@/features/workspace/_components/WorkspaceProvider";
import HeaderNavBar from "@/features/workspace/_components/HeaderNavBar";
import SideBar from "@/features/workspace/_components/SideBar";
import WorkspaceSidebar from "@/features/workspace/_components/WorkspaceSidebar";

import CreateWorkspaceModal from "@/features/workspace/_components/CreateWorkspaceModal";
import CreateChannelModal from "@/features/channel/_components/CreateChannelModal";

import usePanel from "@/hooks/usePanel";
import WorkspaceLayoutSkeleton from "@/features/workspace/_components/WorkspaceLayoutSkeleton";
import ThreadPanel from "@/features/channel/_components/ThreadPanel";
import ProfilePanel from "@/features/member/_components/ProfilePanel";
import RingingCallModal from "@/features/call/_components/RingingCallModal";
import RingingCallFloatingEntry from "@/components/RingingCallFloatingEntry";

import useWorkspaceData from "@/features/workspace/hooks/useWorkspaceData";
import useCallManagement from "@/hooks/useCallManagement";

import { cn } from "@/lib/utils";
import MobileNavBar from "@/components/MobileNavBar";

type WorkspaceLayoutProps = {
  params: {
    workspaceId: Id<"workspaces">;
  };
  children: React.ReactNode;
};

const WorkspaceLayout = ({ params, children }: WorkspaceLayoutProps) => {
  const {
    currentWorkspace,
    userWorkspaces,
    currentUserRoleInfo,
    isLoading,
    isAdmin,
  } = useWorkspaceData(params.workspaceId);

  const {
    incomingCall,
    isRingingCallModalOpen,
    setIsRingingCallModalOpen,
    currentRingingCall,
  } = useCallManagement({
    currentUserId: currentUserRoleInfo?.userId,
    currentWorkspaceName: currentWorkspace?.name,
  });

  const { parentMessageId, profileMemberId, closePanel } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  if (isLoading) {
    return <WorkspaceLayoutSkeleton />;
  }

  if (
    !currentWorkspace ||
    !userWorkspaces ||
    !userWorkspaces?.length ||
    !currentUserRoleInfo
  ) {
    return null;
  }

  return (
    <WorkspaceProvider currentWorkspace={currentWorkspace}>
      <RingingCallModal
        ringingCall={incomingCall}
        isRingingCallModalOpen={isRingingCallModalOpen}
        setIsRingingCallModalOpen={setIsRingingCallModalOpen}
      />

      <div className="flex h-screen flex-col">
        <HeaderNavBar
          workspaceId={params.workspaceId}
          isAdmin={isAdmin}
          workspace={currentWorkspace}
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <SideBar
              currentWorkspace={currentWorkspace}
              userWorkspaces={userWorkspaces}
            />
          </div>

          <RingingCallFloatingEntry
            currentRingingCall={currentRingingCall}
            isCreator={
              currentRingingCall?.creatorUserId === currentUserRoleInfo?.userId
            }
            setIsRingingCallModalOpen={setIsRingingCallModalOpen}
          />

          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="workspace-layout"
            className="flex-1"
          >
            <ResizablePanel
              id="sidebar"
              defaultSize={20}
              minSize={20}
              className={cn(
                "bg-[#5E2C5F]",
                "h-[calc(100svh-56px)]",
                "hidden md:block"
              )}
            >
              <WorkspaceSidebar
                isAdmin={isAdmin}
                workspace={currentWorkspace}
              />
            </ResizablePanel>

            <ResizablePanel id="main" minSize={20}>
              {children}
            </ResizablePanel>

            {showPanel && (
              <>
                <ResizablePanel
                  id="thread"
                  defaultSize={30}
                  minSize={20}
                  className={cn(
                    "shadow-[0_0_8px_rgba(0,0,0,0.25)]",
                    "fixed inset-0 z-50 md:relative md:inset-auto"
                  )}
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

        <MobileNavBar />
      </div>

      <CreateWorkspaceModal />
      <CreateChannelModal />
    </WorkspaceProvider>
  );
};

export default WorkspaceLayout;
