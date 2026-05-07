import type { EditableContent } from "./types";

export const mockContent: EditableContent = {
  services: [
    {
      id: "service_university_admissions",
      title: "University Admissions",
      description:
        "Strategic university shortlisting, SOPs, and application packaging that gets you in.",
      imageUrl: "/assets/service-1.jpg",
      tag: "Most popular",
    },
    {
      id: "service_scholarship_strategy",
      title: "Scholarship Strategy",
      description: "We surface and pursue scholarships that match your profile, scores, and ambitions.",
      imageUrl: "/assets/service-2.jpg",
    },
    {
      id: "service_visa_immigration",
      title: "Visa & Immigration",
      description: "End-to-end visa documentation, mock interviews, and embassy follow-through.",
      imageUrl: "/assets/service-3.jpg",
    },
  ],
  stats: [
    { id: "stat_years", value: 8, suffix: "+", label: "Years of expertise" },
    { id: "stat_students", value: 500, suffix: "+", label: "Students placed" },
    { id: "stat_partners", value: 50, suffix: "+", label: "Partner universities" },
  ],
  testimonials: [
    {
      id: "tt_1",
      quote:
        "Rentsmiths made my Canada admission feel effortless. From SOP to visa interview prep — every detail was covered.",
      name: "Adaeze O.",
      role: "MSc, University of Toronto",
    },
    {
      id: "tt_2",
      quote:
        "I had been rejected twice before. The team rebuilt my application and I got into my top choice with a partial scholarship.",
      name: "Tunde A.",
      role: "MBA, Warwick Business School",
    },
    {
      id: "tt_3",
      quote:
        "Beyond admissions — they helped me find housing and a part-time job in Manchester within two weeks of arrival.",
      name: "Chiamaka E.",
      role: "BSc, University of Manchester",
    },
  ],
  gallery: [
    {
      id: "gallery_1",
      title: "Student Success",
      imageUrl: "",
      alt: "",
    },
  ],
};
