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
};
const ChatInput = ({ placeholder }: ChatInputProps) => {
  const { channelId, workspaceId } = useParams();

  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const { mutate } = useCreateMessage();

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
        channelId: channelId as Id<"channels">,
        workspaceId: workspaceId as Id<"workspaces">,
      });

      // toast.success("Message sent");
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
    <div className="px-5 w-full">
      <Editor
        key={rerenderFlag}
        quillRef={editorRef}
        variant="create"
        disabled={isSubmitting}
        placeholder={placeholder}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatInput;
