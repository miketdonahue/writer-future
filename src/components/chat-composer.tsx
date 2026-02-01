"use client";

import { Mic } from "lucide-react";
import { useState } from "react";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  placeholder?: string;
  onSubmit?: (message: string) => void;
  className?: string;
}

export function ChatComposer({
  placeholder = "Ask anything...",
  onSubmit,
  className,
}: ChatComposerProps) {
  const [text, setText] = useState("");

  const handleSubmit = (message: PromptInputMessage) => {
    const trimmed = message.text.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setText("");
  };

  return (
    <PromptInput
      globalDrop
      className={cn(
        // Style the internal InputGroup (the actual visual container).
        "**:data-[slot=input-group]:rounded-lg **:data-[slot=input-group]:border-border",
        "**:data-[slot=input-group]:bg-background **:data-[slot=input-group]:shadow-sm",
        // InputGroup dims itself when any child is disabled; keep the composer readable.
        "**:data-[slot=input-group]:opacity-100",
        className
      )}
      onSubmit={handleSubmit}
    >
      <PromptInputBody>
        <PromptInputTextarea
          id="chat-composer-input"
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder={placeholder}
          // Clamp the auto-resizing to ~2 lines (still scrolls beyond).
          className="min-h-10 max-h-14"
          value={text}
        />
      </PromptInputBody>

      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputButton aria-label="Voice input">
            <Mic className="size-4" />
          </PromptInputButton>
        </PromptInputTools>

        <PromptInputSubmit disabled={!text.trim()} />
      </PromptInputFooter>
    </PromptInput>
  );
}
