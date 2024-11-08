"use client"

import { useRef } from "react"

import ReactQuill from "react-quill"

import Editor from "@/components/Editor"

type ChatInputProps = {
  placeholder: string
}
const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<ReactQuill>(null)

  const handleSubmit = (data: { body: string, image: File | null }) => {
    console.log({ data })
  }

  return (
    <div className="px-5 w-full">
      <Editor
        innerRef={editorRef}
        // variant="update"
        defaultValue={""}
        disabled={false}
        placeholder={placeholder}
        onCancel={() => { }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default ChatInput