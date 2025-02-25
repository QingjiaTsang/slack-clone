"use client";

import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/shadcnUI/button";
import { useUpdateCallStatus } from "@/api/call";
import { Id } from "@/convex/_generated/dataModel";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();
  const { mutate: updateCallStatus } = useUpdateCallStatus();
  const params = new URLSearchParams(window.location.search);
  const callId = params.get("callId");
  const workspaceId = params.get("workspaceId");

  useEffect(() => {
    toast.error("Failed to join call, please try again");
    console.error("Call error:", error);

    // update call status from ongoing to ended
    if (callId) {
      updateCallStatus({
        callId: callId as Id<"calls">,
        status: "ended",
        endAt: Date.now(),
      });
    }
  }, [error, callId, updateCallStatus]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-theme(spacing.14))]">
      <TriangleAlertIcon className="size-16 text-destructive mb-6" />
      <h2 className="text-xl font-semibold mb-2">Call connection failed</h2>
      <p className="text-muted-foreground mb-6">
        Connection timeout, please check your network and try again
      </p>
      <Button
        variant="outline"
        onClick={() => router.push(`/workspace/${workspaceId}`)}
      >
        Back to workspace
      </Button>
    </div>
  );
}
