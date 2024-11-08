'use client'

import { useRef, MutableRefObject, LegacyRef, useEffect, useState, useMemo } from 'react'

import dynamic from 'next/dynamic'

import type ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

import { Button } from '@/components/shadcnUI/button';

import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, SmileIcon, XIcon } from 'lucide-react';
import Hint from '@/components/Hint';
import { cn } from '@/lib/utils';
import EmojiPopover from '@/features/channel/_components/EmojiPopover';
import Image from 'next/image';


interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')

    function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
      return <RQ ref={forwardedRef} {...props} />
    }

    return QuillJS
  },
  {
    ssr: false,
  },
)


type EditorSubmitData = {
  image: File | null;
  body: string;
}
type EditorProps = {
  variant?: "create" | "update";
  placeholder?: string;
  defaultValue?: ReactQuill.Value;
  disabled?: boolean;
  innerRef?: MutableRefObject<ReactQuill | null>;
  onCancel?: () => void;
  onSubmit: (data: EditorSubmitData) => void;
}


const Editor = ({
  innerRef,
  onCancel,
  onSubmit,
  variant = "create",
  placeholder = "Write messages here",
  defaultValue = "",
  disabled = false
}: EditorProps) => {
  const quillRef = useRef<ReactQuill>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [isEditorReady, setIsEditorReady] = useState(false)
  const [text, setText] = useState(defaultValue)
  const [isToolbarVisible, setIsToolbarVisible] = useState(true)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  const modules = useMemo(() => {
    return ({
      keyboard: {
        bindings: {
          enter: {
            key: 'Enter',
            handler: () => {
              if (isEmpty) {
                return
              }
              handleSubmit()
            }
          }
        },
      },
    })
  }, [])

  const isEmpty = useMemo(() => {
    if (typeof text === 'string') {
      const cleanText = text
        .replace(/<[^>]*>/g, '')
        .replace(/(\s|&nbsp;|&emsp;|&ensp;|&thinsp;|&#8203;|&#8204;|&#8205;|\u200B|\n|\r|\t)+/g, '')
        .trim();
      return !uploadedImageUrl && cleanText.length === 0;
    }
    return true;
  }, [text, uploadedImageUrl]);

  console.log({ isEmpty, text })

  const toggleToolbar = () => {
    const toolbar = containerRef.current?.querySelector('.ql-toolbar')
    if (toolbar) {
      if (isToolbarVisible) {
        toolbar.classList.add('hidden')
      } else {
        toolbar.classList.remove('hidden')
      }
      setIsToolbarVisible(!isToolbarVisible)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    const editor = quillRef.current?.getEditor()
    if (editor) {
      const selection = editor.getSelection();
      const position = selection ? selection.index : editor.getLength();
      editor.insertText(position, emoji);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImageUrl(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setUploadedImageUrl('')
    imageInputRef.current!.value = ''
  }

  const handleSubmit = () => {
    onSubmit({
      body: JSON.stringify(quillRef.current?.getEditor().getContents()),
      image: imageInputRef.current?.files?.[0] || null
    })
  }


  // when the editor is mounted, autofocus on it
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new MutationObserver(() => {
      const hasEditor = containerRef.current?.querySelector('.ql-editor')
      if (hasEditor) {
        setIsEditorReady(true)
        quillRef.current?.focus()
        observer.disconnect()
      }
    })

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true
    })

    const existingEditor = containerRef.current.querySelector('.ql-editor')
    if (existingEditor) {
      setIsEditorReady(true)
      quillRef.current?.focus()
    }

    return () => observer.disconnect()
  }, [defaultValue])

  return (
    <div className="flex flex-col">
      <input
        type="file"
        ref={imageInputRef}
        accept='image/*'
        onChange={handleImageChange}
        className='hidden'
      />
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef}>
          <ReactQuillBase
            forwardedRef={quillRef}
            modules={modules}
            theme="snow"
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={text}
            onChange={setText}
            className='h-full'
          />

          {
            !!uploadedImageUrl && (
              <div className='p-2'>
                <div className='relative size-[62px] flex justify-center items-center group/image'>
                  <Hint description='Remove image'>
                    <button
                      onClick={removeImage}
                      className='hidden absolute -top-2 -right-2 size-6 bg-black/70 hover:bg-black text-white rounded-full group-hover/image:flex items-center justify-center z-10'
                    >
                      <XIcon className='size-4' />
                    </button>
                  </Hint>
                  <Image
                    src={uploadedImageUrl}
                    alt='uploaded image'
                    fill
                    className='object-cover w-full h-full'
                  />
                </div>
              </div>
            )
          }

          {
            isEditorReady &&
            <div className='flex px-2 pb-2 z-[5]'>
              <Hint description={isToolbarVisible ? 'Hide formatting' : 'Show formatting'}>
                <Button
                  disabled={disabled}
                  size={'iconSm'}
                  variant={'ghost'}
                  onClick={toggleToolbar}
                >
                  <PiTextAa className='size-4' />
                </Button>
              </Hint>
              <EmojiPopover hint='Emoji' onSelect={handleEmojiSelect}>
                <Button
                  disabled={disabled}
                  size={'iconSm'}
                  variant={'ghost'}
                >
                  <SmileIcon className='size-4' />
                </Button>
              </EmojiPopover>
              {variant === "create" && (
                <Hint description='Image'>
                  <Button
                    disabled={disabled}
                    size={'iconSm'}
                    variant={'ghost'}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <ImageIcon className='size-4' />
                  </Button>
                </Hint>
              )}

              {variant === "update" && (
                <div className='ml-auto flex items-center gap-x-2'>
                  <Button
                    size={'sm'}
                    variant={'outline'}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={disabled || isEmpty}
                    size={'sm'}
                    onClick={handleSubmit}
                    className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                  >
                    Save
                  </Button>
                </div>
              )}

              {variant === "create" && (
                <Button
                  disabled={disabled || isEmpty}
                  size={'iconSm'}
                  variant={'ghost'}
                  onClick={handleSubmit}
                  className='ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                >
                  <MdSend className='size-4' />
                </Button>
              )}
            </div>
          }
        </div>

      </div>
      {isEditorReady && variant === "create" &&
        <div className={cn(
          'flex justify-end p-2 text-[10px] text-muted-foreground opacity-0 transition', {
          'opacity-100': !isEmpty,
        })}>
          <p><strong>Shift + Enter</strong> to add a line</p>
        </div>
      }
    </div>
  )
}

export default Editor