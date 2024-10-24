"use client"

import { Channel, Workspace } from "@/types/docs";

import Link from "next/link";

import { useCreateChannelModal } from "@/stores/useCreateChannelModal";

import WorkspaceSection from "@/app/workspace/_components/WorkspaceSection";


type ChannelListProps = {
  channels: Channel[] | null;
  isAdmin: boolean;
  workspace: Workspace;
}

const ChannelList = ({ channels, isAdmin, workspace }: ChannelListProps) => {
  const { openModal } = useCreateChannelModal()

  return (
    <WorkspaceSection label="Channels" hint="Create a new channel" onNew={openModal}>
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