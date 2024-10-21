'use client'

import { useState } from "react";

import SearchInput from "@/app/workspace/_components/SearchInput"

import { CircleAlert } from 'lucide-react';

import { Button } from "@/components/ui/button";


const HeaderNavBar = () => {
  const [search, setSearch] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-[#481349] text-white px-4">
      <div className="w-6" />
      <SearchInput />
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="p-2 hover:bg-accent/10 hover:text-white cursor-pointer"
      >
        <CircleAlert />
      </Button>
    </nav>
  )
}

export default HeaderNavBar