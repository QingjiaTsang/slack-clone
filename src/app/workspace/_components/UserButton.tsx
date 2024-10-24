"use client";

import { useAuthActions } from "@convex-dev/auth/react"

import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Loader } from 'lucide-react';
import { useMediaQuery } from "@/hooks/useMediaQuery";


const UserButton = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { signOut } = useAuthActions()

  const { data: user, isPending } = useQuery(
    convexQuery(api.users.getCurrentUser, {}),
  );

  const avatarFallback = user?.name?.[0].toUpperCase()

  if (isPending) {
    return (
      <Loader className="animate-spin text-2xl" />
    )
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <div className="flex items-center">
          <Avatar className="rounded-md">
            <AvatarImage src={user!.image!} />
            <AvatarFallback className="bg-blue-500 text-white">{avatarFallback}</AvatarFallback>
          </Avatar>
          {isMobile && <span className="ml-2">{user!.name}</span>}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton