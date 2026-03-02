"use client";

import { FolderKanban, Home, Inbox, ServerCog, Workflow, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ChatComposer } from "@/components/chat-composer";
import { DetailPaneProvider, useDetailPane } from "@/components/detail-pane-context";
import { PageTransition } from "@/components/page-transition";
import { ResponsePanel } from "@/components/response-panel";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";


const tabs = [
  { id: "home", href: "/home", icon: Home, label: "Home" },
  { id: "inbox", href: "/inbox", icon: Inbox, label: "Inbox" },
  { id: "projects", href: "/projects", icon: FolderKanban, label: "Projects" },
  { id: "agents", href: "/agents", icon: ServerCog, label: "Agents" },
  { id: "automations", href: "/automations", icon: Workflow, label: "Automations" },
] as const;

function AppShellInner({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const prevPathname = useRef(pathname);
  const { isOpen, content, close, setContent } = useDetailPane();
  const { isDrawerOpen, closeDrawer } = useChatStore();
  const composerHeight = "196px";

  const getIsActive = (href: string) => {
    return pathname.startsWith(href);
  };

  // Reset detail pane synchronously before paint when navigating
  useLayoutEffect(() => {
    if (prevPathname.current !== pathname) {
      close();
      setContent(null);
      prevPathname.current = pathname;
    }
  }, [pathname, close, setContent]);

  // Close response panel on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <div className="flex h-screen bg-background-warm">
      {/* Full-page backdrop overlay when response panel is open */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 cursor-pointer bg-black/40"
            onClick={closeDrawer}
          />
        )}
      </AnimatePresence>

      {/* Tool Rail */}
      <nav className="flex w-14 shrink-0 flex-col items-center justify-center border-r border-border bg-background">
        <div className="flex flex-col gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = getIsActive(tab.href);

            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger
                  render={
                    <Link
                      to={tab.href}
                      className={cn(
                        "group relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    />
                  }
                >
                  {/* Active indicator */}
                  <span
                    className={cn(
                      "absolute left-0 h-6 w-0.5 rounded-r-full bg-foreground transition-opacity",
                      isActive ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent side="right">{tab.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </nav>

      {/* Content Area */}
      <div
        className="relative min-w-0 flex-1 overflow-x-clip"
        style={{ "--composer-height": composerHeight } as React.CSSProperties}
      >
        {/* Main Content Pane - uses motion for smooth layout animations */}
        <motion.div
          className="absolute inset-0 flex justify-center p-3"
          animate={{
            x: isOpen ? "calc(-22.5% - 3px)" : 0,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <main className="h-full w-[calc(55%-6px)] shrink-0 overflow-hidden">
            <div className="relative h-full">
              <div className="h-full overflow-auto pb-(--composer-height)">
                <PageTransition>{children}</PageTransition>
              </div>

              {/* Background layer - dimmed when drawer open */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
                <div className="absolute inset-x-0 -top-14 h-14 bg-linear-to-t from-background-warm via-background-warm/70 to-transparent" />
                <div className="bg-background-warm px-6 pb-6 pt-4">
                  <div className="mx-auto max-w-2xl h-[120px]" />
                </div>
              </div>
            </div>
          </main>
        </motion.div>

        {/* Composer layer - separate from transforming pane so z-index works with backdrop */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex justify-center p-3 pb-6"
          animate={{
            x: isOpen ? "calc(-22.5% - 3px)" : 0,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="w-[calc(55%-6px)] px-6">
            <div className="pointer-events-auto relative mx-auto max-w-2xl">
              <ResponsePanel />
              <ChatComposer placeholder="What can I help with?" />
            </div>
          </div>
        </motion.div>

        {/* Detail Pane - uses AnimatePresence for proper enter/exit */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: 16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 16, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0 flex h-full w-[45%] justify-center"
            >
              <aside className="relative h-full w-full overflow-y-auto border-l border-border bg-background px-6 py-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={close}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                  aria-label="Close details panel"
                >
                  <X className="size-4" />
                </Button>
                {content}
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DetailPaneProvider>
      <AppShellInner>{children}</AppShellInner>
    </DetailPaneProvider>
  );
}
