import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcnUI/avatar";
import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ThreadBarProps {
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
  onClick?: () => void;
}

const ThreadBar = ({
  threadCount = 0,
  threadImage,
  threadName,
  threadTimestamp,
  onClick,
}: ThreadBarProps) => {
  if (threadCount === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 mt-1 py-1 px-1 -ml-1 text-xs group/thread-bar",
        "text-muted-foreground rounded-md",
        "border border-transparent",
        "hover:bg-white hover:shadow-sm hover:border-gray-300/70",
        "transition-all duration-200"
      )}
    >
      <div className="shrink-0 flex items-center gap-1.5">
        <Avatar className="h-5 w-5">
          <AvatarImage src={threadImage} />
          <AvatarFallback className="text-xs">
            {threadName?.[0] ?? "M"}
          </AvatarFallback>
        </Avatar>
        <span className="font-bold text-sky-700 hover:underline">
          {`${threadCount} ${threadCount === 1 ? "reply" : "replies"}`}
        </span>
      </div>
      {threadTimestamp && (
        <div className="opacity-70 relative overflow-hidden">
          <div className="group-hover/thread-bar:opacity-0 transition-opacity truncate">
            {`Last reply ${formatDistanceToNow(threadTimestamp, { addSuffix: true })}`}
          </div>
          <div className="absolute left-0 top-0 opacity-0 group-hover/thread-bar:opacity-100 transition-opacity">
            View thread
          </div>
          <ChevronRight className="size-4 absolute top-0 right-0 opacity-0 group-hover/thread-bar:opacity-100 transition-opacity" />
        </div>
      )}
    </button>
  );
};

export default ThreadBar;
