import { Id } from "@/convex/_generated/dataModel";

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcnUI/resizable"

import WorkspaceProvider from "@/features/workspace/_components/WorkspaceProvider";
import HeaderNavBar from '@/features/workspace/_components/HeaderNavBar'
import SideBar from "@/features/workspace/_components/SideBar";
import WorkspaceSidebar from "@/features/workspace/_components/WorkspaceSidebar";

import CreateWorkspaceModal from "@/components/CreateWorkspaceModal";
import CreateChannelModal from "@/components/CreateChannelModal";


type WorkspaceLayoutProps = {
  children: React.ReactNode,
  params: {
    workspaceId: Id<"workspaces">
  }
}

const WorkspaceLayout = async ({ children, params }: WorkspaceLayoutProps) => {
  // Note: Data fetched from the React Server Component (RSC) will be cached and won't update immediately when Convex data changes.
  // Since Convex normally has an automatic real-time data update mechanism (implemented by websocket),
  // it's better to use client-side fetching for data that needs to be real-time or immediately updated.
  const workspacePromise = fetchQuery(
    api.workspaces.getOneById,
    { id: params.workspaceId },
    { token: convexAuthNextjsToken() }
  );

  const userWorkspacesPromise = fetchQuery(
    api.workspaces.getAllByAuth,
    {},
    { token: convexAuthNextjsToken() }
  );

  const currentUserRoleInfoPromise = fetchQuery(
    api.workspaces.getCurrentUserRoleInWorkspace,
    { id: params.workspaceId },
    { token: convexAuthNextjsToken() }
  );

  const [currentWorkspace, userWorkspaces, currentUserRoleInfo] = await Promise.all([workspacePromise, userWorkspacesPromise, currentUserRoleInfoPromise]);

  const isAdmin = currentUserRoleInfo?.role === "admin";

  return (
    <WorkspaceProvider currentWorkspace={currentWorkspace}>
      <div>
        <HeaderNavBar />
        <div className="flex">
          <SideBar currentWorkspace={currentWorkspace} userWorkspaces={userWorkspaces} />


          <ResizablePanelGroup direction="horizontal" autoSaveId="workspace-layout">
            <ResizablePanel
              defaultSize={20}
              minSize={10}
              className="bg-[#5E2C5F] h-[calc(100svh-56px)]"
            >
              <WorkspaceSidebar isAdmin={isAdmin} workspace={currentWorkspace} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              {children}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <CreateWorkspaceModal />
      <CreateChannelModal />
    </WorkspaceProvider >
  )
}

export default WorkspaceLayout
