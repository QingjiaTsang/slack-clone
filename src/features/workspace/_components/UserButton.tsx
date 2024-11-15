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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGetCurrentUser } from "@/api/user";

const UserButton = () => {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

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
      <DropdownMenuTrigger>
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src={user!.image!} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          {isMobile && <span className="ml-2">{user!.name}</span>}
        </div>
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
