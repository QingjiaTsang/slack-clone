import { Doc, Id } from "@/convex/_generated/dataModel";
import ReactQuill from "react-quill";

import { useRef, useEffect } from "react";

import {
  type GetMessagesType,
  useDeleteMessage,
  useToggleReaction,
  useUpdateMessage,
} from "@/api/message";

import Hint from "@/components/Hint";
import MessageToolBar from "@/components/MessageToolBar";
import QuillContentsRenderer from "@/components/QuillContentsRenderer";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/shadcnUI/avatar";
import Thumbnail from "@/components/Thumbnail";
import { formatDate, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Editor, { EditorSubmitData } from "@/components/Editor";
import useConfirm from "@/hooks/useConfirm";

import autoAnimate from "@formkit/auto-animate";
import ReactionButton from "@/components/ReactionButton";
import usePanel from "@/hooks/usePanel";
import { SmilePlusIcon } from "lucide-react";
import EmojiPopover from "@/components/EmojiPopover";
import ThreadBar from "@/components/ThreadBar";

const formatFullTime = (date: Date) => {
  return `${
    isToday(date)
      ? "Today"
      : isYesterday(date)
        ? "Yesterday"
        : formatDate(date, "yyyy-MM-dd")
  } at ${formatDate(date, "HH:mm")}`;
};

type MessageProps = {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  body: string;
  image?: GetMessagesType[number]["image"];
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  threadCount: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp: number;
  isAuthor: boolean;
  isEditing: boolean;
  setEditing: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadButton: boolean;
  hideThreadBar: boolean;
  createdAt: Doc<"messages">["_creationTime"];
  updateAt?: Doc<"messages">["updatedAt"];
};

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "member",
  body,
  image,
  reactions,
  threadCount,
  threadImage,
  threadName,
  threadTimestamp,
  isAuthor,
  isEditing,
  setEditing,
  isCompact,
  hideThreadButton,
  hideThreadBar = false,
  createdAt,
  updateAt,
}: MessageProps) => {
  const editorRef = useRef<ReactQuill>(null);

  const messageContentRef = useRef(null);

  const { mutate: updateMessage, isPending: isUpdating } = useUpdateMessage();
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending = isUpdating || isDeleting || isTogglingReaction;

  const { parentMessageId, openMessagePanel, closePanel, openProfilePanel } =
    usePanel();

  const [DeleteMessageConfirmDialog, confirm] = useConfirm({
    title: "Delete message",
    message: "Are you sure you want to delete this message?",
  }) as [() => JSX.Element, () => Promise<boolean>];

  const handleOpenThread = async () => {
    await openMessagePanel(id);
  };

  const handleUpdateMessage = ({ body }: EditorSubmitData) => {
    updateMessage(
      { messageId: id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditing(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleDeleteMessage = async (imageStorageId?: Id<"_storage">) => {
    const confirmed = await confirm();

    if (!confirmed) {
      return;
    }

    deleteMessage(
      { messageId: id, imageStorageId },
      {
        onSuccess: async () => {
          toast.success("Message deleted");

          if (parentMessageId === id) {
            await closePanel();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  const handleToggleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to set reaction");
        },
      }
    );
  };

  // auto animate the message content
  useEffect(() => {
    messageContentRef.current && autoAnimate(messageContentRef.current);
  }, []);

  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-2 hover:bg-gray-100/60 group message-container relative">
        <div className="flex items-center pl-3 gap-2" ref={messageContentRef}>
          <Hint description={formatFullTime(new Date(createdAt))}>
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 text-center hover:underline">
              {updateAt
                ? formatDate(new Date(updateAt), "HH:mm")
                : formatDate(new Date(createdAt), "HH:mm")}
            </button>
          </Hint>
          {isEditing ? (
            <div className="px-2 editor-container">
              <Editor
                quillRef={editorRef}
                variant="update"
                defaultValue={JSON.parse(body)}
                disabled={isPending}
                placeholder="Edit message"
                onCancel={() => setEditing(null)}
                onSubmit={handleUpdateMessage}
              />
            </div>
          ) : (
            <div className="flex flex-col ml-2">
              <QuillContentsRenderer contents={body} />
              {image?.url && (
                <Thumbnail imageUrl={image.url} alt="Message image" />
              )}
              {updateAt && (
                <div className="text-xs text-muted-foreground">(edited)</div>
              )}
              {reactions.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {reactions.map((reaction) => (
                    <ReactionButton
                      key={reaction.value}
                      {...reaction}
                      onToggle={handleToggleReaction}
                    />
                  ))}
                  <EmojiPopover hint="Emoji" onSelect={handleToggleReaction}>
                    <button className="rounded-full p-1 hover:bg-gray-200/70 transition-all duration-200">
                      <SmilePlusIcon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </EmojiPopover>
                </div>
              )}
              {!hideThreadBar && (
                <ThreadBar
                  threadCount={threadCount}
                  threadImage={threadImage}
                  threadName={threadName}
                  threadTimestamp={threadTimestamp}
                  onClick={handleOpenThread}
                />
              )}
            </div>
          )}
          <MessageToolBar
            isAuthor={isAuthor}
            isPending={isPending}
            onEdit={() => setEditing(id)}
            onDelete={() => handleDeleteMessage(image?.storageId)}
            onSelectReaction={handleToggleReaction}
            onOpenThread={handleOpenThread}
            hideThreadButton={hideThreadButton}
          />
        </div>
      </div>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-2 p-2 hover:bg-gray-100/60 group message-container relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
        )}
      >
        <div className="flex items-start px-2" ref={messageContentRef}>
          <button
            className="flex-shrink-0"
            onClick={() => openProfilePanel(memberId)}
          >
            <Avatar>
              <AvatarImage src={authorImage!} />
              <AvatarFallback className="text-xl">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="ml-2 editor-container">
              <Editor
                quillRef={editorRef}
                variant="update"
                defaultValue={JSON.parse(body)}
                disabled={isPending}
                placeholder="Edit message"
                onCancel={() => setEditing(null)}
                onSubmit={handleUpdateMessage}
              />
            </div>
          ) : (
            <div className="flex flex-col ml-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openProfilePanel(memberId)}
                  className="text-sm text-primary font-bold hover:underline"
                >
                  {authorName}
                </button>
                <Hint description={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {updateAt
                      ? formatDate(new Date(updateAt), "HH:mm")
                      : formatDate(new Date(createdAt), "HH:mm")}
                  </button>
                </Hint>
              </div>
              <div>
                <QuillContentsRenderer contents={body} />
                {image?.url && (
                  <Thumbnail imageUrl={image.url} alt="Message image" />
                )}
                {updateAt && (
                  <div className="text-xs text-muted-foreground">(edited)</div>
                )}
                {reactions.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {reactions.map((reaction) => (
                      <ReactionButton
                        key={reaction.value}
                        {...reaction}
                        onToggle={handleToggleReaction}
                      />
                    ))}
                    <EmojiPopover hint="Emoji" onSelect={handleToggleReaction}>
                      <button className="rounded-full p-1 hover:bg-gray-200/70 transition-all duration-200">
                        <SmilePlusIcon className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </EmojiPopover>
                  </div>
                )}
                {!hideThreadBar && (
                  <ThreadBar
                    threadCount={threadCount}
                    threadImage={threadImage}
                    threadName={threadName}
                    threadTimestamp={threadTimestamp}
                    onClick={handleOpenThread}
                  />
                )}
              </div>
              <MessageToolBar
                isAuthor={isAuthor}
                isPending={isPending}
                onEdit={() => setEditing(id)}
                onDelete={() => handleDeleteMessage(image?.storageId)}
                onSelectReaction={handleToggleReaction}
                onOpenThread={handleOpenThread}
                hideThreadButton={hideThreadButton}
              />
            </div>
          )}
        </div>
      </div>
      <DeleteMessageConfirmDialog />
    </>
  );
};

export default Message;
