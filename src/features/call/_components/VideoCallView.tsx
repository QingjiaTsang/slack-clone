"use client";

import { Id } from "@/convex/_generated/dataModel";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  type Call,
  type User,
  StreamVideoClient,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  useCallStateHooks,
  AxiosError,
} from "@stream-io/video-react-sdk";
import { LoaderIcon } from "lucide-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { toast } from "sonner";
import { useUpdateCallStatus } from "@/api/call";

type VideoCallViewProps = {
  apiKey: string;
  user: User;
  token: string;
  callId: Id<"calls">;
  workspaceId: Id<"workspaces">;
};

const VideoCallView = ({
  apiKey,
  user,
  token,
  callId,
  workspaceId,
}: VideoCallViewProps) => {
  const router = useRouter();

  const { mutate: updateCallStatus } = useUpdateCallStatus();

  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();

  // init client
  // and check if user is already in call using localStorage
  // to prevent multiple tabs from joining the same call with multiple clients by the same user
  useEffect(() => {
    const existingCallTab = localStorage.getItem(`active-call-${callId}`);
    const currentTabId = `${Date.now()}-${Math.random()}`;

    if (existingCallTab) {
      toast.info("You are already in this call in another tab");
      router.replace(`/workspace/${workspaceId}`);
      return;
    }

    // set this tab as the active one
    localStorage.setItem(`active-call-${callId}`, currentTabId);

    const client = new StreamVideoClient({
      apiKey,
      user,
      token,
      options: {
        axiosRequestConfig: {
          // to prevent timeout error when joining call
          timeout: 20000,
        },
      },
    });

    setClient(client);

    // if either user leaves the call, set status of the call to be ended
    // and redirect to the home page with a toast notification
    client.on("call.session_participant_left", () => {
      updateCallStatus({
        callId,
        status: "ended",
        endAt: Date.now(),
      });
      toast.info("Call ended");
      router.replace(`/workspace/${workspaceId}`);
    });

    return () => {
      console.log("leaving call page and disconnecting user");
      localStorage.removeItem(`active-call-${callId}`);
      client
        .disconnectUser()
        .catch((e) => console.error("Failed to disconnect user", e));
      setClient(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, user, token, callId]);

  // call setup
  useEffect(() => {
    if (!client) {
      return;
    }

    const call = client.call("default", callId);
    setCall(call);

    // join call
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        await call.getOrCreate();
        await call.join({ create: true });
      } catch (e) {
        console.error("Failed to join call", e);
        if (e instanceof AxiosError && e.message.includes("timeout")) {
          router.refresh();
        }
      }
    })();

    // cleanup
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        try {
          await call.leave();
        } catch (e) {
          console.error("Failed to leave call:", e);
        } finally {
          setCall(undefined);
        }
      })();
    };
  }, [client, callId, router]);

  // remove active-call flag from localStorage when the tab is closed or the user navigates away
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleBeforeUnload = () => {
      localStorage.removeItem(`active-call-${callId}`);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId]);

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
};

export default VideoCallView;

export const MyUILayout = () => {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  console.log({ callingState, participantCount });

  return (
    <StreamTheme className="flex-1 relative">
      <div className="pt-16">
        <SpeakerLayout participantsBarPosition="bottom" />
      </div>
      <div className="absolute bottom-16 md:bottom-0 left-1/2 -translate-x-1/2">
        <CallControls />
      </div>
    </StreamTheme>
  );
};
