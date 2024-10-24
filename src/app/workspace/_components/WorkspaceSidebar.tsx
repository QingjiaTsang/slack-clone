import { User } from '@auth/core/types';
import { Workspace, Channel, Member } from '@/types/docs';

import { MessageSquareTextIcon, SendHorizonalIcon, TriangleAlertIcon } from "lucide-react";

import WorkspaceSidebarHeader from '@/app/workspace/_components/WorkspaceSidebarHeader';
import WorkspaceSidebarItem from '@/app/workspace/_components/WorkspaceSidebarItem';
import ChannelList from '@/app/workspace/_components/ChannelList';
import DmMemberList from '@/app/workspace/_components/DmMemberList';

type WorkspaceSidebarProps = {
  isAdmin: boolean;
  workspace: Workspace | null;
  channels: Channel[] | null;
  members: (Member & { user: User })[] | null;
}

const WorkspaceSidebar = async ({ isAdmin, workspace, channels, members }: WorkspaceSidebarProps) => {

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

        <ChannelList isAdmin={isAdmin} channels={channels} workspace={workspace} />

        <DmMemberList members={members} />
      </div>
    </div>
  )
}

export default WorkspaceSidebar