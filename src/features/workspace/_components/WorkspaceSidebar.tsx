import { Workspace } from "@/types/docs";

import {
  MessageSquareTextIcon,
  SendHorizonalIcon,
  TriangleAlertIcon,
} from "lucide-react";

import WorkspaceSidebarHeader from "@/features/workspace/_components/WorkspaceSidebarHeader";
import WorkspaceSidebarItem from "@/features/workspace/_components/WorkspaceSidebarItem";
import ChannelList from "@/features/workspace/_components/ChannelList";
import DmMemberList from "@/features/workspace/_components/DmMemberList";
import UserButton from "@/features/workspace/_components/UserButton";

import { useMediaQuery } from "@/hooks/useMediaQuery";

type WorkspaceSidebarProps = {
  isAdmin: boolean;
  workspace: Workspace | null;
  setIsMobileSideBarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const WorkspaceSidebar = ({
  isAdmin,
  workspace,
  setIsMobileSideBarOpen,
}: WorkspaceSidebarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TriangleAlertIcon className="size-10 text-destructive" />
        <div className="text-destructive text-lg font-semibold">
          No workspace found
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <WorkspaceSidebarHeader workspace={workspace} isAdmin={isAdmin} />

      <div className="flex flex-col gap-0.5 px-2">
        <WorkspaceSidebarItem
          id="threads"
          label="Threads"
          icon={MessageSquareTextIcon}
          workspace={workspace}
        />
        <WorkspaceSidebarItem
          id="drafts & sent"
          label="Drafts & Sent"
          icon={SendHorizonalIcon}
          workspace={workspace}
        />

        <ChannelList
          workspace={workspace}
          setIsMobileSideBarOpen={setIsMobileSideBarOpen}
        />

        <DmMemberList
          workspaceId={workspace._id}
          setIsMobileSideBarOpen={setIsMobileSideBarOpen}
        />
      </div>

      {isMobile && (
        <div className="mt-auto px-5 py-2.5 w-full">
          <UserButton isMobile={isMobile} />
        </div>
      )}
    </div>
  );
};

export default WorkspaceSidebar;
