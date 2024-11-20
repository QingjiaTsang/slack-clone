import { Doc, Id } from "@/convex/_generated/dataModel";

import Link from "next/link";

import { Button } from "@/components/shadcnUI/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnUI/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import { Skeleton } from "@/components/shadcnUI/skeleton";

import {
  TriangleAlertIcon,
  XIcon,
  MailIcon,
  ChevronDownIcon,
  UserRoundXIcon,
  UserRoundCog,
  LogOutIcon,
} from "lucide-react";

import { toast } from "sonner";

import usePanel from "@/hooks/usePanel";
import useConfirm from "@/hooks/useConfirm";

import {
  useGetCurrentUserMemberWithUserInfo,
  useGetMemberWithUserInfoById,
} from "@/api/user";
import {
  useDeleteMemberById,
  useUpdateMemberRoleById,
} from "@/features/member/api/member";

type ProfilePanelProps = {
  workspaceId: Id<"workspaces">;
  memberId: Id<"members">;
  onClose: () => void;
};

const ProfilePanel = ({
  workspaceId,
  memberId,
  onClose,
}: ProfilePanelProps) => {
  const { closePanel } = usePanel();

  const { data: member, isPending: isMemberPending } =
    useGetMemberWithUserInfoById(memberId);

  const { mutate: updateMemberRole, isPending: isUpdateMemberRolePending } =
    useUpdateMemberRoleById();
  const { mutate: deleteMember, isPending: isDeleteMemberPending } =
    useDeleteMemberById();
  const { data: currentUserMember, isPending: isCurrentUserPending } =
    useGetCurrentUserMemberWithUserInfo(workspaceId);

  const [LeaveWorkspaceConfirmDialog, confirmLeaveWorkspace] = useConfirm({
    title: "Leave Workspace",
    message: "Are you sure you want to leave this workspace?",
  }) as [React.FC, () => Promise<boolean>];

  const [UpdateMemberRoleConfirmDialog, confirmUpdateMemberRole] = useConfirm({
    title: "Update Member Role",
    message: "Are you sure you want to update this member's role?",
  }) as [React.FC, () => Promise<boolean>];

  const [RemoveMemberConfirmDialog, confirmRemoveMember] = useConfirm({
    title: "Remove Member",
    message: "Are you sure you want to remove this member?",
  }) as [React.FC, () => Promise<boolean>];

  if (isMemberPending || isCurrentUserPending) {
    return <ProfileLoading />;
  }

  if (!member) {
    return <ProfileNotFound />;
  }

  const handleLeave = async () => {
    const confirmed = await confirmLeaveWorkspace();
    if (!confirmed) {
      return;
    }

    deleteMember(
      { id: memberId },
      {
        onSuccess: async () => {
          await closePanel();
          toast.success("You have left the workspace");
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  const handleUpdateMemberRole = async (role: Doc<"members">["role"]) => {
    if (role === member.role) {
      return;
    }

    const confirmed = await confirmUpdateMemberRole();
    if (!confirmed) {
      return;
    }

    updateMemberRole(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Member role updated");
        },
        onError: () => {
          toast.error("Failed to update member role");
        },
      }
    );
  };

  const handleRemoveMember = async () => {
    const confirmed = await confirmRemoveMember();
    if (!confirmed) {
      return;
    }

    deleteMember(
      { id: memberId },
      {
        onSuccess: async () => {
          await closePanel();
          toast.success("Member removed");
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  const isCurrentUser = member.userId === currentUserMember?.userId;
  const isCurrentUserAdmin = currentUserMember?.role === "admin";
  const isMemberAdmin = member.role === "admin";

  const isUpdating = isUpdateMemberRolePending || isDeleteMemberPending;

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
            <AvatarImage
              src={member?.user?.image ?? ""}
              alt={member?.user?.name ?? ""}
            />
            <AvatarFallback className="text-6xl aspect-square">
              {member?.user?.name?.[0]?.toUpperCase() ?? ""}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-2xl font-bold">{member?.user?.name ?? ""}</div>

        {/* admin does something to other member */}
        {isCurrentUserAdmin && !isCurrentUser && (
          <div className="mt-2 flex items-center gap-3 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full gap-1 capitalize"
                  disabled={isUpdating}
                >
                  <UserRoundCog className="size-4" />
                  {member.role}
                  <ChevronDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={member.role}
                  onValueChange={(value) => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    handleUpdateMemberRole(value as Doc<"members">["role"]);
                  }}
                >
                  <DropdownMenuRadioItem value="member">
                    Member
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="admin">
                    Admin
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              onClick={handleRemoveMember}
              disabled={isUpdating}
              className="w-full gap-1"
            >
              <UserRoundXIcon className="size-4" />
              Remove
            </Button>
          </div>
        )}
        {/* ordinary member self leaves */}
        {isCurrentUser && !isMemberAdmin && (
          <Button
            variant="outline"
            onClick={handleLeave}
            disabled={isUpdating}
            className="mt-1 w-full gap-1"
          >
            <LogOutIcon className="size-4 rotate-180" />
            Leave
          </Button>
        )}

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
      <LeaveWorkspaceConfirmDialog />
      <UpdateMemberRoleConfirmDialog />
      <RemoveMemberConfirmDialog />
    </div>
  );
};

export default ProfilePanel;

const ProfileNotFound = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <TriangleAlertIcon className="size-6 text-destructive" />
    <div className="text-destructive text-sm font-semibold">
      Member not found
    </div>
  </div>
);

const ProfileLoading = () => (
  <div className="flex flex-col h-[calc(100svh-theme(spacing.16))]">
    <div className="p-2 flex justify-between items-center border-b border-b-gray-100 shadow-sm">
      <div className="px-2 font-semibold text-xl">Profile</div>
    </div>

    <div className="flex flex-col flex-1 p-6">
      <div className="mb-8 flex justify-center items-center">
        <Skeleton className="size-64 rounded-lg" />
      </div>

      <Skeleton className="h-8 w-48 mb-6" />

      <div className="border-b border-gray-200 my-6 -mx-6" />

      <div className="space-y-4">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
