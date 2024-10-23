import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useMediaQuery } from '@/hooks/useMediaQuery';

type SideBarButtonsProps = {
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick?: () => void
}

const SideBarButton = ({ icon: Icon, label, isActive, onClick }: SideBarButtonsProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div
      className={cn('flex items-center group cursor-pointer', { 'w-full p-2': isMobile, 'flex-col': !isMobile })}
      onClick={onClick}
    >
      <Button
        variant="ghost"
        size={isMobile ? "sm" : "icon"}
        className={cn(
          "font-medium group-hover:bg-accent/20",
          { "bg-accent/20": isActive },
          { "w-full justify-start text-black": isMobile },
          { "text-white": !isMobile }
        )}
      >
        <Icon className={cn('size-5 shrink-0 group-hover:scale-110 transition-all duration-300', { 'mr-2': isMobile })} />
        {isMobile && <span>{label}</span>}
      </Button>
      {!isMobile && <span className="text-sm mt-1 text-white">{label}</span>}
    </div>
  )
}

export default SideBarButton
