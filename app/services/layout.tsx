import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Rentsmiths Consult services: study abroad admissions support, scholarships guidance, work abroad pathways, visa/work permit assistance, and international career planning in Nigeria.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services | Rentsmiths Consult",
    description:
      "Study abroad, scholarships, work abroad, visa/work permit, and career planning — delivered by a Nigeria-based global education consultancy.",
    url: "/services",
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
