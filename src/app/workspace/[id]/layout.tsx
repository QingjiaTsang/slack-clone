import { Id } from "../../../../convex/_generated/dataModel";

import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import WorkspaceProvider from "@/app/workspace/_components/WorkspaceProvider";
import HeaderNavBar from '@/app/workspace/_components/HeaderNavBar'
import SideBar from "@/app/workspace/_components/SideBar";
import CreateWorkspaceModal from "@/components/CreateWorkspaceModal";
import { notFound } from "next/navigation";


type TWorkspaceLayoutProps = {
  children: React.ReactNode,
  params: {
    id: Id<"workspaces">
  }
}

const WorkspaceLayout = async ({ children, params }: TWorkspaceLayoutProps) => {
  // Note: Data fetched from the React Server Component (RSC) will be cached and won't update immediately when Convex data changes.
  // Since Convex normally has an automatic real-time data update mechanism (implemented by websocket),
  // it's better to use client-side fetching for data that needs to be real-time.
  const workspace = await fetchQuery(
    api.workspaces.getWorkspaceById,
    { id: params.id },
    { token: convexAuthNextjsToken() }
  );

  const userWorkspaces = await fetchQuery(
    api.workspaces.getWorkspacesByAuth,
    {},
    { token: convexAuthNextjsToken() }
  );

  if (!workspace) {
    return notFound();
  }

  return (
    <WorkspaceProvider currentWorkspace={workspace}>
      <div>
        <HeaderNavBar />
        <div className="flex">
          <SideBar currentWorkspace={workspace} userWorkspaces={userWorkspaces} />
          {children}
        </div>
      </div>
      <CreateWorkspaceModal />
    </WorkspaceProvider>
  )
}

export default WorkspaceLayout
