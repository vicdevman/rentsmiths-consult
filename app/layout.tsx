import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import React, { Suspense } from "react";
import "./globals.css";
import { SiteChrome } from "@/components/site/SiteChrome";
import { cn } from "@/lib/utils";
import { SiteContentProvider } from "@/components/site/SiteContentProvider";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rentsmithsconsult.com.ng"),
  title: {
    default: "Rentsmiths Consult | Study Abroad, Work Abroad & Global Education Support",
    template: "%s | Rentsmiths Consult",
  },
  description:
    "Rentsmiths Consult is a Nigerian education and career consultancy helping students and professionals study abroad, work abroad, secure scholarships, and navigate visa processes with clarity and confidence.",
  applicationName: "Rentsmiths Consult",
  keywords: [
    "Rentsmiths Consult",
    "Rentsmiths Global Consults",
    "study abroad Nigeria",
    "work abroad Nigeria",
    "education consultancy Nigeria",
    "career consultancy Nigeria",
    "visa assistance Nigeria",
    "scholarships Nigeria",
    "international education agency Nigeria",
    "overseas education consultant",
    "visa and admissions support",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Rentsmiths Consult",
    title: "Rentsmiths Consult | Study Abroad, Work Abroad & Global Education Support",
    description:
      "A Nigerian global education and career consultancy helping you study abroad, work abroad, access scholarships, and handle visa steps end-to-end.",
    url: "/",
    images: [
      {
        url: "/rentsmiths-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Rentsmiths Consult",
      },
    ],
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentsmiths Consult | Study Abroad, Work Abroad & Global Education Support",
    description:
      "Study abroad, work abroad, scholarships, visa and admissions support — guided by consultants who care about outcomes.",
    images: ["/rentsmiths-logo.jpg"],
  },
  icons: {
    icon: "/rentsmiths-logo.jpg",
    apple: "/rentsmiths-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentsmithsconsult.com.ng";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rentsmiths Consult",
    url: siteUrl,
    logo: `${siteUrl.replace(/\/$/, "")}/rentsmiths-logo.jpg`,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "info@rentsmithsconsult.com.ng",
        telephone: "+2347036287729",
        areaServed: "NG",
        availableLanguage: ["en"],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Suspense fallback={<div />}> 
          <SiteContentProvider>
            <SiteChrome>{children}</SiteChrome>
          </SiteContentProvider>
        </Suspense>
      </body>
    </html>
  );
}
