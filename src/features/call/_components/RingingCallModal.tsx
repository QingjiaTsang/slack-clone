import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/shadcnUI/credenza";
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
    <Credenza
      open={isRingingCallModalOpen}
      onOpenChange={setIsRingingCallModalOpen}
    >
      <CredenzaContent className="sm:max-w-md">
        <CredenzaHeader>
          <CredenzaTitle>Incoming Call</CredenzaTitle>
          <CredenzaDescription>
            {ringingCall?.creatorName} is calling you
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          <div className="flex justify-center gap-6 max-md:mb-4">
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
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default RingingCallModal;
