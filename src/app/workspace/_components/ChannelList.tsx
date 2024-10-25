"use client"

import { Channel, Workspace } from "@/types/docs";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

import { useCreateChannelModal } from "@/stores/useCreateChannelModal";

import WorkspaceSection from "@/app/workspace/_components/WorkspaceSection";

import { Loader2Icon } from "lucide-react";

type ChannelListProps = {
  isAdmin: boolean;
  workspace: Workspace;
}

const ChannelList = ({ isAdmin, workspace }: ChannelListProps) => {
  const { openModal } = useCreateChannelModal()

  const { data: channels, isPending } = useQuery(
    convexQuery(api.channels.getAllByWorkspaceId, { workspaceId: workspace._id }),
  );


  return (
    <WorkspaceSection label="Channels" hint="Create a new channel" onNew={openModal}>
      {isPending &&
        <div className="flex items-center justify-center py-1 px-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
        </div>
      }
      {channels?.map((channel) => (
        <ChannelItem key={channel._id} channel={channel} workspace={workspace} />
      ))}
    </WorkspaceSection>
  )
}

export default ChannelList

const ChannelItem = ({ channel, workspace }: { channel: Channel, workspace: Workspace }) => {
  return (
    <Link href={`/workspace/${workspace._id}/channel/${channel._id}`}>
      <div className="flex items-center lowercase text-[#f9edffcc] gap-2 cursor-pointer hover:bg-white/10 rounded-md py-0.5 px-2">
        <div className="text-sm shrink-0">#</div>
        <div className="truncate">{channel.name}</div>
      </div>
    </Link>
  )
}