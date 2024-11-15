import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { useRef, useState } from "react";

import { useParams } from "next/navigation";

import { Button } from "@/components/shadcnUI/button";

import { LoaderIcon, TriangleAlertIcon, XIcon } from "lucide-react";

import { useMutation } from "convex/react";
import { useCreateMessage, useGetMessage } from "@/api/message";
import Editor, { EditorSubmitData } from "@/components/Editor";
import ReactQuill from "react-quill";

import { toast } from "sonner";
import ThreadMessagesView from "@/features/channel/_components/ThreadMessagesView";

type ThreadProps = {
  messageId: Id<"messages">;
  closeMessagePanel: () => void;
};

const Thread = ({ messageId, closeMessagePanel }: ThreadProps) => {
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
        parentMessageId: messageId,
        channelId: channelId as Id<"channels">,
        workspaceId: workspaceId as Id<"workspaces">,
      });

      toast.success("Reply sent");
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
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="p-2 flex justify-between items-center border-b border-b-gray-100 shadow-sm">
        <div className="px-2 font-semibold text-xl">Thread</div>
        <Button variant="text" size="icon" onClick={closeMessagePanel}>
          <XIcon className="size-4 stroke-[1.5]" />
        </Button>
      </div>
      {isLoadingMessage && <MessageLoading />}
      {!isLoadingMessage && !message && <MessageNotFound />}
      {!isLoadingMessage && message && (
        <>
          <ThreadMessagesView
            workspaceId={workspaceId as Id<"workspaces">}
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

export default Thread;

const MessageNotFound = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <TriangleAlertIcon className="size-6 text-destructive" />
    <div className="text-destructive text-sm font-semibold">
      Message not found
    </div>
  </div>
);

const MessageLoading = () => (
  <div className="flex justify-center items-center h-full">
    <LoaderIcon className="size-4 animate-spin" />
  </div>
);