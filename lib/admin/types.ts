export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tag?: string;
};

export type StatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  alt: string;
};

export type EditableContent = {
  services: ServiceItem[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
  gallery: GalleryItem[];
};
