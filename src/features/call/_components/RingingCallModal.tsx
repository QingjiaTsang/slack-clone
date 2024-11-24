import { Doc } from "@/convex/_generated/dataModel";

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
import { useUpdateCallStatus } from "@/api/call";
import { toast } from "sonner";

type RingingCallModalProps = {
  ringingCall: Doc<"calls"> | null | undefined;
  isRingingCallModalOpen: boolean;
  setIsRingingCallModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RingingCallModal = ({
  ringingCall,
  isRingingCallModalOpen,
  setIsRingingCallModalOpen,
}: RingingCallModalProps) => {
  const router = useRouter();

  const { mutate: updateCallStatus, isPending: isUpdatingCallStatus } =
    useUpdateCallStatus();

  const isCallValid = (
    call: Doc<"calls"> | null | undefined
  ): call is Doc<"calls"> => {
    return !!call && call.ringTimeout > Date.now();
  };

  const handleAccept = () => {
    if (isUpdatingCallStatus || !isCallValid(ringingCall)) {
      return;
    }

    updateCallStatus(
      {
        callId: ringingCall._id,
        status: "ongoing",
      },
      {
        onSuccess: () => {
          router.push(
            `/workspace/${ringingCall.workspaceId}/call/${ringingCall._id}`
          );
        },
        onError: () => {
          toast.error("Something went wrong while accepting call");
        },
      }
    );
  };

  const handleReject = () => {
    if (isUpdatingCallStatus || !ringingCall) {
      return;
    }

    updateCallStatus({ callId: ringingCall._id, status: "rejected" });
  };

  return (
    <Dialog
      open={isRingingCallModalOpen}
      onOpenChange={setIsRingingCallModalOpen}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Incoming Call</DialogTitle>
          <DialogDescription>
            {ringingCall?.creatorName} is calling you
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-6 pt-4">
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
