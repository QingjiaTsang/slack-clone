import { Id } from "@/convex/_generated/dataModel";

import { redirect } from "next/navigation";

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import ChannelHeader from "@/features/channel/_components/ChannelHeader";
import ChatInput from "@/components/ChatInput";
import ChannelMessageView from "@/features/channel/_components/ChannelMessageView";

type ChannelPageProps = {
  params: {
    channelId: Id<"channels">;
  };
};

const ChannelIdPage = async ({ params }: ChannelPageProps) => {
  try {
    const channel = await fetchQuery(
      api.channels.getOneById,
      { id: params.channelId },
      { token: convexAuthNextjsToken() }
    );

    if (!channel) {
      // if channel not found, redirect to the home page
      redirect("/workspace");
    }

    const currentUserRoleInfo = await fetchQuery(
      api.workspaces.getCurrentUserRoleInWorkspace,
      { id: channel?.workspaceId },
      { token: convexAuthNextjsToken() }
    );

    const isAdmin = currentUserRoleInfo?.role === "admin";

    return (
      <div className="flex flex-col h-[calc(100dvh-theme(spacing.24))] md:h-[calc(100dvh-theme(spacing.16))] overflow-hidden">
        <ChannelHeader channel={channel} isAdmin={isAdmin} />
        <ChannelMessageView channel={channel} />
        <ChatInput placeholder={`Message #${channel?.name}`} />
      </div>
    );
  } catch (_error) {
    // if user input a wrong channel id, redirect to the home page
    redirect("/workspace");
  }
};

export default ChannelIdPage;
