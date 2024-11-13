"use client";

import { Workspace } from "@/types/docs";

import { useState } from "react";

import { ListFilterIcon, SquarePenIcon, ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { Button } from "@/components/shadcnUI/button";

import PreferenceModal from "@/features/workspace/_components/PreferenceModal";
import Hint from "@/components/Hint";
import InviteMemberModal from "@/features/workspace/_components/InviteMemberModal";

type WorkspaceSidebarHeaderProps = {
  workspace: Workspace | null;
  isAdmin: boolean;
};

const WorkspaceSidebarHeader = ({
  workspace,
  isAdmin,
}: WorkspaceSidebarHeaderProps) => {
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  return (
    <div className="py-2">
      <DropdownMenu>
        <div className="group relative flex items-center min-w-0">
          <DropdownMenuTrigger asChild>
            <Button
              variant="text"
              className="w-full flex items-center justify-start text-white hover:text-white gap-1 font-semibold text-xl"
            >
              <span className="truncate">{workspace?.name}</span>
              <ChevronDownIcon className="h-4 w-4 shrink-0" />
            </Button>
          </DropdownMenuTrigger>

          <div className="flex items-center text-white/80 hover:text-white shrink-0 gap-1 max-w-[72px] overflow-hidden transition-all duration-200 group-hover:max-w-0">
            <Hint description="Filter">
              <Button variant="transparent" size="icon" className="h-8 w-8">
                <ListFilterIcon className="h-4 w-4" />
              </Button>
            </Hint>
            <Hint description="Edit">
              <Button variant="transparent" size="icon" className="h-8 w-8">
                <SquarePenIcon className="h-4 w-4" />
              </Button>
            </Hint>
          </div>
        </div>

        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem>
            <div className="flex items-center gap-2 w-56">
              <Button
                size="icon"
                className="capitalize mr-2 font-semibold text-xl text-white bg-[#616061] group-hover:bg-[#616061]/80"
              >
                {workspace?.name[0]}
              </Button>
              <div className="flex flex-col">
                <div className="truncate font-semibold text-lg">
                  {" "}
                  {workspace?.name}
                </div>
                <div className="text-xs text-gray-500">Active Workspace</div>
              </div>
            </div>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setIsInviteMemberModalOpen(true)}
                className="cursor-pointer"
              >
                Invite people to {workspace?.name}
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
        setIsOpen={setIsPreferenceModalOpen}
        workspace={workspace!}
      />
      <InviteMemberModal
        isOpen={isInviteMemberModalOpen}
        setIsOpen={setIsInviteMemberModalOpen}
        workspace={workspace!}
      />
    </div>
  );
};

export default WorkspaceSidebarHeader;
