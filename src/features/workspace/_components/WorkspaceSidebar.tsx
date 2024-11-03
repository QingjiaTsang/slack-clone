import { Workspace } from '@/types/docs';

import { MessageSquareTextIcon, SendHorizonalIcon, TriangleAlertIcon } from "lucide-react";

import WorkspaceSidebarHeader from '@/features/workspace/_components/WorkspaceSidebarHeader';
import WorkspaceSidebarItem from '@/features/workspace/_components/WorkspaceSidebarItem';
import ChannelList from '@/features/workspace/_components/ChannelList';
import DmMemberList from '@/features/workspace/_components/DmMemberList';

type WorkspaceSidebarProps = {
  isAdmin: boolean;
  workspace: Workspace | null;
}

const WorkspaceSidebar = async ({ isAdmin, workspace }: WorkspaceSidebarProps) => {
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
    <div className='flex flex-col'>
      <WorkspaceSidebarHeader workspace={workspace} isAdmin={isAdmin} />

      <div className="flex flex-col gap-0.5 px-2">
        <WorkspaceSidebarItem id="threads" label="Threads" icon={MessageSquareTextIcon} workspace={workspace} />
        <WorkspaceSidebarItem id="drafts & sent" label="Drafts & Sent" icon={SendHorizonalIcon} workspace={workspace} />

        <ChannelList workspace={workspace} />

        <DmMemberList workspaceId={workspace._id} />
      </div>
    </div>
  )
}

export default WorkspaceSidebar