"use client";

import { ChevronDownIcon, ChevronUpIcon, CopyIcon, LoaderCircle, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";

export function ResponsePanel() {
  const { messages, isStreaming, streamingContent, isDrawerOpen, toggleDrawer } = useChatStore();

  // Determine collapsed bar text
  const getCollapsedText = () => {
    if (isStreaming) return "Generating...";
    if (messages.length > 0) {
      return "Updating the title to...";
    }
    return null;
  };

  const collapsedText = getCollapsedText();

  // Hide panel if no messages and not streaming
  if (!collapsedText) {
    return null;
  }

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="pointer-events-auto absolute bottom-full left-1/2 z-30 w-[98%] -translate-x-1/2">
      {/* Collapsed Header Bar - always visible */}
      <button
        type="button"
        className="relative flex w-full cursor-pointer items-center justify-between rounded-t-lg border-x border-t border-border bg-muted px-3 py-2 transition-colors hover:bg-accent"
        onClick={toggleDrawer}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDrawer();
          }
        }}
      >
        <div className="flex items-center gap-2">
          {isStreaming && <Spinner className="size-3.5" />}
          <span className="text-[13px] text-foreground/70">{collapsedText}</span>
        </div>
        <div className="flex items-center gap-3">
          <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          <Tooltip>
            <TooltipTrigger
              render={<span />}
              className="flex items-center justify-center rounded-md p-0.5 transition-colors hover:bg-accent"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="size-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="top">New request</TooltipContent>
          </Tooltip>
          {isDrawerOpen ? (
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          ) : (
            <ChevronUpIcon className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expandable Content - slides up/down */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative overflow-hidden border-x border-t border-border bg-background"
          >
            <div className="max-h-[50vh] space-y-4 overflow-y-auto px-3 pb-6 pt-6">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div
                    className={cn(
                      "text-[10px] uppercase tracking-wide",
                      msg.role === "user" ? "text-muted-foreground" : "text-primary/70"
                    )}
                  >
                    {msg.role}
                  </div>
                  <Message from={msg.role}>
                    <MessageContent className="text-[13px] leading-relaxed">
                      <MessageResponse>{msg.content}</MessageResponse>
                    </MessageContent>
                    {msg.role === "assistant" && (
                      <MessageActions>
                        <MessageAction
                          tooltip="Copy to clipboard"
                          label="Copy"
                          onClick={() => handleCopy(msg.content)}
                        >
                          <CopyIcon className="size-3" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </Message>
                </div>
              ))}

              {/* Show streaming content as temporary assistant message */}
              {isStreaming && streamingContent && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wide text-primary/70">
                    assistant
                  </div>
                  <Message from="assistant">
                    <MessageContent className="text-[13px] leading-relaxed">
                      <MessageResponse>{streamingContent}</MessageResponse>
                    </MessageContent>
                  </Message>
                </div>
              )}

              {/* Show waiting indicator if streaming but no content yet */}
              {isStreaming && !streamingContent && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shimmer duration={1.5}>Generating response...</Shimmer>
                </div>
              )}
            </div>
            {/* Top fade gradient */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-background via-background/70 to-transparent" />
            {/* Bottom fade gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-background via-background/70 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
