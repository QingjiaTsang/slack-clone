"use client";

import { Input } from "@/components/shadcnUI/input";

import { Search } from "lucide-react";

import { useAtomValue } from "jotai";
import { workspaceAtom } from "@/features/workspace/_components/WorkspaceProvider";

const SearchInput = () => {
  const workspace = useAtomValue(workspaceAtom);

  return (
    <div className="p-2 w-2/3 relative">
      <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-200 dark:text-gray-300" />
      <Input
        placeholder={`Search in ${workspace?.name}`}
        className="w-full bg-white/50 pl-10 text-white placeholder:text-gray-200 dark:placeholder:text-gray-300 border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default SearchInput;
