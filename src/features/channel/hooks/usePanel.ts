import { Id } from "@/convex/_generated/dataModel";

import { useQueryState } from "nuqs";

const usePanel = () => {
  const [parentMessageId, setParentMessageId] =
    useQueryState("parentMessageId");

  const openPanel = async (messageId: Id<"messages">) => {
    await setParentMessageId(messageId);
  };

  const closePanel = async () => {
    await setParentMessageId(null);
  };

  return { parentMessageId, openPanel, closePanel };
};

export default usePanel;
