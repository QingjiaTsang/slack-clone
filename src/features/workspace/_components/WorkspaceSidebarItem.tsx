import { Workspace } from "@/types/docs"

import Link from "next/link"

import { cva, type VariantProps } from "class-variance-authority"

import { Button } from "@/components/shadcnUI/button"

import { LucideIcon } from "lucide-react"

const buttonVariants = cva(
  "flex justify-start items-center gap-1.5 font-normal h-7 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type WorkspaceSidebarItemProps = {
  id: string
  label: string
  icon: LucideIcon
  workspace: Workspace
  variant?: VariantProps<typeof buttonVariants>["variant"]
}

const WorkspaceSidebarItem = ({ id, label, icon: Icon, workspace, variant }: WorkspaceSidebarItemProps) => {
  return (
    <Button variant="transparent" size="sm" className={buttonVariants({ variant })}>
      <Link href={`/workspace/${workspace._id}/channel/${id}`} className="flex items-center gap-2 w-full">
        <Icon className="size-3.5 shrink-0" />
        <span className="text-sm truncate flex-1 text-left">{label}</span>
      </Link>
    </Button>
  )
}

export default WorkspaceSidebarItem