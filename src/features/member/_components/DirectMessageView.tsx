"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";

import { useRef, useEffect } from "react";

import MessageList from "@/components/MessageList";

import { useGetMessages } from "@/api/message";
import { useGetCurrentUserMemberWithUserInfo } from "@/api/user";

import MessagesInfiniteScrollLoader from "@/components/MessagesInfiniteScrollLoader";
import DirectMessageHero from "@/features/member/_components/DirectMessageHero";

import { PhoneOutgoing } from "lucide-react";
import { Button } from "@/components/shadcnUI/button";

type DirectMessageViewProps = {
  conversationId: Id<"conversations">;
  memberWithUserInfo: Doc<"members"> & { user: Doc<"users"> };
};

const DirectMessageView = ({
  conversationId,
  memberWithUserInfo,
}: DirectMessageViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string | null>(null);
  const shouldScrollRef = useRef(true);

  const {
    results: messages,
    status,
    loadMore,
  } = useGetMessages({
    conversationId,
  });

  const { data: currentUserMember, isPending: isCurrentUserPending } =
    useGetCurrentUserMemberWithUserInfo(memberWithUserInfo.workspaceId);

  const isCurrentUser =
    memberWithUserInfo.user.name === currentUserMember?.user?.name;

  // handle scroll behavior when new messages are loaded
  useEffect(() => {
    if (!messages.length || !containerRef.current) {
      return;
    }

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

  if (status === "LoadingFirstPage" || isCurrentUserPending) {
    return (
      <div className="flex flex-col-reverse flex-1 overflow-y-auto mb-2">
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <MessageList.Skeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col-reverse flex-1 overflow-y-auto mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full"
    >
      <MessageList variant="channel" messages={messages} />
      <MessagesInfiniteScrollLoader status={status} onLoadMore={loadMore} />
      <DirectMessageHero
        memberWithUserInfo={memberWithUserInfo}
        isCurrentUser={isCurrentUser}
      />
    </div>
  );
};

export default DirectMessageView;
