'use client'

import { Workspace } from '@/types/docs'
import { usePathname } from 'next/navigation';
import UserButton from '@/app/workspace/_components/UserButton'
import WorkspaceSwitcher from '@/app/workspace/_components/WorkspaceSwitcher'
import SideBarButton from '@/app/workspace/_components/SideBarButton';
import { BellIcon, HomeIcon, MessageSquareIcon, MoreHorizontalIcon, MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type SideNavBarProps = {
  currentWorkspace: Workspace | null
  userWorkspaces: Workspace[] | null
}

const SideBar = ({ currentWorkspace, userWorkspaces }: SideNavBarProps) => {
  const pathname = usePathname();
  const filteredWorkspaces = userWorkspaces?.filter((userWorkspace) => userWorkspace?._id !== currentWorkspace?._id)
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: HomeIcon, label: "Home", isActive: pathname.startsWith('/workspace') },
    { icon: MessageSquareIcon, label: "DMs", isActive: pathname === '/dm' },
    { icon: BellIcon, label: "Notifications", isActive: pathname === '/notifications' },
    { icon: MoreHorizontalIcon, label: "More", isActive: pathname === '/more' },
  ];

  return (
    <>
      {/* Mobile Menu */}
      <div className="md:hidden">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-2 left-4 z-50 text-white"
            >
              <MenuIcon className="h-6 w-6 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mt-2 p-2 bg-white">
            <WorkspaceSwitcher currentWorkspace={currentWorkspace} otherWorkspaces={filteredWorkspaces} />
            {navItems.map((item, index) => (
              <SideBarButton key={index} {...item} onClick={() => setIsOpen(false)} />
            ))}
            <div className="mt-4">
              <UserButton />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-[calc(100vh-56px)] w-24 bg-[#481349] flex-col justify-between items-center p-2">
        <div className="flex flex-col items-center h-full text-gray-200 gap-4">
          <WorkspaceSwitcher currentWorkspace={currentWorkspace} otherWorkspaces={filteredWorkspaces} />

          {navItems.map((item) => (
            <SideBarButton
              key={item.label}
              {...item}
            />
          ))}
        </div>

        <UserButton />
      </aside>
    </>
  )
}

export default SideBar
