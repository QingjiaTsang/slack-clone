import EmojiPopover from "@/components/EmojiPopover";
import Hint from "@/components/Hint";
import { Button } from "@/components/shadcnUI/button";
import {
  MessageSquareTextIcon,
  PencilIcon,
  SmilePlusIcon,
  TrashIcon,
} from "lucide-react";

type MessageToolBarProps = {
  isAuthor: boolean;
  isPending: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSelectReaction: (value: string) => void;
  onOpenThread: () => void;
  hideThreadButton: boolean;
};

const MessageToolBar = ({
  isAuthor,
  isPending,
  onEdit,
  onDelete,
  onSelectReaction,
  onOpenThread,
  hideThreadButton,
}: MessageToolBarProps) => {
  return (
    <div className="group-hover:opacity-100 absolute -top-2 right-5 opacity-0 transition-opacity duration-300">
      <div className="bg-white rounded-lg p-1 border border-gray-200">
        <Hint description="Add reaction">
          <EmojiPopover hint="Emoji" onSelect={onSelectReaction}>
            <Button variant="ghost" size="iconSm" disabled={isPending}>
              <SmilePlusIcon className="size-5" />
            </Button>
          </EmojiPopover>
        </Hint>
        {!hideThreadButton && (
          <Hint description="Reply in thread">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={onOpenThread}
              disabled={isPending}
            >
              <MessageSquareTextIcon className="size-5" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint description="Edit">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onEdit}
                disabled={isPending}
              >
                <PencilIcon className="size-5" />
              </Button>
            </Hint>
            <Hint description="Delete">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onDelete}
                disabled={isPending}
              >
                <TrashIcon className="size-5" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageToolBar;
