import { Doc } from "@/convex/_generated/dataModel";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnUI/dialog";
import { Button } from "@/components/shadcnUI/button";
import { Phone, PhoneOff } from "lucide-react";
import { useUpdateCallStatus } from "@/features/call/api/call";
import { toast } from "sonner";

type RingingCallModalProps = {
  ringingCall: Doc<"calls"> | null | undefined;
};

const RingingCallModal = ({ ringingCall }: RingingCallModalProps) => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // play the ringtone when the call is ringing
  useEffect(() => {
    if (ringingCall) {
      audioRef.current = new Audio("/audio/call-ringtone.mp3");
      audioRef.current.loop = true;
      audioRef.current.play().catch((error) => {
        console.error("Failed to play ringtone:", error);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [ringingCall]);

  const { mutate: updateCallStatus, isPending: isUpdatingCallStatus } =
    useUpdateCallStatus();

  const handleAccept = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (isUpdatingCallStatus) {
      return;
    }

    if (ringingCall && ringingCall.ringTimeout > Date.now()) {
      updateCallStatus(
        {
          callId: ringingCall._id,
          status: "ongoing",
        },
        {
          onSuccess: () =>
            router.push(
              `/workspace/${ringingCall.workspaceId}/call/${ringingCall._id}`
            ),
          onError: () => {
            toast.error("Something went wrong while accepting call");
          },
        }
      );
    }
  };

  const handleReject = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (isUpdatingCallStatus) {
      return;
    }

    if (ringingCall) {
      updateCallStatus({ callId: ringingCall._id, status: "rejected" });
    }
  };

  return (
    <Dialog open={!!ringingCall}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Incoming Call</DialogTitle>
          <DialogDescription>
            {ringingCall?.creatorName} is calling you
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={handleReject}
            variant="destructive"
            disabled={isUpdatingCallStatus}
            className="rounded-full w-12 h-12 p-0"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            onClick={handleAccept}
            variant="default"
            disabled={isUpdatingCallStatus}
            className="rounded-full w-12 h-12 p-0 bg-green-600 hover:bg-green-700"
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RingingCallModal;
