import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Rentsmiths Consult — a Nigerian global education and career consultancy connecting students and professionals to study abroad, work abroad, scholarships and visa support.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Rentsmiths Consult",
    description:
      "A Nigerian global education and career consultancy connecting students and professionals to study abroad, work abroad, scholarships and visa support.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
