import { Id } from "@/convex/_generated/dataModel";
import { atom, useAtom } from "jotai";

const callIdAtom = atom<Id<"calls"> | null>(null);

export const useCallId = () => {
  const [callId, setCallId] = useAtom(callIdAtom);

  return {
    callId,
    setCallId,
  };
};
