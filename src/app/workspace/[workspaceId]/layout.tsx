"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";

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
import { useEffect, useMemo } from "react";
import { useSubscribeRingingCall } from "@/features/call/api/call";
import RingingCallModal from "@/features/call/_components/RingingCallModal";
import { toast } from "sonner";

type CallStatusRecord = {
  [K in Doc<"calls">["status"]]?: number;
} & {
  ringTimeout?: number;
};

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

  const { data: ringingCall } = useSubscribeRingingCall(params.workspaceId);

  const { parentMessageId, profileMemberId, closePanel } = usePanel();

  const isAdmin = currentUserRoleInfo?.role === "admin";

  const showPanel = !!parentMessageId || !!profileMemberId;

  const incomingCall = useMemo(() => {
    if (!ringingCall) {
      return null;
    }

    if (
      ringingCall.recipientId === currentUserRoleInfo?._id &&
      ringingCall.status === "ringing"
    ) {
      return ringingCall;
    }

    return null;
  }, [ringingCall, currentUserRoleInfo]);

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

  // Using localStorage to track which call status notifications have already been shown to the user
  // This prevents duplicate notifications if the component re-renders or the user reloads the page,
  // and the call hasn't reached the ringTimeout which will cause the toast still to be shown
  useEffect(() => {
    const isCallCreator = ringingCall?.creatorId === currentUserRoleInfo?._id;
    if (!ringingCall || !isCallCreator) {
      return;
    }

    const shownStatuses: CallStatusRecord = JSON.parse(
      localStorage.getItem(`call-status-${ringingCall._id}`) || "{}"
    );

    if (ringingCall.status === "ongoing" && !shownStatuses?.ongoing) {
      toast.info(`Call to ${ringingCall.recipientName} is accepted`);
      router.push(
        `/workspace/${ringingCall.workspaceId}/call/${ringingCall._id}`
      );
    } else if (ringingCall.status === "rejected" && !shownStatuses?.rejected) {
      toast.error(`Call to ${ringingCall.recipientName} is rejected`);
    }

    localStorage.setItem(
      `call-status-${ringingCall._id}`,
      JSON.stringify({
        ...shownStatuses,
        [ringingCall.status]: ringingCall.statusUpdatedAt,
        ringTimeout: ringingCall.ringTimeout,
      } satisfies CallStatusRecord)
    );

    // cleanup expired calls status records in localStorage
    // when the latest feedback of a call is received
    const cleanupExpiredCallStatusRecords = () => {
      const allKeys = Object.keys(localStorage);
      allKeys.forEach((key) => {
        if (key.startsWith("call-status-")) {
          const callId = key.replace("call-status-", "");
          const callStatusRecord = JSON.parse(
            localStorage.getItem(key) || "{}"
          ) as CallStatusRecord;

          if (callId !== ringingCall._id) {
            if (
              callStatusRecord.ringTimeout &&
              callStatusRecord.ringTimeout < Date.now()
            ) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    };

    cleanupExpiredCallStatusRecords();
  }, [ringingCall, currentUserRoleInfo, router]);

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
      <RingingCallModal ringingCall={incomingCall} />

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
