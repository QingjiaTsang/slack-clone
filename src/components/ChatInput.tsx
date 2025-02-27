"use client";

import { Id } from "@/convex/_generated/dataModel";
import { type EditorSubmitData } from "@/components/Editor";

import { useRef, useState } from "react";

import { useParams } from "next/navigation";

import ReactQuill from "react-quill";

import { useCreateMessage } from "@/api/message";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import Editor from "@/components/Editor";

type ChatInputProps = {
  placeholder: string;
  conversationId?: Id<"conversations">;
};
const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const { channelId, workspaceId } = useParams();

  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const { mutateAsync } = useCreateMessage();

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

      await mutateAsync({
        body: data.body,
        ...(storageId && { image: storageId }),
        ...(channelId && { channelId: channelId as Id<"channels"> }),
        ...(workspaceId && { workspaceId: workspaceId as Id<"workspaces"> }),
        ...(conversationId && { conversationId }),
      });

      // toast.success("Message sent");
      setRerenderFlag((prev) => prev + 1);

      // scroll to the bottom of the message container to show the new message
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
    <div className="w-full px-5">
      <Editor
        key={rerenderFlag}
        quillRef={editorRef}
        variant="create"
        disabled={isSubmitting}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        conversationId={conversationId}
      />
    </div>
  );
};

export default ChatInput;
