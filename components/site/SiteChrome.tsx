"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { Testimonials } from "@/components/site/Testimonials";
import { CtaBand } from "@/components/site/CtaBand";
import CursorFollower from "@/components/ui/CursorFollower";
import { PreviewBar } from "@/components/site/PreviewBar";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideMarketingChrome = pathname === "/login" || pathname.startsWith("/dashboard");

  if (hideMarketingChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <PreviewBar />
      <Header />
      {children}
      <Testimonials />
      <CtaBand />
      <Footer />
      <CursorFollower />
    </>
  );
}
