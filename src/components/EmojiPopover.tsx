import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnUI/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcnUI/tooltip";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

type EmojiPopoverProps = {
  hint: string;
  onSelect: (emoji: string) => void;
  children: React.ReactNode;
};

const EmojiPopover = ({ hint, onSelect, children }: EmojiPopoverProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSelect = (emoji: { native: string }) => {
    onSelect(emoji.native);
    setIsPopoverOpen(false);
    setIsTooltipOpen(false);
  };

  return (
    <TooltipProvider>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>

        <PopoverContent className="size-fit bg-transparent border-none shadow-none  p-0">
          <Picker data={data} onEmojiSelect={handleSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
