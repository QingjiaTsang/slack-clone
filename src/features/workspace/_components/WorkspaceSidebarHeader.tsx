"use client";

import { Workspace } from "@/types/docs";

import { useState, useMemo } from "react";

import {
  ListFilterIcon,
  SquarePenIcon,
  ChevronDownIcon,
  PlusIcon,
} from "lucide-react";

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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import { useGetAllWorkspacesByAuth } from "@/features/workspace/api/workspace";
import { useCreateWorkspaceModal } from "@/stores/useCreateWorkspaceModal";

type WorkspaceSidebarHeaderProps = {
  workspace: Workspace | null;
  isAdmin: boolean;
};

const WorkspaceSidebarHeader = ({
  workspace,
  isAdmin,
}: WorkspaceSidebarHeaderProps) => {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: userWorkspaces } = useGetAllWorkspacesByAuth();

  const { openModal } = useCreateWorkspaceModal();

  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false);

  const otherWorkspaces = useMemo(
    () =>
      userWorkspaces?.filter(
        (userWorkspace) => userWorkspace?._id !== workspace?._id
      ),
    [userWorkspaces, workspace?._id]
  );

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

          <div className="flex items-center text-white/80 hover:text-white shrink-0 gap-1 max-w-[72px] overflow-hidden transition-all duration-200">
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

          {isMobile && (
            <>
              {otherWorkspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace?._id}
                  onClick={() => router.push(`/workspace/${workspace?._id}`)}
                  className="flex flex-col gap-2 items-start overflow-hidden cursor-pointer"
                >
                  <div className="text-lg font-medium truncate w-60 group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="capitalize mr-4 font-semibold text-xl text-white bg-[#616061] group-hover:bg-[#616061]/80"
                    >
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
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="text-xl mr-2 bg-[#F2F2F2]  text-slate-800 font-semibold group-hover:bg-[#F2F2F2]/80"
                  >
                    <PlusIcon />
                  </Button>
                  Create a new workspace
                </div>
              </DropdownMenuItem>
            </>
          )}

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
