"use client";

import { Doc } from "@/convex/_generated/dataModel";

import { Button } from "@/components/shadcnUI/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcnUI/avatar";
import usePanel from "@/hooks/usePanel";

type DirectMessageHeaderProps = {
  memberWithUserInfo: Doc<"members"> & { user: Doc<"users"> };
};

const DirectMessageHeader = ({
  memberWithUserInfo,
}: DirectMessageHeaderProps) => {
  const { openProfilePanel } = usePanel();

  return (
    <div className="p-2 border-b border-b-gray-100 shadow-sm">
      <Button
        variant="text"
        onClick={() => openProfilePanel(memberWithUserInfo._id)}
        className="flex items-center gap-1 font-semibold text-xl"
      >
        <Avatar className="size-6">
          <AvatarImage src={memberWithUserInfo.user.image!} />
          <AvatarFallback>{memberWithUserInfo.user.name?.[0]}</AvatarFallback>
        </Avatar>
        <span className="truncate ml-1"> {memberWithUserInfo.user.name}</span>
      </Button>
    </div>
  );
};

export default DirectMessageHeader;
