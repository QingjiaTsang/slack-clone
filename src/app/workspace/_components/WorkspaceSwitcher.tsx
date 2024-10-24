'use client'

import { Workspace } from "@/types/docs"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDownIcon, Plus } from 'lucide-react'

import { useCreateWorkspaceModal } from "@/stores/useCreateWorkspaceModal"
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from "@/lib/utils"

type WorkspaceSideBarMenuProps = {
  currentWorkspace: Workspace | null
  otherWorkspaces: Workspace[] | undefined
}

const WorkspaceSwitcher = ({ currentWorkspace, otherWorkspaces }: WorkspaceSideBarMenuProps) => {
  const router = useRouter()
  const { openModal } = useCreateWorkspaceModal()
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="text"
          size={isMobile ? "sm" : "icon"}
          className={cn(
            "capitalize text-xl bg-[#ABABAD] text-slate-700 font-semibold hover:bg-[#ABABAD]/80 mb-1",
            {
              "w-full justify-start mb-2": isMobile,
              "flex items-center justify-center": !isMobile
            }
          )}
        >
          <span className='hidden md:block'>
            {currentWorkspace?.name[0]}
          </span>
          {isMobile &&
            <>
              <span className="ml-3">{currentWorkspace?.name}</span>
              <span className="ml-auto">
                <ChevronDownIcon className="h-5 w-5 shrink-0" />
              </span>
            </>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" className={cn({ 'w-full bg-white': isMobile })}>
        <DropdownMenuItem className="flex flex-col items-start">
          <div className="text-lg font-medium truncate w-60">
            {currentWorkspace?.name}
          </div>
          <div className="text-sm text-muted-foreground">
            Active Workspace
          </div>
        </DropdownMenuItem>

        {otherWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace?._id}
            onClick={() => router.push(`/workspace/${workspace?._id}`)}
            className="flex flex-col items-start overflow-hidden cursor-pointer"
          >
            <div className="text-lg font-medium truncate w-60 group ">
              <Button variant="ghost" size="icon" className='capitalize mr-2 font-semibold text-xl text-white bg-[#616061] group-hover:bg-[#616061]/80'>
                {workspace?.name[0]}
              </Button>
              {workspace?.name}
            </div>
          </DropdownMenuItem>
        ))}


        <DropdownMenuItem>
          <div
            onClick={openModal}
            className="group flex items-center gap-2 font-medium cursor-pointer"
          >
            <Button variant={'ghost'} size={'icon'} className='text-xl bg-[#F2F2F2]  text-slate-800 font-semibold group-hover:bg-[#F2F2F2]/80'>
              <Plus />
            </Button>
            Create a new workspace
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WorkspaceSwitcher
