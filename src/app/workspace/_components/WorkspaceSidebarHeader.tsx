'use client'

import { Workspace } from "@/types/docs";

import { useState } from "react";

import { ListFilterIcon, SquarePenIcon, ChevronDownIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

import PreferenceModal from "@/app/workspace/_components/PreferenceModal";

type WorkspaceSidebarHeaderProps = {
  currentWorkspace: Workspace | null;
  isAdmin: boolean;
}

const WorkspaceSidebarHeader = ({ currentWorkspace, isAdmin }: WorkspaceSidebarHeaderProps) => {
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);

  return (
    <div className="p-2">
      <DropdownMenu>
        <div className="flex items-center justify-center gap-2">
          <DropdownMenuTrigger asChild>
            <Button
              variant="text"
              className="w-full flex justify-start text-white hover:text-white gap-1 font-semibold text-xl"
            >
              <span className="truncate"> {currentWorkspace?.name}</span>
              <ChevronDownIcon className="h-4 w-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <div className="flex items-center text-white gap-4 mx-2">
            <ListFilterIcon className="h-4 w-4 shrink-0 cursor-pointer" />
            <SquarePenIcon className="h-4 w-4 shrink-0 cursor-pointer" />
          </div>
        </div>


        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem>
            <div className="flex items-center gap-2 w-56">
              <Button
                size="icon"
                className="capitalize mr-2 font-semibold text-xl text-white bg-[#616061] group-hover:bg-[#616061]/80"
              >
                {currentWorkspace?.name[0]}
              </Button>
              <div className="flex flex-col">
                <div className="truncate font-semibold text-lg"> {currentWorkspace?.name}</div>
                <div className="text-xs text-gray-500">Active Workspace</div>
              </div>
            </div>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                Invite people to {currentWorkspace?.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setIsPreferenceModalOpen(true)}
                className="cursor-pointer"
              >
                Preferences
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <PreferenceModal
        isOpen={isPreferenceModalOpen}
        onClose={() => setIsPreferenceModalOpen(false)}
        currentWorkspace={currentWorkspace}
      />
    </div>
  )
}

export default WorkspaceSidebarHeader