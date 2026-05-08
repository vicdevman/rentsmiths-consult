"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
        router.replace(`/login${next}`);
      }
    });
    return () => unsub();
  }, [router, pathname]);

  return <>{children}</>;
}
