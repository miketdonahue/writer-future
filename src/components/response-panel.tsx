"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";

export function ResponsePanel() {
  const { messages, isStreaming, streamingContent, isDrawerOpen, toggleDrawer } = useChatStore();

  // Determine collapsed bar text
  const getCollapsedText = () => {
    if (isStreaming) return "Generating...";
    if (messages.length > 0) {
      const count = messages.length;
      return `${count} message${count === 1 ? "" : "s"}`;
    }
    return null;
  };

  const collapsedText = getCollapsedText();

  // Hide panel if no messages and not streaming
  if (!collapsedText) {
    return null;
  }

  return (
    <div className="pointer-events-auto absolute bottom-full left-0 right-0 z-30">
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
          <span className="text-xs text-foreground">{collapsedText}</span>
        </div>
        {isDrawerOpen ? (
          <ChevronDownIcon className="size-3.5 text-muted-foreground" />
        ) : (
          <ChevronUpIcon className="size-3.5 text-muted-foreground" />
        )}
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
            <div className="max-h-[50vh] overflow-y-auto px-3 pt-6 pb-6 space-y-4">
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
                  <div className="prose prose-sm max-w-none text-[13px] leading-relaxed dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* Show streaming content as temporary assistant message */}
              {isStreaming && streamingContent && (
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wide text-primary/70">
                    assistant
                  </div>
                  <div className="prose prose-sm max-w-none text-[13px] leading-relaxed dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamingContent}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Show waiting indicator if streaming but no content yet */}
              {isStreaming && !streamingContent && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Spinner className="size-3.5" />
                  <span>Generating response...</span>
                </div>
              )}
            </div>
            {/* Top fade gradient */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-background via-background/70 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
