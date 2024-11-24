"use client";

import { Id } from "@/convex/_generated/dataModel";

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

import usePanel from "@/hooks/usePanel";
import WorkspaceLayoutSkeleton from "@/features/workspace/_components/WorkspaceLayoutSkeleton";
import ThreadPanel from "@/features/channel/_components/ThreadPanel";
import ProfilePanel from "@/features/member/_components/ProfilePanel";
import RingingCallModal from "@/features/call/_components/RingingCallModal";
import RingingCallFloatingEntry from "@/components/RingingCallFloatingEntry";

import useWorkspaceData from "@/features/workspace/hooks/useWorkspaceData";
import useCallManagement from "@/hooks/useCallManagement";

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
  } = useCallManagement(params.workspaceId, currentUserRoleInfo?._id);

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
      {/* show the ringing call modal for the recipient when the call is incoming */}
      <RingingCallModal
        ringingCall={incomingCall}
        isRingingCallModalOpen={isRingingCallModalOpen}
        setIsRingingCallModalOpen={setIsRingingCallModalOpen}
      />

      <div>
        <HeaderNavBar workspaceId={params.workspaceId} />
        <div className="flex">
          <SideBar
            currentWorkspace={currentWorkspace}
            userWorkspaces={userWorkspaces}
          />

          {/* show the floating entry for the caller and the recipient when the call is ringing */}
          <RingingCallFloatingEntry
            currentRingingCall={currentRingingCall}
            isCreator={
              currentRingingCall?.creatorId === currentUserRoleInfo?._id
            }
            setIsRingingCallModalOpen={setIsRingingCallModalOpen}
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
            <ResizableHandle withHandle className="bg-[#5E2C5F]" />
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
