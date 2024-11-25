"use client";

import { Workspace } from "@/types/docs";
import { usePathname } from "next/navigation";
import UserButton from "@/features/workspace/_components/UserButton";
import WorkspaceSwitcher from "@/features/workspace/_components/WorkspaceSwitcher";
import SideBarButton from "@/features/workspace/_components/SideBarButton";
import {
  BellIcon,
  HomeIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
} from "lucide-react";

type SideNavBarProps = {
  currentWorkspace: Workspace | null;
  userWorkspaces: Workspace[] | null;
};

const SideBar = ({ currentWorkspace, userWorkspaces }: SideNavBarProps) => {
  const pathname = usePathname();
  const filteredWorkspaces = userWorkspaces?.filter(
    (userWorkspace) => userWorkspace?._id !== currentWorkspace?._id
  );
  const navItems = [
    {
      icon: HomeIcon,
      label: "Home",
      isActive: pathname.startsWith("/workspace"),
    },
    { icon: MessageSquareIcon, label: "DMs", isActive: pathname === "/dm" },
    {
      icon: BellIcon,
      label: "Activities",
      isActive: pathname === "/activities",
    },
    { icon: MoreHorizontalIcon, label: "More", isActive: pathname === "/more" },
  ];

  return (
    <aside className="hidden md:flex h-[calc(100svh-56px)] w-20 bg-[#481349] flex-col justify-between items-center p-2">
      <div className="flex flex-col items-center h-full text-gray-200 gap-4">
        <WorkspaceSwitcher
          currentWorkspace={currentWorkspace}
          otherWorkspaces={filteredWorkspaces}
        />

        {navItems.map((item) => (
          <SideBarButton key={item.label} {...item} />
        ))}
      </div>

      <UserButton />
    </aside>
  );
};

export default SideBar;
