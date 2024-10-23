import { Workspace } from '@/types/docs';

import { TriangleAlertIcon } from "lucide-react";

import WorkspaceSidebarHeader from '@/app/workspace/_components/WorkspaceSidebarHeader';

type WorkspaceSidebarProps = {
  currentWorkspace: Workspace | null;
  isAdmin: boolean;
}

const WorkspaceSidebar = ({ currentWorkspace, isAdmin }: WorkspaceSidebarProps) => {

  if (!currentWorkspace) {
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
      <WorkspaceSidebarHeader currentWorkspace={currentWorkspace} isAdmin={isAdmin} />
    </div>
  )
}

export default WorkspaceSidebar