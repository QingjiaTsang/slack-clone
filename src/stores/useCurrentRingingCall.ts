import { Doc } from "@/convex/_generated/dataModel";
import { atom, useAtom } from "jotai";

const currentRingingCallAtom = atom<Doc<"calls"> | null>(null);

export const useCurrentRingingCall = () => {
  const [currentRingingCall, setCurrentRingingCall] = useAtom(
    currentRingingCallAtom
  );

  return {
    currentRingingCall,
    setCurrentRingingCall,
  };
};
