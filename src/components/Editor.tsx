"use client";

import type ReactQuill from "react-quill";

import {
  useRef,
  MutableRefObject,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import Image from "next/image";

import { Button } from "@/components/shadcnUI/button";

import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, SmileIcon, XIcon } from "lucide-react";
import Hint from "@/components/Hint";
import EmojiPopover from "@/components/EmojiPopover";
import { cn } from "@/lib/utils";

import ReactQuillBase from "@/components/ReactQuillBase";

type EditorSubmitData = {
  image: File | null;
  body: string;
};
type EditorProps = {
  variant?: "create" | "update";
  placeholder?: string;
  defaultValue?: ReactQuill.Value;
  disabled?: boolean;
  quillRef: MutableRefObject<ReactQuill | null>;
  onCancel?: () => void;
  onSubmit: (data: EditorSubmitData) => void;
};

const Editor = ({
  quillRef,
  onCancel,
  onSubmit,
  variant = "create",
  placeholder = "Write messages here",
  defaultValue = "",
  disabled = false,
}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEmptyRef = useRef(true);

  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [text, setText] = useState("");

  const toggleToolbar = () => {
    const toolbar = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbar) {
      if (isToolbarVisible) {
        toolbar.classList.add("hidden");
      } else {
        toolbar.classList.remove("hidden");
      }
      setIsToolbarVisible(!isToolbarVisible);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const selection = editor.getSelection();
      const position = selection ? selection.index : editor.getLength();
      editor.insertText(position, emoji);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setUploadedImageUrl("");
    imageInputRef.current!.value = "";
  };

  // it can't turn the react-quill to be controlled which will cause buggy re-render
  // so update the text state, everytime the editor text changes
  const handleChange = useCallback((content: string) => {
    setText(content);
  }, []);

  const isEmpty = useMemo(() => {
    const cleanText = text
      .replace(
        /(\s|&nbsp;|&emsp;|&ensp;|&thinsp;|&#8203;|&#8204;|&#8205;|\u200B|\n|\r|\t)+/g,
        ""
      )
      .trim();
    return !uploadedImageUrl && cleanText.length === 0;
  }, [uploadedImageUrl, text]);

  const handleSubmit = useCallback(() => {
    if (isEmptyRef.current) {
      return;
    }

    onSubmit({
      body: JSON.stringify(quillRef.current?.getEditor().getContents()),
      image: imageInputRef.current?.files?.[0] || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep modules as a constant to prevent re-render of react-quill
  const modules = useMemo(() => {
    return {
      keyboard: {
        bindings: {
          enter: {
            key: "Enter",
            handler: () => {
              handleSubmit();
            },
          },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // prevent re-render of react-quill by using ref
  useEffect(() => {
    isEmptyRef.current = isEmpty;
  }, [isEmpty]);

  // when the editor is mounted, autofocus on it
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new MutationObserver(() => {
      const hasEditor = containerRef.current?.querySelector(".ql-editor");
      if (hasEditor) {
        setIsEditorReady(true);
        quillRef.current?.focus();
        observer.disconnect();
      }
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    });

    const existingEditor = containerRef.current.querySelector(".ql-editor");
    if (existingEditor) {
      setIsEditorReady(true);
      quillRef.current?.focus();
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  return (
    <div className="flex flex-col editor-container">
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <div
        className={cn(
          "flex flex-col rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
          { "border border-slate-200": isEditorReady }
        )}
      >
        <div ref={containerRef}>
          <ReactQuillBase
            forwardedRef={quillRef}
            modules={modules}
            theme="snow"
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={handleChange}
            className="h-full"
          />

          {!!uploadedImageUrl && (
            <div className="p-2">
              <div className="relative size-[62px] flex justify-center items-center group/image">
                <Hint description="Remove image">
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 size-6 bg-black/70 hover:bg-black text-white rounded-full md:hidden flex md:group-hover/image:flex items-center justify-center z-10"
                  >
                    <XIcon className="size-4" />
                  </button>
                </Hint>
                <Image
                  src={uploadedImageUrl}
                  alt="uploaded image"
                  fill
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          {isEditorReady && (
            <div className="flex px-2 pb-2 z-[5]">
              <Hint
                description={
                  isToolbarVisible ? "Hide formatting" : "Show formatting"
                }
              >
                <Button
                  disabled={disabled}
                  size={"iconSm"}
                  variant={"ghost"}
                  onClick={toggleToolbar}
                >
                  <PiTextAa className="size-4" />
                </Button>
              </Hint>
              <EmojiPopover hint="Emoji" onSelect={handleEmojiSelect}>
                <Button disabled={disabled} size={"iconSm"} variant={"ghost"}>
                  <SmileIcon className="size-4" />
                </Button>
              </EmojiPopover>
              {variant === "create" && (
                <Hint description="Image">
                  <Button
                    disabled={disabled}
                    size={"iconSm"}
                    variant={"ghost"}
                    onClick={() => {
                      imageInputRef.current?.click();
                    }}
                  >
                    <ImageIcon className="size-4" />
                  </Button>
                </Hint>
              )}

              {variant === "update" && (
                <div className="ml-auto flex items-center gap-x-2">
                  <Button size={"sm"} variant={"outline"} onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    disabled={disabled || isEmpty}
                    size={"sm"}
                    onClick={handleSubmit}
                    className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                  >
                    Save
                  </Button>
                </div>
              )}

              {variant === "create" && (
                <Button
                  disabled={disabled || isEmpty}
                  size={"iconSm"}
                  variant={"ghost"}
                  onClick={handleSubmit}
                  className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                >
                  <MdSend className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {isEditorReady && variant === "create" && (
        <div
          className={cn(
            "flex justify-end p-2 text-[10px] text-muted-foreground opacity-0 transition",
            {
              "opacity-100": !isEmpty,
            }
          )}
        >
          <p>
            <strong>Shift + Enter</strong> to add a line
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
