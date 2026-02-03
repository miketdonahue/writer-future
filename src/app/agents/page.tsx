"use client";

import { ListFilter, MoreHorizontal, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDetailPane } from "@/components/detail-pane-context";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AgentDetail } from "./_components/agent-detail";

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

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    type: "task",
    status: "running",
    lastAction: "Answered question about billing cycles",
    lastActionAt: "2m ago",
    tokensUsed: 1247,
  },
  {
    id: "2",
    name: "Data Pipeline Runner",
    type: "workflow",
    status: "running",
    lastAction: "Processing customer records batch",
    lastActionAt: "5m ago",
    progress: { current: 4, total: 7 },
    tokensUsed: 3891,
  },
  {
    id: "3",
    name: "Email Drafting Assistant",
    type: "assistant",
    status: "idle",
    lastAction: "Generated draft for Q4 report",
    lastActionAt: "1h ago",
    tokensUsed: 892,
  },
  {
    id: "4",
    name: "Code Review Agent",
    type: "assistant",
    status: "completed",
    lastAction: "Reviewed PR #1423 — 12 suggestions",
    lastActionAt: "3h ago",
    tokensUsed: 2156,
  },
  {
    id: "5",
    name: "Onboarding Flow",
    type: "workflow",
    status: "failed",
    lastAction: "Failed at step: Verify email domain",
    lastActionAt: "45m ago",
    progress: { current: 2, total: 5 },
    tokensUsed: 456,
    errorMessage: "DNS lookup timeout for domain verification",
  },
  {
    id: "6",
    name: "Sales Inquiry Handler",
    type: "task",
    status: "paused",
    lastAction: "Escalated to human agent",
    lastActionAt: "20m ago",
    tokensUsed: 678,
  },
  {
    id: "7",
    name: "Document Summarizer",
    type: "assistant",
    status: "running",
    lastAction: "Summarizing Q3 financial report",
    lastActionAt: "1m ago",
    tokensUsed: 1534,
  },
  {
    id: "8",
    name: "Lead Qualification Pipeline",
    type: "workflow",
    status: "completed",
    lastAction: "Qualified 23 leads, routed to sales",
    lastActionAt: "2h ago",
    progress: { current: 4, total: 4 },
    tokensUsed: 4521,
  },
];

const statusConfig: Record<AgentStatus, { label: string; color: string }> = {
  running: { label: "Running", color: "text-green-600 dark:text-green-500" },
  idle: { label: "Idle", color: "text-amber-600 dark:text-amber-500" },
  completed: { label: "Completed", color: "text-blue-600 dark:text-blue-500" },
  failed: { label: "Failed", color: "text-red-600 dark:text-red-500" },
  paused: { label: "Paused", color: "text-muted-foreground" },
};

const typeLabels: Record<AgentType, string> = {
  task: "Task",
  assistant: "Assistant",
  workflow: "Workflow",
};

export default function AgentsPage() {
  const [typeFilter, setTypeFilter] = useState<AgentType | "all">("all");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { open, setContent } = useDetailPane();

  const filteredAgents = useMemo(() => {
    if (typeFilter === "all") return mockAgents;
    return mockAgents.filter((agent) => agent.type === typeFilter);
  }, [typeFilter]);

  const handleAgentClick = useCallback(
    (agent: Agent) => {
      setSelectedAgentId(agent.id);
      setContent(<AgentDetail agent={agent} />);
      open();
    },
    [open, setContent]
  );

  useEffect(() => {
    if (!filteredAgents.length) {
      setSelectedAgentId(null);
      return;
    }
    const stillVisible = filteredAgents.some((agent) => agent.id === selectedAgentId);
    if (!selectedAgentId || !stillVisible) {
      setSelectedAgentId(filteredAgents[0].id);
    }
  }, [filteredAgents, selectedAgentId]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Agents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage your active agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9 rounded-full">
            <ListFilter className="size-4" />
          </Button>
          <Button size="sm" className="ml-2 gap-1.5">
            <Plus className="size-4" />
            New Agent
          </Button>
        </div>
      </div>

      {/* Panel */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 border-b border-border/60 px-2">
          {(["all", "task", "assistant", "workflow"] as const).map((filter) => {
            const isActive = typeFilter === filter;
            const labels: Record<typeof filter, string> = {
              all: "All",
              task: "Tasks",
              assistant: "Assistants",
              workflow: "Workflows",
            };

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setTypeFilter(filter)}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {labels[filter]}
                {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Agent
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Type
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Last Action
              </TableHead>
              <TableHead className="pr-5 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Time
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No agents found
                </TableCell>
              </TableRow>
            ) : (
              filteredAgents.map((agent) => {
                const isSelected = selectedAgentId === agent.id;
                const status = statusConfig[agent.status];

                return (
                  <TableRow
                    key={agent.id}
                    className={cn("cursor-pointer", isSelected && "bg-muted/50")}
                    onClick={() => handleAgentClick(agent)}
                  >
                    <TableCell className="pl-5 font-medium">{agent.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {typeLabels[agent.type]}
                    </TableCell>
                    <TableCell>
                      <span className={cn("inline-flex items-center gap-1.5", status.color)}>
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            agent.status === "running" && "bg-green-500",
                            agent.status === "idle" && "bg-amber-500",
                            agent.status === "completed" && "bg-blue-500",
                            agent.status === "failed" && "bg-red-500",
                            agent.status === "paused" && "bg-muted-foreground"
                          )}
                        />
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {agent.lastAction}
                    </TableCell>
                    <TableCell className="pr-5 text-right text-muted-foreground">
                      {agent.lastActionAt}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
