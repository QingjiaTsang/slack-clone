'use client'

import { useState } from "react";

import SearchInput from "@/features/workspace/_components/SearchInput"

import { CircleAlert } from 'lucide-react';

import { Button } from "@/components/shadcnUI/button";


const HeaderNavBar = () => {
  const [search, setSearch] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-[#481349] text-white px-4">
      <div className="w-10" />
      <SearchInput />
      <Button variant="transparent" size="icon">
        <CircleAlert className="size-5" />
      </Button>
    </nav>
  )
}

export default HeaderNavBar