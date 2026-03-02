import { FolderKanban, ListFilter, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProjectStatus = "active" | "paused" | "completed";

type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  tasksTotal: number;
  tasksDone: number;
  updatedAt: string;
  tags: string[];
};

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Q1 Content Calendar",
    description: "Blog posts, social copy, and newsletter drafts for Q1 campaigns.",
    status: "active",
    progress: 62,
    tasksTotal: 24,
    tasksDone: 15,
    updatedAt: "2h ago",
    tags: ["content", "marketing"],
  },
  {
    id: "2",
    name: "Investor Update — March",
    description: "Monthly investor update deck with key metrics and product highlights.",
    status: "active",
    progress: 40,
    tasksTotal: 10,
    tasksDone: 4,
    updatedAt: "Yesterday",
    tags: ["finance", "comms"],
  },
  {
    id: "3",
    name: "Product Launch: Horizon",
    description: "Press release, landing page copy, and launch announcement sequence.",
    status: "active",
    progress: 78,
    tasksTotal: 18,
    tasksDone: 14,
    updatedAt: "3h ago",
    tags: ["launch", "product"],
  },
  {
    id: "4",
    name: "Brand Voice Guidelines",
    description: "Tone-of-voice document and writing style guide for all external comms.",
    status: "paused",
    progress: 55,
    tasksTotal: 8,
    tasksDone: 4,
    updatedAt: "4 days ago",
    tags: ["brand", "guidelines"],
  },
  {
    id: "5",
    name: "Employee Handbook Rewrite",
    description: "Full rewrite of the company handbook to reflect updated policies and culture.",
    status: "paused",
    progress: 30,
    tasksTotal: 20,
    tasksDone: 6,
    updatedAt: "1 week ago",
    tags: ["internal", "hr"],
  },
  {
    id: "6",
    name: "2024 Annual Report",
    description: "Narrative sections, data storytelling, and executive summary for the annual report.",
    status: "completed",
    progress: 100,
    tasksTotal: 14,
    tasksDone: 14,
    updatedAt: "Jan 15",
    tags: ["finance", "report"],
  },
  {
    id: "7",
    name: "Podcast Script Series",
    description: "Scripts for a six-episode podcast covering AI and the future of work.",
    status: "completed",
    progress: 100,
    tasksTotal: 12,
    tasksDone: 12,
    updatedAt: "Feb 2",
    tags: ["content", "podcast"],
  },
];

const statusConfig: Record<
  ProjectStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  active: {
    label: "Active",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-600",
  },
  paused: {
    label: "Paused",
    dotClass: "bg-amber-400",
    badgeClass: "bg-amber-400/10 text-amber-600",
  },
  completed: {
    label: "Done",
    dotClass: "bg-muted-foreground/40",
    badgeClass: "bg-muted/60 text-muted-foreground",
  },
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");

  const filtered = mockProjects.filter((p) => filter === "all" || p.status === filter);

  return (
    <div className="flex min-h-full items-center justify-center px-3 py-6">
      <div className="w-full max-w-3xl">
        <div className="flex h-152 max-h-[calc(100vh-var(--composer-height)-8rem)] flex-col">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <h1 className="text-xl font-semibold uppercase tracking-tight">Projects</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="size-9 rounded-full">
                <Search className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-9 rounded-full">
                <ListFilter className="size-4" />
              </Button>
              <Button size="sm" className="ml-2 gap-1.5">
                <Plus className="size-4" />
                New Project
              </Button>
            </div>
          </div>

          {/* Panel */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
            {/* Filter tabs */}
            <div className="flex shrink-0 items-center gap-1 border-b border-border/60 px-5">
              {(["all", "active", "paused", "completed"] as const).map((f) => {
                const isActive = filter === f;
                const labels: Record<typeof f, string> = {
                  all: "All",
                  active: "Active",
                  paused: "Paused",
                  completed: "Completed",
                };
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={cn(
                      "relative px-4 py-3 text-sm font-medium transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {labels[f]}
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Project list — scrollable */}
            <div className="min-h-0 flex-1 overflow-auto">
              {filtered.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                  <FolderKanban className="size-8 opacity-30" strokeWidth={1.5} />
                  <p className="text-sm">No projects found</p>
                </div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {filtered.map((project) => {
                    const cfg = statusConfig[project.status];
                    return (
                      <li
                        key={project.id}
                        className="group cursor-pointer px-5 py-4 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Left: name + description */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={cn("size-1.5 shrink-0 rounded-full", cfg.dotClass)} />
                              <span className="truncate text-sm font-medium leading-snug">
                                {project.name}
                              </span>
                            </div>
                            <p className="mt-0.5 truncate pl-3.5 text-xs leading-relaxed text-muted-foreground/80">
                              {project.description}
                            </p>

                            {/* Tags */}
                            <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-3.5">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Right: stats */}
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                cfg.badgeClass
                              )}
                            >
                              {cfg.label}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-foreground/70 transition-all"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-[11px] text-muted-foreground/70">
                                {project.progress}%
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground/70">
                              {project.tasksDone}/{project.tasksTotal} tasks · {project.updatedAt}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
