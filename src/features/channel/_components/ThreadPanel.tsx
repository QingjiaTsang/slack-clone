import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { useRef, useState } from "react";

import { useParams } from "next/navigation";

import { Button } from "@/components/shadcnUI/button";

import { TriangleAlertIcon, XIcon } from "lucide-react";

import { useMutation } from "convex/react";
import { useCreateMessage, useGetMessage } from "@/api/message";
import Editor, { EditorSubmitData } from "@/components/Editor";
import ReactQuill from "react-quill";

import { toast } from "sonner";
import ThreadMessagesView from "@/features/channel/_components/ThreadMessagesView";

type ThreadPanelProps = {
  messageId: Id<"messages">;
  onClose: () => void;
};

const ThreadPanel = ({ messageId, onClose }: ThreadPanelProps) => {
  const { channelId, workspaceId } = useParams();

  const { data: message, isPending: isLoadingMessage } = useGetMessage({
    messageId,
  });

  const { mutate } = useCreateMessage();

  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const [rerenderFlag, setRerenderFlag] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef<ReactQuill>(null);

  const handleSubmit = async (data: EditorSubmitData) => {
    const editor = editorRef.current?.getEditor();
    try {
      editor?.enable(false);
      setIsSubmitting(true);
      const postUrl = await generateUploadUrl();

      let storageId;

      if (data.image instanceof File) {
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": data.image!.type },
          body: data.image,
        });
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        const res = await result.json();
        storageId = res.storageId;
      }

      await mutate({
        body: data.body,
        ...(storageId && { image: storageId }),
        workspaceId: workspaceId as Id<"workspaces">,
        parentMessageId: messageId,
        ...(channelId && { channelId: channelId as Id<"channels"> }),
      });

      setRerenderFlag((prev) => prev + 1);

      const messageContainer = document.querySelector(".scrollbar-thin");
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    } catch (_error) {
      console.log({ _error });
      toast.error("Failed to send message");
    } finally {
      editor?.enable(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100svh-theme(spacing.16))]">
      <div className="p-2 flex justify-between items-center border-b border-b-gray-100 shadow-sm">
        <div className="px-2 font-semibold text-xl">Thread</div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <XIcon className="size-4 stroke-[1.5]" />
        </Button>
      </div>
      {!isLoadingMessage && !message && <MessageNotFound />}
      {!isLoadingMessage && message && (
        <>
          <ThreadMessagesView
            channelId={channelId as Id<"channels">}
            message={message}
          />
          <div className="px-2 editor-container">
            <Editor
              key={rerenderFlag}
              quillRef={editorRef}
              variant="create"
              disabled={isSubmitting}
              placeholder="Send a reply"
              onSubmit={handleSubmit}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ThreadPanel;

const MessageNotFound = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <TriangleAlertIcon className="size-6 text-destructive" />
    <div className="text-destructive text-sm font-semibold">
      Message not found
    </div>
  </div>
);
