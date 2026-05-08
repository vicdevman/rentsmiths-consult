"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, type DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import type { EditableContent } from "@/lib/admin/types";
import { mockContent } from "@/lib/admin/mockContent";

type SiteContentContextValue = {
  content: EditableContent;
  preview: boolean;
  loading: boolean;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

function coerceEditableContent(raw: unknown): EditableContent {
  if (!raw || typeof raw !== "object") return mockContent;
  const r = raw as Partial<EditableContent>;
  return {
    services: Array.isArray(r.services) ? (r.services as EditableContent["services"]) : mockContent.services,
    stats: Array.isArray(r.stats) ? (r.stats as EditableContent["stats"]) : mockContent.stats,
    testimonials: Array.isArray(r.testimonials) ? (r.testimonials as EditableContent["testimonials"]) : mockContent.testimonials,
    gallery: Array.isArray(r.gallery) ? (r.gallery as EditableContent["gallery"]) : mockContent.gallery,
  };
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const [preview, setPreview] = useState<boolean>(false);
  const [content, setContent] = useState<EditableContent>(mockContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Persist preview state when `preview=1` is present in the URL so it survives link navigation.
    // If the param is missing, fall back to the stored value in localStorage (if any).
    const param = params.get("preview");
    if (param === "1") {
      setPreview(true);
      try { window.localStorage.setItem("rentsmiths_preview", "1"); } catch (e) {}
    } else {
      try {
        const stored = window.localStorage.getItem("rentsmiths_preview");
        setPreview(stored === "1");
      } catch (e) {
        setPreview(false);
      }
    }
  }, [params]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const version = preview ? "draft" : "published";
        const ref = doc(db, "site", "content", "versions", version);
        const snap = await getDoc(ref);
        if (cancelled) return;
        if (snap.exists()) {
          const data = snap.data() as DocumentData;
          setContent(coerceEditableContent(data?.content));
        } else {
          setContent(mockContent);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [preview]);

  const value = useMemo(() => ({ content, preview, loading }), [content, preview, loading]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    return {
      content: mockContent,
      preview: false,
      loading: false,
    } satisfies SiteContentContextValue;
  }
  return ctx;
}
