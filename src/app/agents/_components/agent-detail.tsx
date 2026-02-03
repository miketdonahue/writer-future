import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock,
  Coins,
  MessageSquare,
  Pause,
  Play,
  RefreshCw,
  Square,
  Workflow,
  Zap,
} from "lucide-react";
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

type AgentType = "task" | "assistant" | "workflow";
type AgentStatus = "running" | "idle" | "completed" | "failed" | "paused";

type Agent = {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  lastAction: string;
  lastActionAt: string;
  progress?: { current: number; total: number };
  tokensUsed?: number;
  errorMessage?: string;
};

function getTypeIcon(type: AgentType): ComponentType<{ className?: string }> {
  const iconMap: Record<AgentType, ComponentType<{ className?: string }>> = {
    task: MessageSquare,
    assistant: Bot,
    workflow: Workflow,
  };
  return iconMap[type];
}

function getStatusConfig(status: AgentStatus) {
  const config: Record<
    AgentStatus,
    { label: string; color: string; bgColor: string; icon: ComponentType<{ className?: string }> }
  > = {
    running: {
      label: "Running",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      icon: Zap,
    },
    idle: {
      label: "Idle",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      icon: Clock,
    },
    completed: {
      label: "Completed",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      icon: CheckCircle2,
    },
    failed: {
      label: "Failed",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/10",
      icon: AlertCircle,
    },
    paused: {
      label: "Paused",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      icon: Pause,
    },
  };
  return config[status];
}

// Mock activity log for demonstration
function getMockActivityLog(agent: Agent) {
  const baseLog = [
    { action: agent.lastAction, timestamp: agent.lastActionAt, type: "action" as const },
  ];

  if (agent.type === "workflow" && agent.progress) {
    return [
      ...baseLog,
      { action: "Processing batch 3 of 7", timestamp: "8m ago", type: "action" as const },
      { action: "Validated input data schema", timestamp: "12m ago", type: "action" as const },
      { action: "Workflow started", timestamp: "15m ago", type: "system" as const },
    ];
  }

  if (agent.type === "task") {
    return [
      ...baseLog,
      { action: "User asked follow-up question", timestamp: "5m ago", type: "action" as const },
      { action: "Sent initial greeting", timestamp: "10m ago", type: "action" as const },
      { action: "Session started", timestamp: "12m ago", type: "system" as const },
    ];
  }

  return [
    ...baseLog,
    { action: "Task assigned", timestamp: "2h ago", type: "system" as const },
    { action: "Agent initialized", timestamp: "2h ago", type: "system" as const },
  ];
}

export function AgentDetail({ agent }: { agent: Agent }) {
  const TypeIcon = getTypeIcon(agent.type);
  const statusConfig = getStatusConfig(agent.status);
  const StatusIcon = statusConfig.icon;
  const activityLog = getMockActivityLog(agent);

  const typeLabels: Record<AgentType, string> = {
    task: "Task",
    assistant: "Assistant",
    workflow: "Workflow",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-lg",
              statusConfig.bgColor,
              statusConfig.color
            )}
          >
            <TypeIcon className="size-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">{agent.name}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{typeLabels[agent.type]}</span>
              <span>•</span>
              <span>Last active {agent.lastActionAt}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="outline" className={cn("gap-1 text-xs", statusConfig.color)}>
                <StatusIcon className="size-3" />
                {statusConfig.label}
              </Badge>
              {agent.status === "failed" && (
                <Badge variant="destructive" className="text-xs">
                  Needs attention
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {agent.tokensUsed !== undefined && (
          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Coins className="size-3.5" />
              <span>Tokens used</span>
            </div>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {agent.tokensUsed.toLocaleString()}
            </p>
          </div>
        )}
        {agent.progress && (
          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Workflow className="size-3.5" />
              <span>Progress</span>
            </div>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {agent.progress.current} / {agent.progress.total} steps
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full transition-all",
                  agent.status === "failed" ? "bg-red-500" : "bg-foreground"
                )}
                style={{
                  width: `${Math.round((agent.progress.current / agent.progress.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {agent.errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
            <AlertCircle className="size-4" />
            Error Details
          </div>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">{agent.errorMessage}</p>
        </div>
      )}

      {/* Actions */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Actions</h3>
        <div className="flex flex-wrap gap-2">
          {agent.status === "running" && (
            <Button variant="outline" size="sm" className="gap-1.5">
              <Pause className="size-3.5" />
              Pause
            </Button>
          )}
          {(agent.status === "paused" || agent.status === "idle") && (
            <Button variant="outline" size="sm" className="gap-1.5">
              <Play className="size-3.5" />
              Resume
            </Button>
          )}
          {agent.status === "failed" && (
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="size-3.5" />
              Retry
            </Button>
          )}
          {agent.status !== "completed" && (
            <Button variant="outline" size="sm" className="gap-1.5 text-destructive">
              <Square className="size-3.5" />
              Cancel
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="size-3.5" />
            Restart
          </Button>
        </div>
      </div>

      <Separator />

      {/* Activity Log */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Activity Log</h3>
        <ItemGroup className="gap-1">
          {activityLog.map((entry, index) => (
            <Item
              key={`${entry.timestamp}-${index}`}
              variant="default"
              size="sm"
              className="rounded-lg bg-muted/30 px-3 py-2"
            >
              <ItemMedia variant="icon">
                {entry.type === "system" ? (
                  <Clock className="size-3.5 text-muted-foreground" />
                ) : (
                  <Zap className="size-3.5 text-muted-foreground" />
                )}
              </ItemMedia>
              <ItemContent className="gap-0">
                <ItemTitle className="text-xs font-normal">{entry.action}</ItemTitle>
                <ItemDescription className="text-[10px]">{entry.timestamp}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </div>
  );
}
