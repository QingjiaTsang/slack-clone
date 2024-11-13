import { GetMessagesType } from "@/api/message";

import { useMemo } from "react";

import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import Message from "@/components/Message";

const MESSAGE_GROUPING_THRESHOLD_MINUTES = 5;

const formatDate = (date: string) => {
  if (isToday(new Date(date))) return "Today";
  if (isYesterday(new Date(date))) return "Yesterday";
  return format(new Date(date), "EEEE, MMMM d");
};

type MessageListProps = {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  messages: GetMessagesType;
  loadMore: (numItems: number) => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
};

const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant,
  messages,
  loadMore,
}: MessageListProps) => {
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
                  threadTimestamp={message.threadTimestamp}
                  isAuthor={false}
                  isEditing={false}
                  setEditing={() => {}}
                  isCompact={isCompact}
                  hideThreadButton={false}
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

export default MessageList;
