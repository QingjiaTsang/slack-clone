"use client"

import { Channel, Workspace } from "@/types/docs";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";

import { Skeleton } from "@/components/shadcnUI/skeleton"

import { useCreateChannelModal } from "@/stores/useCreateChannelModal";

import WorkspaceSection from "@/features/workspace/_components/WorkspaceSection";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type ChannelListProps = {
  workspace: Workspace;
}

const ChannelList = ({ workspace }: ChannelListProps) => {
  const { openModal } = useCreateChannelModal()

  const { data: channels, isPending } = useQuery(
    convexQuery(api.channels.getAllByWorkspaceId, { workspaceId: workspace._id }),
  );

  return (
    <WorkspaceSection label="Channels" hint="Create a new channel" onNew={openModal}>
      {isPending &&
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 rounded-md py-0.5 px-2">
              <Skeleton className="w-full h-5 bg-white/10" />
            </div>
          ))}
        </>
      }

      {channels?.map((channel) => (
        <ChannelItem key={channel._id} channel={channel} workspace={workspace} />
      ))}
    </WorkspaceSection>
  )
}

export default ChannelList

const ChannelItem = ({ channel, workspace }: { channel: Channel, workspace: Workspace }) => {
  const pathname = usePathname()

  return (
    <Link href={`/workspace/${workspace._id}/channel/${channel._id}`}>
      <div
        className={cn(
          "flex items-center lowercase text-[#f9edffcc] gap-2 cursor-pointer hover:bg-white/10 rounded-md py-0.5 px-3",
          { "bg-white/30 hover:bg-white/30": pathname === `/workspace/${workspace._id}/channel/${channel._id}` }
        )}
      >
        <div className="text-sm shrink-0">#</div>
        <div className="truncate">{channel.name}</div>
      </div>
    </Link>
  )
}