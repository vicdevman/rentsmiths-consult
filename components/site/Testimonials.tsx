import { Reveal } from "./Reveal";
import { useSiteContent } from "@/components/site/SiteContentProvider";

const tts = [
  {
    q: "Rentsmiths made my Canada admission feel effortless. From SOP to visa interview prep — every detail was covered.",
    n: "Adaeze O.",
    role: "MSc, University of Toronto",
  },
  {
    q: "I had been rejected twice before. The team rebuilt my application and I got into my top choice with a partial scholarship.",
    n: "Tunde A.",
    role: "MBA, Warwick Business School",
  },
  {
    q: "Beyond admissions — they helped me find housing and a part-time job in Manchester within two weeks of arrival.",
    n: "Chiamaka E.",
    role: "BSc, University of Manchester",
  },
];

export function Testimonials() {
  const { content } = useSiteContent();
  const fromDb = (content?.testimonials ?? []).map((t) => ({
    q: t.quote,
    n: t.name,
    role: t.role,
  }));
  const source = fromDb.length ? fromDb : tts;
  return (
    <section className="container-x py-24 sm:py-32">
      <Reveal className="text-center">
        <span className="pill">Testimonials</span>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl">
          Relied on by students globally.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {source.map((t, i) => (
          <Reveal key={t.n} delay={i * 0.08}>
            <figure
              className={`flex h-full flex-col justify-between rounded-3xl p-7 ${
                i === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-cream-deep text-foreground"
              }`}
            >
              <blockquote className="font-display text-xl leading-snug">"{t.q}"</blockquote>
              <figcaption className="mt-8">
                <p className="font-semibold">{t.n}</p>
                <p
                  className={`text-xs ${
                    i === 1 ? "text-primary-foreground/75" : "text-muted-foreground"
                  }`}
                >
                  {t.role}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
