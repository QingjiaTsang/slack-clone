"use client";

import { Id } from "@/convex/_generated/dataModel";
import { Workspace } from "@/types/docs";

import { useState } from "react";

import SearchInputButton from "@/features/workspace/_components/SearchInputButton";
import { Button } from "@/components/shadcnUI/button";
import { CircleAlert, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcnUI/sheet";
import WorkspaceSidebar from "./WorkspaceSidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type HeaderNavBarProps = {
  workspaceId: Id<"workspaces">;
  isAdmin: boolean;
  workspace: Workspace;
};

const HeaderNavBar = ({
  workspaceId,
  isAdmin,
  workspace,
}: HeaderNavBarProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isMobileSideBarOpen, setIsMobileSideBarOpen] = useState(false);

  if (isMobile) {
    return (
      <nav className="flex h-14 items-center justify-between bg-[#481349] px-4 text-white">
        <Sheet open={isMobileSideBarOpen} onOpenChange={setIsMobileSideBarOpen}>
          <SheetTrigger asChild>
            <Button variant="transparent" size="icon" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            hideCloseButton={true}
            className="w-[280px] p-0 bg-[#5E2C5F] border-none"
          >
            <WorkspaceSidebar
              isAdmin={isAdmin}
              workspace={workspace}
              setIsMobileSideBarOpen={setIsMobileSideBarOpen}
            />
          </SheetContent>
        </Sheet>

        <SearchInputButton workspaceId={workspaceId} />

        <Button variant="transparent" size="icon">
          <CircleAlert className="size-5" />
        </Button>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between bg-[#481349] text-white px-4">
      <div className="w-10" />
      <SearchInputButton workspaceId={workspaceId} />
      <Button variant="transparent" size="icon">
        <CircleAlert className="size-5" />
      </Button>
    </nav>
  );
};

export default HeaderNavBar;
