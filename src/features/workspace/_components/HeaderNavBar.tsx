"use client";

import { Id } from "@/convex/_generated/dataModel";

import SearchInputButton from "@/features/workspace/_components/SearchInputButton";

import { CircleAlert } from "lucide-react";

import { Button } from "@/components/shadcnUI/button";

type HeaderNavBarProps = {
  workspaceId: Id<"workspaces">;
};

const HeaderNavBar = ({ workspaceId }: HeaderNavBarProps) => {
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
