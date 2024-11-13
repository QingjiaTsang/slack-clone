import Hint from "@/components/Hint";
import QuillContentsRenderer from "@/components/QuillContentsRenderer";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcnUI/avatar";
import Thumbnail from "@/components/Thumbnail";
import { Doc, Id } from "@/convex/_generated/dataModel";
import {
  formatDate,
  formatDistanceToNow,
  isToday,
  isYesterday,
} from "date-fns";

const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? "Today"
      : isYesterday(date)
        ? "Yesterday"
        : formatDate(date, "yyyy-MM-dd")
  } at ${formatDate(date, "HH:mm")}`;
};

type MessageProps = {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  body: string;
  image?: string;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  threadCount: number;
  threadImage?: string;
  threadTimestamp: number;
  isAuthor: boolean;
  isEditing: boolean;
  setEditing: () => void;
  isCompact?: boolean;
  hideThreadButton: boolean;
  createdAt: Doc<"messages">["_creationTime"];
  updateAt?: Doc<"messages">["updatedAt"];
};

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "member",
  body,
  image,
  reactions,
  threadCount,
  threadImage,
  threadTimestamp,
  isEditing,
  setEditing,
  isCompact,
  hideThreadButton,
  createdAt,
  updateAt,
}: MessageProps) => {
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-2 hover:bg-gray-100/60 group message-container">
        <div className="flex items-center pl-3 gap-2">
          <Hint description={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 text-center hover:underline">
              {formatDate(new Date(createdAt), "HH:mm")}
            </button>
          </Hint>
          <div className="flex flex-col ml-2">
            <QuillContentsRenderer contents={body} />
            {image && <Thumbnail imageUrl={image} alt="Message image" />}
            {updateAt && (
              <div className="text-xs text-muted-foreground">(edited)</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-2 p-2 hover:bg-gray-100/60 group message-container">
      <div className="flex items-start px-2">
        <button className="flex-shrink-0">
          <Avatar>
            <AvatarImage src={authorImage!} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col ml-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="text-sm text-primary font-bold hover:underline"
            >
              {authorName}
            </button>
            <Hint description={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground hover:underline">
                {formatDate(new Date(createdAt), "HH:mm")}
              </button>
            </Hint>
          </div>
          <div>
            <QuillContentsRenderer contents={body} />
            {image && <Thumbnail imageUrl={image} alt="Message image" />}
            {updateAt && (
              <div className="text-xs text-muted-foreground">(edited)</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
