"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import heroBg from "@/assets/hero-bg.jpg";
import CircularText from '../CircularText';
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import { useSiteContent } from "@/components/site/SiteContentProvider";

const fallbackGallery = [
  { img: g1.src, title: "Class of 2024" },
  { img: g2.src, title: "Visa Approval Day" },
  { img: g3.src, title: "Campus Life Begins" },
  { img: g4.src, title: "Departure Lounge" },
  { img: g5.src, title: "1:1 CV Reviews" },
  { img: g6.src, title: "Pre-Departure Workshop" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const { content } = useSiteContent();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const fromDb = (content?.gallery ?? []).map((g) => ({
    img: g.imageUrl || g1.src,
    title: g.title || g.alt || "Event",
  }));
  const galleryItems = (fromDb.length ? fromDb : fallbackGallery).slice(0, 8);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pt-40 pb-16 sm:pt-48"
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
      {/* Cream-deep overlay to match other pages (covers image, sits behind content) */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--cream)",
          opacity: 0.92,
          zIndex: 0,
        }}
      />
      {/* Soft grain noise vignette above overlay */}
      {/* <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at top, transparent 30%, rgba(0,0,0,0.35) 100%)",
          zIndex: 1,
        }}
      /> */}

      <div className="container-x relative z-10 text-center">
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="mx-auto text-center max-w-4xl text-5xl leading-[1.02] sm:text-7xl lg:text-[5rem]"
        >
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
          className="mt-6 mx-auto max-w-xl text-md font-display sm:text-lg text-center"
        >
          A quest for quality global education and unparalleled career
          opportunities. We guide you every step of the way.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="mx-auto mt-10 max-w-5xl"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/70">
              Recent events
            </p>
            <Link
              href="/gallery"
              className="text-xs font-semibold text-primary hover:underline"
              data-cursor="interactive"
              data-cursor-scale="1.2"
            >
              View all
            </Link>
          </div>

          <div className="relative mt-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--cream)] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--cream)] to-transparent" />
            <div
              ref={galleryScrollRef}
              onWheel={(e) => {
                const el = galleryScrollRef.current;
                if (!el) return;
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                  e.preventDefault();
                  el.scrollLeft += e.deltaY;
                }
              }}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {galleryItems.map((it, i) => (
                <div
                  key={`${it.title}-${i}`}
                  className="snap-start shrink-0 w-[220px] sm:w-[260px]"
                >
                  <div className="group overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 backdrop-blur-md">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={it.img}
                        alt={it.title}
                        fill
                        sizes="(max-width: 640px) 220px, 260px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={i < 2}
                      />
                    </div>
                    <div className="px-3 py-2">
                      <p className="truncate text-xs font-medium text-foreground/80">{it.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            data-cursor="interactive"
            data-cursor-scale="1.6"
          >
            Lets Talk
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-cream-deep/5 px-6 py-3.5 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-cream-deep/15 text-primary"
            data-cursor="interactive"
            data-cursor-scale="1.4"
          >
            Explore services
          </Link>
{/* <span className="fixed bottom-2 right-2">
          <CircularText
            text="EXPLORE*SERVICES*"
            onHover="speedUp"
            spinDuration={20}
            className="text-primary z-1000"
            // size={120}
            // fontSize="1rem"
            onClick={() => {
              const el = document.getElementById('services');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                // fallback: navigate to services page
                window.location.href = '/services';
              }
            }}
          />
</span> */}
        </motion.div>

        {/* Floating stat card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3 mx-auto"
        >
          {[
            { k: "500+", v: "Students placed" },
            { k: "50+", v: "Partner universities" },
            { k: "98%", v: "Visa success rate" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-primary/15 bg-primary/10 px-5 py-4 backdrop-blur-md text-center"
            >
              <p className="font-display text-3xl">{s.k}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/70">
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
          className="mt-10 flex items-center justify-center gap-3 text-sm text-ink"
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
