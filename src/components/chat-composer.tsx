"use client";

import { useChat } from "@ai-sdk/react";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { useChatStore } from "@/stores/chat-store";
import { trpc } from "@/trpc/client";

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
  placeholder = "What can I help with?",
  onSubmit,
  className,
}: ChatComposerProps) {
  const [text, setText] = useState("");
  const [model, setModel] = useState<string>(MODELS[0].value);

  const { setMessages, addMessage, setStreaming, setStreamingContent } = useChatStore();

  // Load messages from database
  const { data: savedMessages } = trpc.chat.getMessages.useQuery();
  const saveMessageMutation = trpc.chat.saveMessage.useMutation();

  // Sync saved messages to store on load
  useEffect(() => {
    if (savedMessages) {
      // Cast role to the expected union type
      setMessages(
        savedMessages.map((msg) => ({
          ...msg,
          role: msg.role as "user" | "assistant",
        }))
      );
    }
  }, [savedMessages, setMessages]);

  // Track the final content for saving when streaming completes
  const finalContentRef = useRef<string>("");

  const {
    messages: aiMessages,
    sendMessage,
    status,
  } = useChat({
    onFinish: async () => {
      // Save assistant message to DB when streaming completes
      // Use the accumulated content from the ref
      const content = finalContentRef.current;
      if (content) {
        const savedMsg = await saveMessageMutation.mutateAsync({
          role: "assistant",
          content,
        });
        addMessage({
          ...savedMsg,
          role: savedMsg.role as "user" | "assistant",
        });
      }
      setStreaming(false);
      setStreamingContent("");
      finalContentRef.current = "";
    },
    onError: () => {
      setStreaming(false);
      setStreamingContent("");
      finalContentRef.current = "";
    },
  });

  // Sync streaming response to store and ref
  useEffect(() => {
    const lastMessage = aiMessages[aiMessages.length - 1];
    if (lastMessage && lastMessage.role === "assistant" && lastMessage.parts) {
      const textPart = lastMessage.parts.find((p) => p.type === "text");
      if (textPart && textPart.type === "text" && "text" in textPart) {
        const text = textPart.text;
        setStreamingContent(text);
        finalContentRef.current = text;
      }
    }
  }, [aiMessages, setStreamingContent]);

  // Update streaming status based on useChat status
  useEffect(() => {
    if (status === "submitted" || status === "streaming") {
      setStreaming(true);
    }
  }, [status, setStreaming]);

  const handleSubmit = async (message: PromptInputMessage) => {
    const trimmed = message.text.trim();
    if (!trimmed) return;

    // Save user message to DB immediately
    const userMsg = await saveMessageMutation.mutateAsync({
      role: "user",
      content: trimmed,
    });
    addMessage({
      ...userMsg,
      role: userMsg.role as "user" | "assistant",
    });

    // Start streaming
    setStreaming(true);
    setStreamingContent("");

    // Send message via AI SDK
    sendMessage({
      parts: [{ type: "text", text: trimmed }],
    });

    // Also call optional onSubmit callback
    onSubmit?.(trimmed);
    setText("");
  };

  // Determine status for submit button
  const submitStatus =
    status === "submitted" || status === "streaming"
      ? "streaming"
      : status === "error"
        ? "error"
        : undefined;

  return (
    <PromptInput
      globalDrop
      className={cn(
        // Style the internal InputGroup (the actual visual container).
        "**:data-[slot=input-group]:rounded-b-lg **:data-[slot=input-group]:rounded-t-none **:data-[slot=input-group]:border-border",
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
          <PromptInputSubmit disabled={!text.trim()} status={submitStatus} />
        </div>
      </PromptInputFooter>
    </PromptInput>
  );
}
