"use client";

import { Id } from "@/convex/_generated/dataModel";

import { useEffect, useRef, useState } from "react";

import { GetMessageQueryType, useGetMessages } from "@/api/message";
import { useGetCurrentUser } from "@/api/user";

import MessagesInfiniteScrollLoader from "@/features/channel/_components/MessagesInfiniteScrollLoader";
import MessageList from "@/components/MessageList";
import Message from "@/components/Message";
import ChannelHero from "@/components/ChannelHero";

type ThreadMessagesViewProps = {
  workspaceId: Id<"workspaces">;
  channelId: Id<"channels">;
  message: NonNullable<GetMessageQueryType>;
};

const ThreadMessagesView = ({
  workspaceId,
  channelId,
  message,
}: ThreadMessagesViewProps) => {
  const { data: currentUser } = useGetCurrentUser();

  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({
    channelId: channelId as Id<"channels">,
    parentMessageId: message._id,
  });

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const shouldScrollRef = useRef(true);

  // handle scroll behavior when new messages are loaded
  useEffect(() => {
    if (!messages.length || !containerRef.current) return;

    const container = containerRef.current;
    // the first message is exactly the last messages in the array since we're using flex-col-reverse
    const lastMessage = messages[0];

    // check if it's near bottom (top in reversed layout so we scroll to the top)
    const isNearBottom = container.scrollTop <= 100;

    if (lastMessageRef.current && lastMessage._id !== lastMessageRef.current) {
      if (isNearBottom) {
        container.scrollTop = 0;
      }
    } else if (shouldScrollRef.current) {
      // initial load
      container.scrollTop = 0;
      shouldScrollRef.current = false;
    }

    lastMessageRef.current = lastMessage._id;
  }, [messages]);

  if (status === "LoadingFirstPage") {
    return (
      <div className="flex flex-col-reverse flex-1 overflow-y-auto mb-2">
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <MessageList.Skeleton key={index} />
          ))}
        </div>
        <ChannelHero.Skeleton />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col-reverse flex-1 overflow-y-auto my-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full"
    >
      <MessageList
        workspaceId={workspaceId as Id<"workspaces">}
        channelId={channelId as Id<"channels">}
        variant="thread"
        messages={messages}
      />
      <MessagesInfiniteScrollLoader status={status} onLoadMore={loadMore} />
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
        isAuthor={message.member.userId === currentUser?._id}
        isEditing={editingId === message._id}
        setEditing={setEditingId}
        isCompact={false}
        hideThreadButton={true}
        createdAt={message._creationTime}
        updateAt={message.updatedAt}
      />
    </div>
  );
};

export default ThreadMessagesView;
