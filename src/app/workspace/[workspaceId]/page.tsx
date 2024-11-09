'use client'

import { Id } from "@/convex/_generated/dataModel";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";

import { useCreateChannelModal } from "@/stores/useCreateChannelModal";

import { Loader2Icon, TriangleAlertIcon } from "lucide-react";
import { getCurrentUserRoleInWorkspace, getWorkspaceById } from "@/features/workspace/api";
import { getAllChannelsByWorkspaceId } from "@/features/channel/api";

type WorkspacePageProps = {
  params: {
    workspaceId: Id<"workspaces">
  }
}

const WorkspacePage = ({ params }: WorkspacePageProps) => {
  const router = useRouter()

  const { isOpen, openModal } = useCreateChannelModal()

  const { data: workspace, isPending: isWorkspacePending } = getWorkspaceById(params.workspaceId)

  const { data: channels, isPending: isChannelsPending } = getAllChannelsByWorkspaceId(params.workspaceId)

  const { data: currentUserRoleInfo, isPending: isCurrentUserRoleInfoPending } = getCurrentUserRoleInWorkspace(params.workspaceId)

  useEffect(() => {
    if (channels && channels.length > 0) {
      router.replace(`/workspace/${params.workspaceId}/channel/${channels[0]._id}`)
      return
    }

    if (currentUserRoleInfo?.role === "admin") {
      openModal()
    }
  }, [isOpen, channels, currentUserRoleInfo, router, params.workspaceId, openModal])

  if (isWorkspacePending || isChannelsPending || isCurrentUserRoleInfoPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2Icon className="animate-spin" />
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TriangleAlertIcon className="size-10 text-destructive" />
        <div className="text-destructive text-lg font-semibold">
          No workspace found
        </div>
      </div>
    )
  }

  if (!channels || channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TriangleAlertIcon className="size-10 text-destructive" />
        <div className="text-destructive text-lg font-semibold">
          No channels found
        </div>
      </div>
    )
  }

  return null
}

export default WorkspacePage
