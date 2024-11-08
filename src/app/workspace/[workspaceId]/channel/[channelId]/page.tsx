import { Id } from "@/convex/_generated/dataModel";

import { redirect } from "next/navigation";
import { headers } from 'next/headers';

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import ChannelHeader from "@/features/channel/_components/ChannelHeader";
import ChatInput from "@/features/channel/_components/ChatInput";

type ChannelPageProps = {
  params: {
    channelId: Id<'channels'>
  }
}

const ChannelPage = async ({ params }: ChannelPageProps) => {
  const channel = await fetchQuery(
    api.channels.getOneById,
    { id: params.channelId },
    { token: convexAuthNextjsToken() }
  )

  if (!channel) {
    const headersList = headers();
    const fullUrl = headersList.get('x-url') || headersList.get('referer') || '';
    // Remove the last part of the URL after /channel/
    const workspaceUrl = fullUrl.replace(/\/channel\/[^/]+$/, '');
    redirect(workspaceUrl);
  }

  const currentUserRoleInfo = await fetchQuery(
    api.workspaces.getCurrentUserRoleInWorkspace,
    { id: channel?.workspaceId },
    { token: convexAuthNextjsToken() }
  );


  const isAdmin = currentUserRoleInfo?.role === "admin";

  return (
    <div className="flex flex-col h-full">
      <ChannelHeader channel={channel} isAdmin={isAdmin} />
      <div className="flex-1" />
      <ChatInput placeholder={`Message #${channel?.name}`} />
    </div>
  )
}

export default ChannelPage
