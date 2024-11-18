import { Id } from "@/convex/_generated/dataModel";
import { type GetMessagesType } from "@/api/message";

import { useMemo, useState } from "react";

import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import Message from "@/components/Message";
import { useGetCurrentUser } from "../api/user";

const MESSAGE_GROUPING_THRESHOLD_MINUTES = 5;

const formatDate = (date: string) => {
  if (isToday(new Date(date))) return "Today";
  if (isYesterday(new Date(date))) return "Yesterday";
  return format(new Date(date), "EEEE, MMMM d");
};

type MessageListProps = {
  memberName?: string;
  memberImage?: string;
  variant?: "channel" | "thread" | "conversation";
  messages: GetMessagesType;
};

const MessageList = ({
  memberName,
  memberImage,
  variant,
  messages,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const { data: currentUser } = useGetCurrentUser();

  const groupedMessages = useMemo(() => {
    return messages.reduce(
      (acc, message) => {
        if (!message) return acc;
        const date = new Date(message._creationTime);
        const dateKey = format(date, "yyyy-MM-dd");

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        acc[dateKey].unshift(message);

        return acc;
      },
      {} as Record<string, typeof messages>
    );
  }, [messages]);

  return (
    <>
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <div key={date}>
          <div className="relative text-center my-2">
            <hr className="absolute top-1/2 -translate-y-1/2 w-full -z-10" />
            <span className="px-4 py-1 rounded-full text-sm border border-gray-200 shadow-sm bg-white">
              {formatDate(date)}
            </span>
          </div>
          {messages.length > 0 &&
            messages.map((message, index) => {
              const previousMessage = messages[index - 1];
              const isCompact =
                previousMessage &&
                previousMessage.user._id === message.user._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(previousMessage._creationTime)
                ) < MESSAGE_GROUPING_THRESHOLD_MINUTES;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.member._id}
                  authorImage={message.user.image}
                  authorName={message.user.name!}
                  body={message.body}
                  image={message.image}
                  reactions={message.reactions}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadName={message.threadName}
                  threadTimestamp={message.threadTimestamp}
                  isAuthor={message.member.userId === currentUser?._id}
                  isEditing={editingId === message._id}
                  setEditing={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton={variant === "thread"}
                  createdAt={message._creationTime}
                  updateAt={message.updatedAt}
                />
              );
            })}
        </div>
      ))}
    </>
  );
};

const MessageSkeleton = () => {
  return (
    <div className="flex items-start gap-2 p-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-12 h-4" />
        </div>
        <Skeleton className="w-3/4 h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    </div>
  );
};

MessageList.Skeleton = MessageSkeleton;

export default MessageList;
