import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  MessageSquareIcon,
  BellIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNavBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      icon: HomeIcon,
      label: "Home",
      href: "/workspace",
      isActive: pathname.startsWith("/workspace"),
    },
    {
      icon: MessageSquareIcon,
      label: "DMs",
      href: "/dm",
      isActive: pathname === "/dm",
    },
    {
      icon: BellIcon,
      label: "Activity",
      href: "/activities",
      isActive: pathname === "/activities",
    },
    {
      icon: MoreHorizontalIcon,
      label: "More",
      href: "/more",
      isActive: pathname === "/more",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex-1 flex flex-col items-center py-2 px-3"
          >
            <div
              className={cn(
                "flex flex-col items-center",
                item.isActive ? "text-[#611f69]" : "text-gray-500"
              )}
            >
              <item.icon
                className={cn("size-6 mb-1", item.isActive && "text-[#611f69]")}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavBar;
