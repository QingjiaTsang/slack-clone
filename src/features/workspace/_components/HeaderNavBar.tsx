"use client";

import { Id } from "@/convex/_generated/dataModel";
import { Workspace } from "@/types/docs";

import { useState } from "react";

import SearchInputButton from "@/features/workspace/_components/SearchInputButton";
import { Button } from "@/components/shadcnUI/button";
import { CircleAlert, Menu } from "lucide-react";
import {
  Credenza,
  CredenzaContent,
  CredenzaTrigger,
} from "@/components/shadcnUI/credenza";
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
  return (
    <nav className="flex items-center justify-between bg-[#481349] text-white px-4">
      <MobileSideBarDrawer isAdmin={isAdmin} workspace={workspace} />

      <div className="hidden md:block w-10" />
      <SearchInputButton workspaceId={workspaceId} />
      <Button variant="transparent" size="icon">
        <CircleAlert className="size-5" />
      </Button>
    </nav>
  );
};

export default HeaderNavBar;

type MobileSideBarDrawerProps = {
  isAdmin: boolean;
  workspace: Workspace;
};

const MobileSideBarDrawer = ({
  isAdmin,
  workspace,
}: MobileSideBarDrawerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isMobileSideBarOpen, setIsMobileSideBarOpen] = useState(false);

  if (!isMobile) {
    return null;
  }

  return (
    <Credenza
      direction="left"
      open={isMobileSideBarOpen}
      onOpenChange={setIsMobileSideBarOpen}
    >
      <CredenzaTrigger asChild>
        <Button variant="transparent" size="icon">
          <Menu className="size-5" />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent className="w-[310px] p-0 bg-[#5E2C5F] border-none">
        <WorkspaceSidebar
          isAdmin={isAdmin}
          workspace={workspace}
          setIsMobileSideBarOpen={setIsMobileSideBarOpen}
        />
      </CredenzaContent>
    </Credenza>
  );
};
