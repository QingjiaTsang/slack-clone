"use client";

import { Id } from "@/convex/_generated/dataModel";

import { useRef, useEffect } from "react";

import MessageList from "@/components/MessageList";

import { useGetMessages } from "@/api/message";
import { Channel } from "@/types/docs";
import ChannelHero from "@/components/ChannelHero";
import { Skeleton } from "@/components/shadcnUI/skeleton";

type ChannelMessageViewProps = {
  workspaceId: Id<"workspaces">;
  channel: Channel;
};

const ChannelMessageView = ({
  workspaceId,
  channel,
}: ChannelMessageViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const shouldScrollRef = useRef(true);

  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({
    workspaceId,
    channelId: channel._id,
  });

  // handle scroll behavior when messages update
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
            <MessageSkeleton key={index} />
          ))}
        </div>
        <ChannelHeroSkeleton />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col-reverse flex-1 overflow-y-auto mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full"
    >
      <MessageList
        channelName={channel?.name}
        channelCreationTime={channel?._creationTime}
        variant="channel"
        messages={messages}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChannelHero
        channelName={channel?.name}
        createdAt={channel?._creationTime}
      />
    </div>
  );
};

export default ChannelMessageView;

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

const ChannelHeroSkeleton = () => {
  return (
    <div className="mt-20 mx-5 mb-4 p-8 rounded-lg">
      <Skeleton className="w-48 h-8 mb-2" />
      <Skeleton className="w-96 h-4" />
    </div>
  );
};
