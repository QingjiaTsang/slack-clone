"use client";

import { Doc } from "@/convex/_generated/dataModel";

import { Skeleton } from "@/components/shadcnUI/skeleton";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcnUI/avatar";
import usePanel from "@/hooks/usePanel";

type DirectMessageHeroProps = {
  memberWithUserInfo: Doc<"members"> & { user: Doc<"users"> };
  isCurrentUser: boolean;
};

const DirectMessageHero = ({
  memberWithUserInfo,
  isCurrentUser,
}: DirectMessageHeroProps) => {
  const { openProfilePanel } = usePanel();

  return (
    <div className="mt-20 mx-5 mb-4 p-8 rounded-lg bg-gradient-to-r from-[#481349]/5 via-[#5E2C5F]/5 to-[#481349]/5">
      <div className="flex flex-col gap-4">
        <button
          onClick={() => openProfilePanel(memberWithUserInfo._id)}
          className="flex items-center gap-3"
        >
          <Avatar className="size-12">
            <AvatarImage src={memberWithUserInfo.user.image!} />
            <AvatarFallback className="text-xl">
              {memberWithUserInfo.user.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-xl font-semibold">
            {memberWithUserInfo.user.name} {isCurrentUser && "(you)"}
          </span>
        </button>
        <p className="text-sm text-muted-foreground">
          {isCurrentUser
            ? "This is your space. Draft messages, list your to-dos, or keep links and files handy. You can also talk to yourself here, but please bear in mind you’ll have to supply both sides of the conversation."
            : `This conversation is just between ${memberWithUserInfo.user.name} and you. Check out their profile to learn more about them.`}
        </p>
      </div>
    </div>
  );
};

const DirectMessageHeroSkeleton = () => {
  return (
    <div className="mt-20 mx-5 mb-4 p-8 rounded-lg">
      <Skeleton className="w-48 h-8 mb-2" />
      <Skeleton className="w-96 h-4" />
    </div>
  );
};

DirectMessageHero.Skeleton = DirectMessageHeroSkeleton;

export default DirectMessageHero;
