import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type SimpleLinkProps = ComponentProps<"a">;

export function SimpleLink({ className, ...props }: SimpleLinkProps) {
  return (
    <a
      className={cn(
        "text-xs text-muted-foreground transition-colors hover:text-foreground underline-offset-4 hover:underline",
        className
      )}
      {...props}
    />
  );
}
