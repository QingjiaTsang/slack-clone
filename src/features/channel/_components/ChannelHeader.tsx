'use client'

import { Channel } from "@/types/docs"

import { useState } from "react"

import { Button } from "@/components/shadcnUI/button"

import ChannelOperationsModal from "@/features/channel/_components/ChannelOperationsModal"

import { ChevronDownIcon } from "lucide-react"


type ChannelHeaderProps = {
  channel: Channel
  isAdmin: boolean
}

const ChannelHeader = ({ channel, isAdmin }: ChannelHeaderProps) => {
  const [isChannelOperationsModalOpen, setIsChannelOperationsModalOpen] = useState(false);

  return (
    <div className="p-2 border-b border-b-gray-100 shadow-sm">
      <Button
        variant="text"
        onClick={() => setIsChannelOperationsModalOpen(true)}
        className="flex gap-1 font-semibold text-xl hover:bg-blue-300/10"
      >
        <span>#</span>
        <span className="truncate ml-1"> {channel?.name}</span>
        <ChevronDownIcon className="h-4 w-4 shrink-0" />
      </Button>

      <ChannelOperationsModal
        isAdmin={isAdmin}
        isOpen={isChannelOperationsModalOpen}
        setIsOpen={setIsChannelOperationsModalOpen}
        channel={channel}
      />
    </div>
  )
}

export default ChannelHeader