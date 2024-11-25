"use client";

import { Id } from "@/convex/_generated/dataModel";
import { User } from "@auth/core/types";
import { Member } from "@/types/docs";

import { useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnUI/avatar";
import { Skeleton } from "@/components/shadcnUI/skeleton";

import WorkspaceSection from "@/features/workspace/_components/WorkspaceSection";
import { useGetAllMembersByWorkspaceId } from "@/features/workspace/api/workspace";

type DmMemberListProps = {
  workspaceId: Id<"workspaces">;
  setIsMobileSideBarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const DmMemberList = ({
  workspaceId,
  setIsMobileSideBarOpen,
}: DmMemberListProps) => {
  const { data: members, isPending } =
    useGetAllMembersByWorkspaceId(workspaceId);

  return (
    <WorkspaceSection
      label="Direct Messages"
      hint="Create a new direct message"
      // todo
      onNew={() => {}}
    >
      {isPending && (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md py-1 px-2"
            >
              <Skeleton className="size-5 bg-white/10 shrink-0" />
              <Skeleton className="flex-1 h-5 bg-white/10" />
            </div>
          ))}
        </>
      )}

      {members?.map((member: Member & { user: User }) => (
        <DmMemberItem
          key={member._id}
          member={member}
          workspaceId={workspaceId}
          setIsMobileSideBarOpen={setIsMobileSideBarOpen}
        />
      ))}
    </WorkspaceSection>
  );
};

export default DmMemberList;

const DmMemberItem = ({
  member,
  workspaceId,
  setIsMobileSideBarOpen,
}: {
  member: Member & { user: User };
  workspaceId: Id<"workspaces">;
  setIsMobileSideBarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        setIsMobileSideBarOpen?.(false);
        router.push(`/workspace/${workspaceId}/member/${member._id}`);
      }}
      className="flex items-center lowercase text-[#f9edffcc] gap-2 cursor-pointer hover:bg-white/10 py-1 px-2"
    >
      <Avatar className="size-5">
        <AvatarImage src={member?.user?.image ?? ""} />
        <AvatarFallback className="text-xs">
          {member?.user?.name?.[0]?.toUpperCase() ?? ""}
        </AvatarFallback>
      </Avatar>
      <div className="truncate">{member?.user?.name ?? ""}</div>
    </div>
  );
};
