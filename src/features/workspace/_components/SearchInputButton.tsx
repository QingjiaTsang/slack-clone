"use client";

import { Id } from "@/convex/_generated/dataModel";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/shadcnUI/command";
import { Button } from "@/components/shadcnUI/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcnUI/avatar";

import { Search } from "lucide-react";

import {
  useGetAllChannelsByWorkspaceId,
  useGetWorkspaceById,
  useGetAllMembersByWorkspaceId,
} from "@/features/workspace/api/workspace";

type SearchInputButtonProps = {
  workspaceId: Id<"workspaces">;
};

const SearchInputButton = ({ workspaceId }: SearchInputButtonProps) => {
  const router = useRouter();

  const { data: workspace } = useGetWorkspaceById(workspaceId);
  const { data: channels } = useGetAllChannelsByWorkspaceId(workspaceId);
  const { data: members } = useGetAllMembersByWorkspaceId(workspaceId);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const gotoChannel = (channelId: Id<"channels">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const gotoDirectMessageMember = (memberId: Id<"members">) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <div className="p-2 w-2/3 relative">
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full h-10 bg-accent/25 hover:bg-accent/25 justify-start"
      >
        <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-200 dark:text-gray-300" />
        <span className="pl-10 text-white">{`Search in ${workspace?.name}`}</span>
        <CommandShortcut className="text-gray-400">⌘K</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Channels">
            {channels?.map((channel) => (
              <CommandItem
                key={channel._id}
                className="!py-2 cursor-pointer"
                onSelect={() => gotoChannel(channel._id)}
              >
                # {channel.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Members">
            {members?.map((member) => (
              <CommandItem
                key={member._id}
                className="!py-0 gap-0 cursor-pointer"
                onSelect={() => gotoDirectMessageMember(member._id)}
              >
                <Avatar className="flex items-center ">
                  <AvatarImage
                    src={member.user.image ?? ""}
                    className="size-6 rounded-lg"
                  />
                  <AvatarFallback className="size-6 rounded-lg">
                    {member.user.name?.[0] ?? "M"}
                  </AvatarFallback>
                </Avatar>
                <div className="-ml-1">{member.user.name}</div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchInputButton;
