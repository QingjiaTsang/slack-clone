import React, { useState } from "react";

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

const EmojiPopover = React.forwardRef<HTMLDivElement, EmojiPopoverProps>(
  ({ hint, onSelect, children }, ref) => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [preventTooltip, setPreventTooltip] = useState(false);

    const handleSelect = (emoji: { native: string }) => {
      onSelect(emoji.native);
      setIsPopoverOpen(false);
      setPreventTooltip(true);
      // prevent tooltip display right away after popover is closed
      setTimeout(() => {
        setPreventTooltip(false);
      }, 200);
    };

    const handleTooltipChange = (open: boolean) => {
      if (!preventTooltip) {
        setIsTooltipOpen(open);
      }
    };

    return (
      <TooltipProvider>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <Tooltip open={isTooltipOpen} onOpenChange={handleTooltipChange}>
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
  }
);

EmojiPopover.displayName = "EmojiPopover";

export default EmojiPopover;
