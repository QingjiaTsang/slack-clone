'use client'

import { Id } from "@/convex/_generated/dataModel";
import { User } from "@auth/core/types";
import { Member } from "@/types/docs";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@/convex/_generated/api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnUI/avatar"
import { Skeleton } from "@/components/shadcnUI/skeleton"

import WorkspaceSection from "@/features/workspace/_components/WorkspaceSection";

interface DmMemberListProps {
  workspaceId: Id<'workspaces'>;
}

const DmMemberList = ({ workspaceId }: DmMemberListProps) => {
  const { data: members, isPending } = useQuery(
    convexQuery(api.members.getAllByWorkspaceId, { workspaceId }),
  );

  return (
    <WorkspaceSection label="Direct Messages" hint="Create a new direct message" onNew={() => { }}>
      {isPending &&
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2 rounded-md py-1 px-2">
              <Skeleton className="size-5 bg-white/10 shrink-0" />
              <Skeleton className="flex-1 h-5 bg-white/10" />
            </div>
          ))
          }
        </>
      }

      {members?.map((member: Member & { user: User }) => (
        <DmMemberItem key={member._id} member={member} />
      ))}
    </WorkspaceSection >
  )
}

export default DmMemberList

const DmMemberItem = ({ member }: { member: Member & { user: User } }) => {
  return (
    <Link href={`/user/${member.user.id}`}>
      <div className="flex items-center lowercase text-[#f9edffcc] gap-2 cursor-pointer hover:bg-white/10 rounded-md py-1 px-2">
        <Avatar className="rounded-md size-5">
          <AvatarImage src={member.user.image!} />
          <AvatarFallback className="rounded-md bg-blue-500 text-white capitalize">{member.user.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="truncate">{member.user.name}</div>
      </div>
    </Link>
  )
}