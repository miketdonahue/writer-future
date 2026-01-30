"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Inbox, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDetailPane } from "@/components/detail-pane-context";

const tabs = [
  { id: "home", href: "/", icon: Home, label: "Home" },
  { id: "inbox", href: "/inbox", icon: Inbox, label: "Inbox" },
  { id: "agents", href: "/agents", icon: Workflow, label: "Agents" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOpen, content } = useDetailPane();

  const getIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-muted">
      {/* Tool Rail */}
      <nav className="flex w-14 shrink-0 flex-col items-center justify-center border-r border-border bg-background">
        <div className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = getIsActive(tab.href);

            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={tab.href}
                    className={cn(
                      "group relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {/* Active indicator */}
                    <span
                      className={cn(
                        "absolute left-0 h-6 w-0.5 rounded-r-full bg-foreground transition-opacity",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{tab.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </nav>

      {/* Content Area */}
      <div className="relative min-w-0 flex-1 overflow-x-clip">
        {/* Main Content Pane - slides to center when detail closes */}
        <div
          className={cn(
            "absolute inset-0 flex justify-center p-3 transition-transform duration-300 ease-out",
            isOpen ? "translate-x-[calc(-25%-3px)]" : "translate-x-0"
          )}
        >
          <main className="h-full w-[calc(50%-6px)] shrink-0 overflow-auto rounded-lg border border-border bg-background p-6">
            {children}
          </main>
        </div>

        {/* Detail Pane - slides in when opening, fades out when closing */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-1/2 justify-center p-3 pl-1.5 transition-all duration-300 ease-out",
            isOpen ? "translate-x-0 opacity-100" : "translate-x-0 opacity-0"
          )}
        >
          <aside className="h-full w-full max-w-[calc(100%-6px)] overflow-auto rounded-lg border border-border bg-background p-6">
            {content || (
              <>
                <h2 className="text-sm font-medium text-muted-foreground">Details</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  This panel shows contextual information. When you select a document, its
                  metadata appears here. When you view a teammate, their activity shows. The
                  right column adapts to the left.
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
