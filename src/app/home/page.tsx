"use client";

import {
  ArrowUpRight,
  Calendar,
  Clock,
  FileText,
  FolderOpen,
  Mail,
  Presentation,
  Sheet,
} from "lucide-react";
import { useDetailPane } from "@/components/detail-pane-context";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock data
const files = [
  { id: 1, name: "Data agent spec", type: "doc", color: "bg-blue-500" },
  { id: 2, name: "JD - Product designer", type: "pdf", color: "bg-red-500" },
  { id: 3, name: "AI for Work - PM check list", type: "sheet", color: "bg-green-500" },
  {
    id: 4,
    name: "AI for Work - Overview slide deck",
    type: "presentation",
    color: "bg-orange-500",
  },
];

const meetings = [
  {
    id: 1,
    title: "Walkthrough of the upcoming sprint goals",
    time: "01:00 - 02:00 PM",
    featured: true,
    attendees: [
      { id: 1, name: "Alice", avatar: "/avatars/1.jpg" },
      { id: 2, name: "Bob", avatar: "/avatars/2.jpg" },
      { id: 3, name: "Carol", avatar: "/avatars/3.jpg" },
    ],
    extraAttendees: 5,
  },
  {
    id: 2,
    title: "Meeting with developers about system design and its problems.",
    time: "02:30 - 03:00 PM",
    featured: false,
  },
];

const projects = [
  { id: 1, name: "Website Redesign", progress: 75, color: "bg-violet-500" },
  { id: 2, name: "Mobile App v2", progress: 45, color: "bg-blue-500" },
  { id: 3, name: "API Integration", progress: 90, color: "bg-emerald-500" },
];

const emails = [
  { id: 1, subject: "Re: Q4 Planning", from: "Sarah K.", unread: true },
  { id: 2, subject: "Design review feedback", from: "Mike R.", unread: true },
  { id: 3, subject: "Weekly sync notes", from: "Team", unread: false },
];

function FileIcon({ type }: { type: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    doc: <FileText className="size-4 text-white" />,
    pdf: <span className="text-[10px] font-bold text-white">PDF</span>,
    sheet: <Sheet className="size-4 text-white" />,
    presentation: <Presentation className="size-4 text-white" />,
  };
  return iconMap[type] || <FileText className="size-4 text-white" />;
}

function WidgetCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-4 shadow-md", className)}>
      {children}
    </div>
  );
}

function WidgetHeader({
  icon: Icon,
  title,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function ProjectDetail({ project }: { project: { name: string; progress: number } }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{project.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is placeholder content for the project detail pane.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-background p-3">
        <p className="text-sm text-foreground">
          Status: <span className="font-medium">{project.progress}% complete</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Next steps: review scope, confirm stakeholders, and draft a short execution plan. This
          section will eventually include project artifacts, recent activity, and assigned work.
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { open, setContent } = useDetailPane();

  const handleProjectClick = (project: (typeof projects)[number]) => {
    setContent(<ProjectDetail project={project} />);
    open();
  };

  return (
    <div className="min-h-full p-2">
      {/* Grid layout */}
      <div className="grid min-h-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Projects Card - Top / Wide */}
        <WidgetCard className="h-full sm:col-span-2 lg:col-span-2 lg:row-start-1">
          <WidgetHeader
            icon={FolderOpen}
            title="Projects"
            action={
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
              >
                Recent
                <svg className="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            }
          />
          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => handleProjectClick(project)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-lg p-2 text-left",
                  "transition-colors hover:bg-muted/50 focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-background"
                )}
              >
                <div className={cn("size-2 rounded-full", project.color)} />
                <span className="flex-1 text-sm text-foreground">{project.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", project.color)}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{project.progress}%</span>
                </div>
              </button>
            ))}
          </div>
        </WidgetCard>

        {/* Upcoming Meetings Card - Right / Tall */}
        <WidgetCard className="h-full lg:col-start-3 lg:row-span-2">
          <WidgetHeader
            icon={Calendar}
            title="Upcoming meetings"
            action={
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
              >
                <ArrowUpRight className="size-4" />
              </button>
            }
          />
          <div className="space-y-3">
            {/* Featured meeting */}
            {meetings
              .filter((m) => m.featured)
              .map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-lg bg-linear-to-br from-teal-50 to-cyan-50 p-4"
                >
                  <h4 className="font-medium text-foreground">{meeting.title}</h4>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-5 items-center justify-center rounded bg-white shadow-sm">
                        <Calendar className="size-3 text-teal-600" />
                      </div>
                      <AvatarGroup>
                        {meeting.attendees?.map((attendee) => (
                          <Avatar key={attendee.id} size="sm">
                            <AvatarImage src={attendee.avatar} alt={attendee.name} />
                            <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      {meeting.extraAttendees && (
                        <span className="text-xs text-muted-foreground">
                          +{meeting.extraAttendees}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}

            {/* Secondary meetings */}
            {meetings
              .filter((m) => !m.featured)
              .map((meeting) => (
                <div key={meeting.id} className="flex gap-3">
                  <div className="w-1 shrink-0 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm text-foreground">{meeting.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{meeting.time}</p>
                  </div>
                </div>
              ))}
          </div>
        </WidgetCard>

        {/* Emails Card - Bottom Left */}
        <WidgetCard className="h-full lg:col-start-1 lg:row-start-2">
          <WidgetHeader
            icon={Mail}
            title="Emails"
            action={
              <button
                type="button"
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
              >
                <ArrowUpRight className="size-4" />
              </button>
            }
          />
          <div className="space-y-1">
            {emails.map((email) => (
              <div
                key={email.id}
                className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "size-2 rounded-full",
                    email.unread ? "bg-blue-500" : "bg-transparent"
                  )}
                >
                  <span className="sr-only">{email.unread ? "Unread" : "Read"}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{email.subject}</p>
                  <p className="text-xs text-muted-foreground">{email.from}</p>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* Artifacts Card - Bottom Middle */}
        <WidgetCard className="h-full lg:col-start-2 lg:row-start-2">
          <WidgetHeader
            icon={FileText}
            title="Artifacts"
            action={
              <button
                type="button"
                className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
              >
                Recent
                <svg className="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            }
          />
          <div className="space-y-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn("flex size-8 items-center justify-center rounded-md", file.color)}
                >
                  <FileIcon type={file.type} />
                </div>
                <span className="text-sm text-foreground">{file.name}</span>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
