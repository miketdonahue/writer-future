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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini", description: "Best for everyday tasks" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Fastest for quick answers" },
] as const;

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
  const [model, setModel] = useState<string>(MODELS[0].value);

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
        "**:data-[slot=input-group]:p-2",
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

      <PromptInputFooter className="pb-0 px-0 pl-1">
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

        <div className="flex items-center gap-2">
          <Select value={model} onValueChange={(v) => v && setModel(v)}>
            <SelectTrigger
              size="sm"
              className="h-7 gap-1 border-0 bg-transparent font-normal hover:bg-muted/50 px-2"
            >
              <SelectValue className="text-[13px] text-foreground/70">
                {MODELS.find((m) => m.value === model)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end" className="min-w-52">
              {MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value} className="py-2.5 px-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-sm">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PromptInputSubmit disabled={!text.trim()} />
        </div>
      </PromptInputFooter>
    </PromptInput>
  );
}
