import { ArrowDown, ArrowUp, CornerDownLeft, ListFilter, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDetailPane } from "@/components/detail-pane-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { InboxDetail } from "./_components/inbox-detail";

type InboxItemType = "message" | "task" | "review" | "alert";

type InboxItem = {
  id: string;
  type: InboxItemType;
  title: string;
  preview: string;
  from: string;
  receivedAt: string;
  priority: "low" | "normal" | "high";
  tags: string[];
  detail: {
    summary: string;
    whatYouNeedToDo: string[];
    suggestedActions: string[];
    contextLinks: { label: string; kind: string }[];
  };
};

// Mock data
const mockInboxItems: InboxItem[] = [
  {
    id: "1",
    type: "message",
    title: "Review Q4 Planning Document",
    preview: "Sarah needs your feedback on the Q4 planning document before the team meeting.",
    from: "Sarah K.",
    receivedAt: "2h ago",
    priority: "high",
    tags: ["urgent", "review"],
    detail: {
      summary:
        "Sarah has shared a Q4 planning document that requires your review and feedback before the upcoming team meeting.",
      whatYouNeedToDo: [
        "Review the Q4 planning document for accuracy and completeness",
        "Provide feedback on proposed initiatives and timelines",
        "Confirm availability for the team meeting on Friday",
      ],
      suggestedActions: ["Open document", "Add comments", "Schedule follow-up"],
      contextLinks: [
        { label: "Q4 Planning Doc", kind: "document" },
        { label: "Sarah K.", kind: "person" },
        { label: "Team Meeting", kind: "event" },
      ],
    },
  },
  {
    id: "2",
    type: "task",
    title: "Approve Design System Updates",
    preview: "The design team has submitted updates to the component library that need approval.",
    from: "Design Team",
    receivedAt: "5h ago",
    priority: "normal",
    tags: ["approval", "design"],
    detail: {
      summary:
        "The design team has completed updates to the component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation. component library and is requesting your approval to proceed with implementation. The design team has completed updates to the component library and is requesting your approval to proceed with implementation.",
      whatYouNeedToDo: [
        "Review the updated component specifications",
        "Verify alignment with brand guidelines",
        "Approve or request changes",
      ],
      suggestedActions: ["View changes", "Approve", "Request revisions"],
      contextLinks: [
        { label: "Component Library", kind: "document" },
        { label: "Design Team", kind: "team" },
      ],
    },
  },
  {
    id: "3",
    type: "review",
    title: "Code Review: Feature Branch",
    preview: "A pull request for the new authentication flow is ready for your review.",
    from: "Engineering",
    receivedAt: "1d ago",
    priority: "normal",
    tags: ["code-review", "engineering"],
    detail: {
      summary:
        "A pull request for the new authentication flow has been submitted and is awaiting your code review.",
      whatYouNeedToDo: [
        "Review the code changes for security and best practices",
        "Test the authentication flow in the staging environment",
        "Provide feedback or approve the merge",
      ],
      suggestedActions: ["View PR", "Test in staging", "Approve merge"],
      contextLinks: [
        { label: "PR #1423", kind: "pull-request" },
        { label: "Auth Flow Spec", kind: "document" },
      ],
    },
  },
  {
    id: "4",
    type: "alert",
    title: "System Alert: High Error Rate",
    preview: "The API is experiencing elevated error rates. Immediate attention recommended.",
    from: "System Monitor",
    receivedAt: "30m ago",
    priority: "high",
    tags: ["alert", "urgent"],
    detail: {
      summary:
        "The monitoring system has detected elevated error rates in the API over the past hour. Immediate investigation is recommended.",
      whatYouNeedToDo: [
        "Check error logs and identify the root cause",
        "Review recent deployments for potential issues",
        "Coordinate with the on-call engineer if needed",
      ],
      suggestedActions: ["View logs", "Check metrics", "Contact on-call"],
      contextLinks: [
        { label: "Error Dashboard", kind: "dashboard" },
        { label: "Recent Deployments", kind: "deployment" },
      ],
    },
  },
  {
    id: "5",
    type: "message",
    title: "Weekly Team Sync Notes",
    preview: "Summary of key discussion points and action items from this week's team sync.",
    from: "Team",
    receivedAt: "3d ago",
    priority: "low",
    tags: ["notes", "team"],
    detail: {
      summary:
        "Weekly team sync notes have been shared, including key discussion points and action items from this week's meeting.",
      whatYouNeedToDo: [
        "Review action items assigned to you",
        "Update project status if needed",
        "Confirm attendance for next week's sync",
      ],
      suggestedActions: ["View notes", "Update status", "RSVP"],
      contextLinks: [
        { label: "Meeting Notes", kind: "document" },
        { label: "Team Calendar", kind: "calendar" },
      ],
    },
  },
];

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"now" | "soon" | "later">("now");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { open, close, setContent } = useDetailPane();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return mockInboxItems;
    const query = searchQuery.toLowerCase();
    return mockInboxItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.preview.toLowerCase().includes(query) ||
        item.from.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleItemClick = useCallback(
    (item: InboxItem) => {
      setSelectedItemId(item.id);
      setContent(<InboxDetail item={item} />);
      open();
    },
    [open, setContent]
  );

  useEffect(() => {
    if (!filteredItems.length) {
      setSelectedItemId(null);
      return;
    }
    const stillVisible = filteredItems.some((item) => item.id === selectedItemId);
    if (!selectedItemId || !stillVisible) {
      setSelectedItemId(filteredItems[0].id);
    }
  }, [filteredItems, selectedItemId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!filteredItems.length) return;

      const currentIndex = filteredItems.findIndex((item) => item.id === selectedItemId);
      const safeIndex = currentIndex < 0 ? 0 : currentIndex;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = Math.min(safeIndex + 1, filteredItems.length - 1);
        setSelectedItemId(filteredItems[nextIndex].id);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex = Math.max(safeIndex - 1, 0);
        setSelectedItemId(filteredItems[nextIndex].id);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const selectedItem = filteredItems[safeIndex];
        if (selectedItem) {
          handleItemClick(selectedItem);
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, filteredItems, handleItemClick, selectedItemId]);

  return (
    <div className="flex min-h-full items-center justify-center px-3 py-6">
      <div className="w-full max-w-3xl">
        <div className="flex h-152 max-h-[calc(100vh-var(--composer-height)-8rem)] flex-col">
          {/* Header */}
          <div className="mb-5 flex items-baseline gap-x-3">
            <h2 className="text-xl font-semibold uppercase tracking-tight text-foreground">
              Inbox
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Panel unit: search + list + footer */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
            {/* Search row */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                <Input
                  type="text"
                  placeholder="Search your inbox"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                  className="h-9 border-0 bg-transparent pl-6 pr-3 text-sm shadow-none placeholder:text-muted-foreground/60 focus-visible:border-transparent focus-visible:ring-0"
                />
              </div>
              {searchQuery.trim() ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="size-9 shrink-0 rounded-xl"
                >
                  <X className="size-4" />
                </Button>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Filter (coming soon)"
                className="size-9 shrink-0 rounded-xl"
              >
                <ListFilter className="size-4" />
              </Button>
            </div>

            <Separator className="opacity-60" />

            {/* Time filters */}
            <div className="flex flex-wrap items-center gap-2 px-5 py-4">
              {(["now", "soon", "later"] as const).map((filter) => {
                const isActive = timeFilter === filter;
                const label = filter[0].toUpperCase() + filter.slice(1);

                return (
                  <Button
                    key={filter}
                    type="button"
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter(filter)}
                    className={cn(
                      "h-8 rounded-full px-5 text-xs font-medium",
                      isActive
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    aria-pressed={isActive}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>

            {/* List */}
            <ScrollArea className="min-h-0 flex-1">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">No items found</div>
              ) : (
                <ItemGroup className="gap-0.5 px-3 py-1">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItemId === item.id;

                    return (
                      <Item
                        key={item.id}
                        variant="default"
                        className={cn(
                          "cursor-pointer rounded-xl border-0 px-4 py-3.5 hover:bg-brand-accent/60",
                          "focus-visible:ring-0 focus-visible:ring-offset-0",
                          isSelected && "bg-brand-accent/60"
                        )}
                        onClick={() => handleItemClick(item)}
                      >
                        <ItemContent className="gap-1">
                          <ItemTitle className="text-sm font-medium leading-snug">
                            {item.title}
                          </ItemTitle>
                          <ItemDescription className="text-xs leading-relaxed text-muted-foreground/80">
                            {item.preview}
                          </ItemDescription>
                        </ItemContent>
                        <div className="ml-auto flex flex-col items-end self-start">
                          <span className="text-[11px] text-muted-foreground/70">
                            {item.receivedAt}
                          </span>
                        </div>
                      </Item>
                    );
                  })}
                </ItemGroup>
              )}
            </ScrollArea>

            <Separator className="opacity-60" />

            {/* Footer helpers (visual only) */}
            <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 px-5 py-4 text-[11px] text-muted-foreground/70">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUp />
                  </Kbd>
                  <Kbd>
                    <ArrowDown />
                  </Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeft />
                </Kbd>
                <span>Select</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
