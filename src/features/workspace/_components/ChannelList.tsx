"use client";

import { Channel, Workspace } from "@/types/docs";

import { usePathname, useRouter } from "next/navigation";

import { Skeleton } from "@/components/shadcnUI/skeleton";

import { useCreateChannelModal } from "@/stores/useCreateChannelModal";

import WorkspaceSection from "@/features/workspace/_components/WorkspaceSection";

import { cn } from "@/lib/utils";
import { useGetAllChannelsByWorkspaceId } from "@/features/workspace/api/workspace";

type ChannelListProps = {
  workspace: Workspace;
  setIsMobileSideBarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChannelList = ({
  workspace,
  setIsMobileSideBarOpen,
}: ChannelListProps) => {
  const { openModal } = useCreateChannelModal();

  const { data: channels, isPending } = useGetAllChannelsByWorkspaceId(
    workspace._id
  );

  return (
    <WorkspaceSection
      label="Channels"
      hint="Create a new channel"
      onNew={openModal}
    >
      {isPending && (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md py-0.5 px-2"
            >
              <Skeleton className="w-full h-5 bg-white/10" />
            </div>
          ))}
        </>
      )}

      {channels?.map((channel) => (
        <ChannelItem
          key={channel._id}
          channel={channel}
          workspace={workspace}
          setIsMobileSideBarOpen={setIsMobileSideBarOpen}
        />
      ))}
    </WorkspaceSection>
  );
};

export default ChannelList;

const ChannelItem = ({
  channel,
  workspace,
  setIsMobileSideBarOpen,
}: {
  channel: Channel;
  workspace: Workspace;
  setIsMobileSideBarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      onClick={() => {
        setIsMobileSideBarOpen?.(false);
        router.push(`/workspace/${workspace._id}/channel/${channel._id}`);
      }}
      className={cn(
        "flex items-center lowercase text-[#f9edffcc] gap-2 cursor-pointer hover:bg-white/10 rounded-md py-0.5 px-3",
        {
          "bg-white/85 hover:bg-white/85 text-black":
            pathname === `/workspace/${workspace._id}/channel/${channel._id}`,
        }
      )}
    >
      <div className="text-sm shrink-0">#</div>
      <div className="truncate">{channel.name}</div>
    </div>
  );
};
