import { Phone, PhoneOff } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcnUI/tooltip";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/shadcnUI/credenza";
import { Button } from "@/components/shadcnUI/button";
import { useUpdateCallStatus } from "@/api/call";
import { Doc } from "@/convex/_generated/dataModel";

type RingingCallFloatingEntryProps = {
  currentRingingCall: Doc<"calls"> | null;
  isCreator: boolean;
  setIsRingingCallModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RingingCallFloatingEntry = ({
  currentRingingCall,
  isCreator,
  setIsRingingCallModalOpen,
}: RingingCallFloatingEntryProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { mutateAsync: updateCallStatus } = useUpdateCallStatus();

  const handleCancelCall = async () => {
    if (!currentRingingCall) {
      return;
    }

    try {
      await updateCallStatus({
        callId: currentRingingCall._id,
        status: "cancelled",
        endAt: Date.now(),
      });
      setShowDialog(false);
    } catch (error) {
      console.error("Failed to cancel call:", error);
    }
  };

  useEffect(() => {
    const isRinging =
      !!currentRingingCall && currentRingingCall.status === "ringing";

    setIsVisible(isRinging);

    if (!currentRingingCall || currentRingingCall.status === "missed") {
      setShowDialog(false);
    }
  }, [currentRingingCall]);

  return (
    <>
      <div
        className={cn(
          "fixed top-1/2 -translate-y-1/2 right-8 z-50",
          "transition-all duration-500 ease-out",
          isVisible
            ? "opacity-100 translate-x-0 pointer-events-auto visible"
            : "opacity-0 translate-x-12 pointer-events-none invisible"
        )}
      >
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <div
                className="relative cursor-pointer"
                onClick={() =>
                  isCreator
                    ? setShowDialog(true)
                    : setIsRingingCallModalOpen(true)
                }
              >
                {/* Outer ripple */}
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />

                {/* Inner ripple */}
                <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-pulse" />

                {/* Main button */}
                <div
                  className="relative p-5 rounded-full shadow-lg transition-all duration-300
                              bg-gradient-to-br from-emerald-400 to-emerald-500
                              hover:from-emerald-500 hover:to-emerald-600
                              hover:shadow-emerald-500/25 hover:shadow-xl
                              active:scale-95"
                >
                  <Phone className="size-7 text-white stroke-[1.5]" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-white/90 backdrop-blur-sm text-gray-700 border-gray-100/50"
            >
              <p className="font-medium">
                {isCreator ? "Click to cancel call" : "Incoming Video Call"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Cancel Call Dialog */}
      <Credenza open={showDialog} onOpenChange={setShowDialog}>
        <CredenzaContent className="sm:max-w-md">
          <CredenzaHeader>
            <CredenzaTitle>Cancel Outgoing Call</CredenzaTitle>
            <CredenzaDescription>
              Are you sure you want to cancel this call?
            </CredenzaDescription>
          </CredenzaHeader>

          <CredenzaFooter className="flex gap-2 justify-center">
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancelCall}
              className="gap-2"
            >
              <PhoneOff className="size-4" />
              Cancel Call
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Keep Waiting
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
};

export default RingingCallFloatingEntry;
