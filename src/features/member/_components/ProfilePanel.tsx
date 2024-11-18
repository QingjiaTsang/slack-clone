import { Id } from "@/convex/_generated/dataModel";

import Link from "next/link";

import { Button } from "@/components/shadcnUI/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnUI/avatar";
import { LoaderIcon, TriangleAlertIcon, XIcon, MailIcon } from "lucide-react";

import { useGetMemberWithUserInfoById } from "@/api/user";

type ProfilePanelProps = {
  memberId: Id<"members">;
  onClose: () => void;
};

const ProfilePanel = ({ memberId, onClose }: ProfilePanelProps) => {
  const { data: member, isPending: isMemberPending } =
    useGetMemberWithUserInfoById(memberId);

  if (isMemberPending) {
    return <ProfileLoading />;
  }

  if (!member) {
    return <ProfileNotFound />;
  }

  return (
    <div className="flex flex-col h-[calc(100svh-theme(spacing.16))]">
      <div className="p-2 flex justify-between items-center border-b border-b-gray-100 shadow-sm">
        <div className="px-2 font-semibold text-xl">Profile</div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="size-4 stroke-[1.5]" />
        </Button>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="mb-8 flex justify-center items-center">
          <Avatar className="max-w-64 max-h-64 size-full">
            <AvatarImage src={member.user.image} alt={member.user.name} />
            <AvatarFallback className="text-6xl aspect-square">
              {member.user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-2xl font-bold">{member.user.name}</div>

        <div className="border-b border-gray-200 my-6 -mx-6" />

        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Contact information</h2>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-slate-100">
              <MailIcon className="size-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-bold">
                Email Address
              </div>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm text-[#1264A3] hover:text-[#0B4C8C] hover:underline break-all"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;

const ProfileNotFound = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <TriangleAlertIcon className="size-6 text-destructive" />
    <div className="text-destructive text-sm font-semibold">
      Message not found
    </div>
  </div>
);

const ProfileLoading = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <LoaderIcon className="size-6 animate-spin" />
  </div>
);
