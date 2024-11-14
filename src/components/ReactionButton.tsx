"use client";

import { Id } from "@/convex/_generated/dataModel";

import React, { useRef, useEffect } from "react";
import Hint from "./Hint";
import { cn } from "@/lib/utils";

import { AnimatePresence, motion } from "framer-motion";
import { useGetCurrentUserRoleInWorkspace } from "@/api/user";
import { useParams } from "next/navigation";

type ReactionButtonProps = {
  value: string;
  count: number;
  memberIds: Id<"members">[];
  onToggle: (value: string) => void;
};

const ReactionButton = ({
  value,
  count,
  memberIds,
  onToggle,
}: ReactionButtonProps) => {
  const workspaceId = useParams().workspaceId as Id<"workspaces">;
  const { data: currentUserMember } =
    useGetCurrentUserRoleInWorkspace(workspaceId);

  const selected =
    currentUserMember && memberIds.includes(currentUserMember._id);

  const tooltipText = `${count} ${count === 1 ? "person" : "people"} reacted with ${value}`;

  // animate the count with smooth effect of increasing and decreasing
  const prevCountRef = useRef(count);
  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);
  const isIncreasing = count > prevCountRef.current;

  return (
    <Hint description={tooltipText}>
      <button
        onClick={() => onToggle(value)}
        className={cn(
          "flex items-center gap-1 p-1 rounded-md text-sm",
          "bg-gray-200/70",
          "transition-all duration-200",
          "hover:scale-105 hover:-translate-y-0.5",
          "reaction-active",
          { "bg-blue-200/65": selected }
        )}
      >
        <span
          className={cn(
            "transition-transform duration-200 hover:scale-110",
            memberIds.length > 0 && "text-blue-600"
          )}
        >
          {value}
        </span>
        <div className="relative w-4 h-4 flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={count}
              initial={{
                opacity: 0,
                y: isIncreasing ? 20 : -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: isIncreasing ? -20 : 20,
                position: "absolute",
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="text-xs text-muted-foreground"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </div>
      </button>
    </Hint>
  );
};

export default ReactionButton;
