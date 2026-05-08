import Image from "next/image";

const logos = [
  { title: "LIVE & STUDY in Europe", image: "/partner-4.jpg" },
  { title: "Henly & Partners", image: "/partner-3.jpg" },
  { title: "KC Oversees", image: "/partner-2.png" },
  { title: "Online Buisness School", image: "/partner-1.png" },
];

export function TrustedBar() {
  return (
    <section className="bg-primary py-10 text-primary-foreground">
      <div className="container-x flex flex-col items-center gap-6">
        <p className="text-xs uppercase tracking-[0.28em] text-primary-foreground/85">
          Trusted by partner institutions worldwide
        </p>
        <div className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-primary to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-primary to-transparent" />
          <div className="marquee flex w-max gap-14">
            {[...logos, ...logos].map((l, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Image
                  key={i}
                  src={l.image}
                  alt="company logo"
                  width={500}
                  height={500}
                  className="w-15 object-cover max-h-12 rounded-xs"
                />
                <span
                  key={i}
                  className="font-display text-2xl tracking-tight text-primary-foreground/85"
                >
                  {l.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
