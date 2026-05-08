"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PreviewBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const preview = params.get("preview") === "1";

  if (!preview) return null;

  function exitPreview() {
    const next = new URLSearchParams(params.toString());
    next.delete("preview");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
    router.refresh();
  }

  return (
    <div className="fixed bottom-0 z-50 w-full border-t border-border bg-cream/85 backdrop-blur">
      <div className="container-x flex items-center justify-between gap-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Preview mode
          </p>
          <p className="text-xs text-muted-foreground">
            You are viewing <span className="font-medium text-foreground">draft</span> content.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
          <Button size="sm" onClick={exitPreview}>
            Exit preview
          </Button>
        </div>
      </div>
    </div>
  );
}
