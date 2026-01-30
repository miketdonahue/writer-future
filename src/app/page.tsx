"use client";

import { useDetailPane } from "@/components/detail-pane-context";

export default function HomePage() {
  const { isOpen, open, close, setContent } = useDetailPane();

  const handleOpenDetails = () => {
    setContent(
      <>
        <h2 className="text-sm font-medium text-foreground">Document Details</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This is custom content passed to the detail pane. You can put anything here — metadata,
          forms, previews, or contextual actions.
        </p>
      </>
    );
    open();
  };

  return (
    <>
      <h1 className="text-lg font-medium tracking-tight text-foreground">Home</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your dashboard and overview. See recent activity, quick actions, and everything happening
        across your workspace at a glance.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={handleOpenDetails}
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Open Details
        </button>
        {isOpen && (
          <button
            type="button"
            onClick={close}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Close Details
          </button>
        )}
      </div>
    </>
  );
}
