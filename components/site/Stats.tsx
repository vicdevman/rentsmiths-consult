'use client'

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

const stats = [
  { k: 8, suffix: "+", label: "Years of expertise" },
  { k: 500, suffix: "+", label: "Students placed" },
  { k: 50, suffix: "+", label: "Partner universities" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="container-x py-24 sm:py-32">
      <Reveal className="text-center">
        <span className="pill">By the numbers</span>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl">
          Transforming futures with measurable expertise.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-3xl bg-primary p-8 text-primary-foreground"
          >
            <p className="font-display text-6xl leading-none sm:text-7xl">
              <Counter to={s.k} suffix={s.suffix} />
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-primary-foreground/85">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
