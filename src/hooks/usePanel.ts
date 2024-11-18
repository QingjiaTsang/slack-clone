import { Id } from "@/convex/_generated/dataModel";

import { useQueryState } from "nuqs";

const usePanel = () => {
  const [parentMessageId, setParentMessageId] =
    useQueryState("parentMessageId");

  const [profileMemberId, setProfileMemberId] =
    useQueryState("profileMemberId");

  const openMessagePanel = async (messageId: Id<"messages">) => {
    await Promise.all([
      setParentMessageId(messageId),
      setProfileMemberId(null),
    ]);
  };

  const closeMessagePanel = async () => {
    await Promise.all([setParentMessageId(null), setProfileMemberId(null)]);
  };

  const openProfilePanel = async (memberId: Id<"members">) => {
    await Promise.all([setProfileMemberId(memberId), setParentMessageId(null)]);
  };

  const closeProfilePanel = async () => {
    await Promise.all([setProfileMemberId(null), setParentMessageId(null)]);
  };

  const closePanel = async () => {
    await Promise.all([setParentMessageId(null), setProfileMemberId(null)]);
  };

  return {
    parentMessageId,
    profileMemberId,

    openMessagePanel,
    closeMessagePanel,

    openProfilePanel,
    closeProfilePanel,

    closePanel,
  };
};

export default usePanel;
