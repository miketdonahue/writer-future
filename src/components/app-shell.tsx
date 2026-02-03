"use client";

import { Home, Inbox, ServerCog, Workflow, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChatComposer } from "@/components/chat-composer";
import { DetailPaneProvider, useDetailPane } from "@/components/detail-pane-context";
import { PageTransition } from "@/components/page-transition";
import { ResponsePanel } from "@/components/response-panel";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";

/**
 * Renders children only after client mount. Avoids hydration mismatch for
 * Base UI components that use useId(), which can differ between Next.js
 * server and client React instances.
 */
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

const tabs = [
  { id: "home", href: "/home", icon: Home, label: "Home" },
  { id: "inbox", href: "/inbox", icon: Inbox, label: "Inbox" },
  { id: "agents", href: "/agents", icon: ServerCog, label: "Agents" },
  { id: "automations", href: "/automations", icon: Workflow, label: "Automations" },
] as const;

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const { isOpen, content, close, setContent } = useDetailPane();
  const { isDrawerOpen } = useChatStore();
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
            className="fixed inset-0 z-40 bg-black/40"
          />
        )}
      </AnimatePresence>

      {/* Tool Rail - client-only to avoid Base UI useId hydration mismatch (Next server vs client React) */}
      <nav className="flex w-14 shrink-0 flex-col items-center justify-center border-r border-border bg-background">
        <ClientOnly>
          <div className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = getIsActive(tab.href);

              return (
                <Tooltip key={tab.id}>
                  <TooltipTrigger>
                    <Link
                      href={tab.href}
                      className={cn(
                        "group relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
        </ClientOnly>
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
            x: isOpen ? "calc(-25% - 3px)" : 0,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <main className="h-full w-[calc(50%-6px)] shrink-0 overflow-hidden">
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
              {/* Content layer - highlighted above backdrop */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50">
                <div className="px-6 pb-6 pt-8">
                  <div className="pointer-events-auto relative mx-auto max-w-2xl">
                    <ResponsePanel />
                    <ChatComposer placeholder="Ask anything..." />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </motion.div>

        {/* Detail Pane - uses AnimatePresence for proper enter/exit */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: 16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 16, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0 flex h-full w-1/2 justify-center"
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
