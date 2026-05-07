"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pt-28 pb-24 sm:pt-36 sm:pb-32 "
    >
      {/* Background image with parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-20">
        <img
          src={heroBg.src}
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
      </motion.div>
      {/* Warm orange overlay (Flexio palette) */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.685 0.205 35 / 0.92) 0%, oklch(0.62 0.21 32 / 0.88) 20%, oklch(0.55 0.2 30 / 0.92) 100%)",
        }}
      />
      {/* Soft grain noise vignette */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(0,0,0,0.35)_100%)]" />

      <div className="container-x text-primary-foreground">
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] sm:text-7xl lg:text-[5.5rem]">
          {"Your Gateway to Global Education & Careers."
            .split(" ")
            .map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.15 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mr-3 inline-block"
              >
                {w}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-6 max-w-xl text-base text-primary-foreground/85 sm:text-lg"
        >
          A quest for quality global education and unparalleled career
          opportunities. We guide you every step of the way.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-background px-6 py-3.5 text-sm font-semibold text-foreground shadow-pop transition-transform hover:scale-[1.02]"
          >
            Get started now
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3.5 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-primary-foreground/15"
          >
            Explore services
          </Link>
        </motion.div>

        {/* Floating stat card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3"
        >
          {[
            { k: "500+", v: "Students placed" },
            { k: "50+", v: "Partner universities" },
            { k: "98%", v: "Visa success rate" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 px-5 py-4 backdrop-blur-md"
            >
              <p className="font-display text-3xl">{s.k}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary-foreground/75">
                {s.v}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Bottom rating chip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 flex items-center gap-3 text-sm text-primary-foreground/85"
        >
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          Rated 4.9/5 by 200+ alumni & families
        </motion.div>
      </div>
    </section>
  );
}
