"use client";

import { useRouter } from "next/navigation";

import { useAuthActions } from "@convex-dev/auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcnUI/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnUI/avatar";

import { LoaderIcon } from "lucide-react";
import { useGetCurrentUser } from "@/api/user";
import { cn } from "@/lib/utils";

type UserButtonProps = {
  isMobile?: boolean;
};

const UserButton = ({ isMobile = false }: UserButtonProps) => {
  const router = useRouter();

  const { signOut } = useAuthActions();

  const { data: user, isPending } = useGetCurrentUser();

  const avatarFallback = user?.name?.[0].toUpperCase();

  if (isPending) {
    return <LoaderIcon className="animate-spin text-2xl" />;
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isMobile ? (
          <div
            className={cn(
              "flex items-center bg-white backdrop-blur rounded-md p-1 hover:bg-gray-100 shadow-sm w-full cursor-pointer transition-all"
            )}
          >
            <Avatar>
              <AvatarImage src={user!.image!} />
              <AvatarFallback className="text-xl">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <span className="ml-2">{user!.name}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src={user!.image!} />
              <AvatarFallback className="text-xl">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.refresh();
          }}
          className="cursor-pointer"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
