import { Doc, Id } from "@/convex/_generated/dataModel";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSubscribeRingingCall } from "@/api/call";
import { useCurrentRingingCall } from "@/stores/useCurrentRingingCall";
import useRingtone from "@/hooks/useRingtone";
import { toast } from "sonner";

type CallStatusRecord = {
  [K in Doc<"calls">["status"]]?: number;
} & {
  ringTimeout?: number;
};

type UseCallManagementProps = {
  currentUserId?: Id<"users">;
  currentWorkspaceName?: Doc<"workspaces">["name"];
};

const useCallManagement = ({
  currentUserId,
  currentWorkspaceName,
}: UseCallManagementProps) => {
  const router = useRouter();

  const { data: ringingCall } = useSubscribeRingingCall();

  const { currentRingingCall, setCurrentRingingCall } = useCurrentRingingCall();

  const [isRingingCallModalOpen, setIsRingingCallModalOpen] = useState(false);

  // get the incoming call status for the recipient
  // and determine whether to show the ringing call modal
  const getIncomingCallStatus = (
    ringingCall: Doc<"calls"> | null | undefined,
    currentUserId?: Id<"users">
  ): { call: Doc<"calls"> | null; shouldShowModal: boolean } => {
    if (!ringingCall) {
      return { call: null, shouldShowModal: false };
    }

    const isIncomingCall =
      ringingCall.recipientUserId === currentUserId &&
      ringingCall.status === "ringing";

    return {
      call: isIncomingCall ? ringingCall : null,
      shouldShowModal: isIncomingCall,
    };
  };
  const { call: incomingCall, shouldShowModal } = useMemo(
    () => getIncomingCallStatus(ringingCall, currentUserId),
    [ringingCall, currentUserId]
  );
  // show or hide the ringing call modal for the recipient when the call is incoming or not
  useEffect(() => {
    setIsRingingCallModalOpen(shouldShowModal);
  }, [shouldShowModal]);

  // play the ringtone for the recipient when the call is incoming
  useRingtone(!!incomingCall);

  // track the outgoing call status to toast the creator of the call
  useEffect(() => {
    const isCallCreator = ringingCall?.creatorUserId === currentUserId;
    if (!ringingCall || !isCallCreator) {
      return;
    }

    // Using localStorage to track which call status notifications have already been shown to the user
    // This prevents duplicate notifications if the component re-renders or the user reloads the page,
    // and the call hasn't reached the ringTimeout which will cause the toast still to be shown
    const shownStatuses: CallStatusRecord = JSON.parse(
      localStorage.getItem(`call-status-${ringingCall._id}`) || "{}"
    );

    if (ringingCall.status === "ongoing" && !shownStatuses?.ongoing) {
      toast.info(
        `Call to ${ringingCall.recipientName} from ${currentWorkspaceName} is accepted`
      );
      router.push(
        `/workspace/${ringingCall.workspaceId}/call/${ringingCall._id}`
      );
    } else if (ringingCall.status === "rejected" && !shownStatuses?.rejected) {
      toast.error(
        `Call to ${ringingCall.recipientName} from ${currentWorkspaceName} is rejected`
      );
    }

    localStorage.setItem(
      `call-status-${ringingCall._id}`,
      JSON.stringify({
        ...shownStatuses,
        [ringingCall.status]: ringingCall.statusUpdatedAt,
        ringTimeout: ringingCall.ringTimeout,
      } satisfies CallStatusRecord)
    );

    // cleanup expired calls status records in localStorage
    // when the latest feedback of a call is received
    const cleanupExpiredCallStatusRecords = () => {
      const allKeys = Object.keys(localStorage);
      allKeys.forEach((key) => {
        if (key.startsWith("call-status-")) {
          const callId = key.replace("call-status-", "");
          const callStatusRecord = JSON.parse(
            localStorage.getItem(key) || "{}"
          ) as CallStatusRecord;

          if (callId !== ringingCall._id) {
            if (
              callStatusRecord.ringTimeout &&
              callStatusRecord.ringTimeout < Date.now()
            ) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    };

    cleanupExpiredCallStatusRecords();
  }, [ringingCall, currentUserId, currentWorkspaceName, router]);

  // track the ringing call to determine whether to show the ringing call floating entry in the layout
  // when the call still waiting for a feedback
  useEffect(() => {
    if (ringingCall && ringingCall.status === "ringing") {
      setCurrentRingingCall(ringingCall);
    } else {
      setCurrentRingingCall(null);
    }
  }, [ringingCall, setCurrentRingingCall]);

  return {
    incomingCall,
    isRingingCallModalOpen,
    setIsRingingCallModalOpen,
    currentRingingCall,
  };
};

export default useCallManagement;
