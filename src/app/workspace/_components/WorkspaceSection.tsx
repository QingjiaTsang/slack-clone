"use client"

import { RiArrowRightSFill } from "react-icons/ri";
import { PlusIcon } from "lucide-react";

import Hint from "@/components/Hint";

import { useToggle } from "react-use";

import { cn } from "@/lib/utils";

type WorkspaceSectionProps = {
  label: string;
  hint: string;
  onNew?: () => void;
  children: React.ReactNode;
}

const WorkspaceSection = ({ label, hint, onNew, children }: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(false);

  return (
    <div className="flex flex-col gap-0.5 mt-3 px-2">
      <div className="w-full flex items-center justify-between group">
        <Hint description={hint} align="start">
          <div
            onClick={toggle}
            className="flex items-center gap-2 text-[#f9edffcc] cursor-pointer capitalize"
          >
            <RiArrowRightSFill className={cn("size-5 shrink-0", { "rotate-90": on })} />
            <div>{label}</div>
          </div>
        </Hint>

        <Hint description={`new ${label.toLowerCase()}`}>
          <PlusIcon
            onClick={onNew}
            className={cn("size-4 text-[#f9edffcc] cursor-pointer shrink-0 hidden", { "group-hover:block": !!onNew })}
          />
        </Hint>
      </div>

      <div className={cn('flex flex-col gap-0.5', { "hidden": !on })}>
        {children}
      </div>
    </div>
  )
}

export default WorkspaceSection