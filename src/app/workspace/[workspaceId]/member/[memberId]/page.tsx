import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";

import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import DirectMessageHeader from "@/features/member/_components/DirectMessageHeader";
import DirectMessageView from "@/features/member/_components/DirectMessageView";
import ChatInput from "@/components/ChatInput";

type MemberIdPageProps = {
  params: {
    workspaceId: Id<"workspaces">;
    memberId: Id<"members">;
  };
};

const MemberIdPage = async ({ params }: MemberIdPageProps) => {
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
    return null;
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
};

export default MemberIdPage;
