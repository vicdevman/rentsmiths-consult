import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Rentsmiths Consult to start your study abroad or work abroad journey. Nigeria-based consultants for admissions, scholarships, visa/work permit and global career planning.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Rentsmiths Consult",
    description:
      "Speak with a Nigerian global education and career consultant about studying abroad, working abroad, scholarships and visa support.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
