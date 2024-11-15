import { Id } from "@/convex/_generated/dataModel";

import { useQueryState } from "nuqs";

const usePanel = () => {
  const [parentMessageId, setParentMessageId] =
    useQueryState("parentMessageId");

  const openMessagePanel = async (messageId: Id<"messages">) => {
    await setParentMessageId(messageId);
  };

  const closeMessagePanel = async () => {
    await setParentMessageId(null);
  };

  return {
    parentMessageId,
    openMessagePanel,
    closeMessagePanel,
  };
};

export default usePanel;
