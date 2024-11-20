import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import DirectMessageHeader from "@/features/member/_components/DirectMessageHeader";
import DirectMessageView from "@/features/member/_components/DirectMessageView";
import ChatInput from "@/components/ChatInput";
import { TriangleAlertIcon } from "lucide-react";

type MemberIdPageProps = {
  params: {
    workspaceId: Id<"workspaces">;
    memberId: Id<"members">;
  };
};

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
  try {
    const memberWithUserInfo = await fetchQuery(
      api.members.getMemberWithUserInfoById,
      { memberId: params.memberId },
      {
        token: convexAuthNextjsToken(),
      }
    );

    const conversation = await fetchMutation(
      api.conversations.getOrCreate,
      {
        workspaceId: params.workspaceId,
        targetMemberId: params.memberId,
      },
      {
        token: convexAuthNextjsToken(),
      }
    );

    if (!memberWithUserInfo || !conversation) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <TriangleAlertIcon className="size-10 text-destructive" />
          <div className="text-destructive text-lg font-semibold">
            No member found
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-[calc(100svh-theme(spacing.16))]">
        <DirectMessageHeader memberWithUserInfo={memberWithUserInfo} />
        <DirectMessageView
          conversationId={conversation._id}
          memberWithUserInfo={memberWithUserInfo}
        />
        <ChatInput
          placeholder={`Message @${memberWithUserInfo.user.name}`}
          conversationId={conversation._id}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <TriangleAlertIcon className="size-10 text-destructive" />
        <div className="text-destructive text-lg font-semibold">
          Failed to load conversation
        </div>
        <div className="text-muted-foreground text-sm">
          {error instanceof Error ? error.message : "Please try again later"}
        </div>
      </div>
    );
  }
};

export default MemberIdPage;
