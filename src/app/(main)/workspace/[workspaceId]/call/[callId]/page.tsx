import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import { createStreamUserTokenAction } from "@/actions/calls";

import VideoCallView from "@/features/call/_components/VideoCallView";
import { MemberWithUserInfo } from "@/convex/helper";
import { TriangleAlertIcon } from "lucide-react";

type CallIdPageProps = {
  params: {
    workspaceId: Id<"workspaces">;
    callId: Id<"calls">;
  };
};

const CallIdPage = async ({ params }: CallIdPageProps) => {
  const { workspaceId, callId } = params;
  const currentUserMemberWithUserInfo = await fetchQuery(
    api.members.getCurrentUserMemberWithUserInfo,
    {
      workspaceId,
    },
    {
      token: convexAuthNextjsToken(),
    }
  );

  if (!currentUserMemberWithUserInfo || !currentUserMemberWithUserInfo.user) {
    return (
      <div className="flex items-center justify-center h-full">
        <TriangleAlertIcon className="size-10 text-destructive" />
        <div className="text-destructive text-lg font-semibold">
          Unauthorized
        </div>
      </div>
    );
  }

  const call = await fetchQuery(
    api.calls.getById,
    {
      callId,
    },
    {
      token: convexAuthNextjsToken(),
    }
  );

  if (!call) {
    return (
      <div className="flex items-center justify-center h-full">
        <TriangleAlertIcon className="size-10 text-destructive" />
        <div className="text-destructive text-lg font-semibold">
          Unauthorized
        </div>
      </div>
    );
  }

  if (call.status !== "ongoing") {
    return (
      <div className="flex items-center justify-center h-full">
        <TriangleAlertIcon className="size-10 text-destructive" />
        <div className="text-destructive text-lg font-semibold">
          Call has ended or not started yet
        </div>
      </div>
    );
  }

  const { token, clientUser } = await createStreamUserTokenAction(
    currentUserMemberWithUserInfo as MemberWithUserInfo
  );

  return (
    <div className="h-[calc(100dvh-theme(spacing.14))] flex flex-col">
      <VideoCallView
        apiKey={process.env.STREAM_API_KEY!}
        user={clientUser}
        token={token}
        callId={callId}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default CallIdPage;
