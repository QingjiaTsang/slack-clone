'use client'

import { User } from "@auth/core/types";
import { Member } from "@/types/docs";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import WorkspaceSection from "@/app/workspace/_components/WorkspaceSection";

interface DmMemberListProps {
  members: (Member & { user: User })[] | null;
}

const DmMemberList = ({ members }: DmMemberListProps) => {

  return (
    <WorkspaceSection label="Direct Messages" hint="Create a new direct message" onNew={() => { }}>
      {members?.map((member) => (
        <DmMemberItem key={member._id} member={member} />
      ))}
    </WorkspaceSection>
  )
}

export default DmMemberList

const DmMemberItem = ({ member }: { member: Member & { user: User } }) => {
  return (
    <Link href={`/user/${member.user.id}`}>
      <div className="flex items-center lowercase text-[#f9edffcc] gap-2 cursor-pointer hover:bg-white/10 rounded-md py-1 px-2">
        <Avatar className="rounded-md size-5">
          <AvatarImage src={member.user.image!} />
          <AvatarFallback>{member.user.name?.[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="truncate">{member.user.name}</div>
      </div>
    </Link>
  )
}