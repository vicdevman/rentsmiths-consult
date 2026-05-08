import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentsmithsconsult.com.ng";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
    host: siteUrl,
  };
}
