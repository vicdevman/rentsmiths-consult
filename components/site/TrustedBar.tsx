const logos = [
  "Cambridge",
  "Toronto",
  "Manchester",
  "McGill",
  "Sydney",
  "Edinburgh",
  "Auckland",
  "Warwick",
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
              <span
                key={i}
                className="font-display text-2xl tracking-tight text-primary-foreground/85"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
