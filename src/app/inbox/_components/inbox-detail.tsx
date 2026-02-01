import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar, FileText, Mail, User, Workflow } from "lucide-react";

type InboxItem = {
  id: string;
  type: "message" | "task" | "review" | "alert";
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

function getTypeIcon(type: InboxItem["type"]) {
  const iconMap: Record<InboxItem["type"], ComponentType<{ className?: string }>> = {
    message: Mail,
    task: Workflow,
    review: FileText,
    alert: AlertCircle,
  };
  return iconMap[type] || Mail;
}

function getContextIcon(kind: string) {
  const iconMap: Record<string, ComponentType<{ className?: string }>> = {
    document: FileText,
    person: User,
    team: User,
    event: Calendar,
    dashboard: FileText,
    deployment: FileText,
    "pull-request": FileText,
    calendar: Calendar,
  };
  return iconMap[kind] || FileText;
}

export function InboxDetail({ item }: { item: InboxItem }) {
  const Icon = getTypeIcon(item.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg",
              item.priority === "high"
                ? "bg-destructive/10 text-destructive"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>From {item.from}</span>
              <span>•</span>
              <span>{item.receivedAt}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {item.priority === "high" && (
                <Badge variant="destructive" className="text-xs">
                  {item.priority}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Summary */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-foreground">Summary</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.detail.summary}</p>
      </div>

      {/* What You Need To Do */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">What you need to do</h3>
        <ul className="space-y-2">
          {item.detail.whatYouNeedToDo.map((task) => (
            <li key={task} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggested Actions */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Suggested actions</h3>
        <div className="flex flex-wrap gap-2">
          {item.detail.suggestedActions.map((action) => (
            <Button key={action} variant="outline" size="sm" disabled>
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Context */}
      {item.detail.contextLinks.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="mb-3 text-sm font-medium text-foreground">Context</h3>
            <ItemGroup>
              {item.detail.contextLinks.map((link) => {
                const LinkIcon = getContextIcon(link.kind);
                return (
                  <Item
                    key={`${link.kind}:${link.label}`}
                    variant="muted"
                    className="cursor-not-allowed"
                  >
                    <ItemMedia variant="icon">
                      <LinkIcon className="size-4 text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-sm">{link.label}</ItemTitle>
                      <ItemDescription className="text-xs capitalize">{link.kind}</ItemDescription>
                    </ItemContent>
                  </Item>
                );
              })}
            </ItemGroup>
          </div>
        </>
      )}
    </div>
  );
}
