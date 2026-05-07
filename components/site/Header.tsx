"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(y > 24);

          if (open) {
            setHidden(false);
          } else {
            if (y > lastY && y > 80) {
              setHidden(true);
            } else if (y < lastY) {
              setHidden(false);
            }
          }

          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // header scroll logic remains above; cursor follower moved to global component

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <div
        className={`relative flex items-center justify-between rounded-full bg-cream-deep max-w-7xl left-1/2 -translate-x-1/2 border border-primary/10
           p-1.5
          ${scrolled ? "" : ""
        }`}
      >
        <Link href="/" className="flex items-center gap-3 pl-2" data-cursor="interactive" data-cursor-scale="1.4">
          <Image 
          alt="logo"
          src="/logo-v2.png"
          width={500}
          height={500}
          className="w-10 rounded-full object-cover"
          />
          <span className="font-display text-xl font-semibold tracking-tight">
            Rentsmiths
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const isActive = pathname === n.to || (n.to !== "/" && pathname?.startsWith(n.to));
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`rounded-full px-4 py-1.5 text-md font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-cream-deep hover:text-foreground'}`}
                data-cursor="interactive"
                data-cursor-scale="1.6"
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3.5 text-md font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.02] active:scale-[0.98]"
            data-cursor="interactive"
            data-cursor-scale="2"
          >
            Let's Talk
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="relative h-12 w-12 flex items-center justify-center rounded-full bg-primary p-5 md:hidden"
          aria-label="Toggle menu"
          data-cursor="interactive"
          data-cursor-scale="1.2"
        >
          {/* two-line hamburger that morphs into X */}
          <span
            aria-hidden
            className={`absolute block w-6 h-[2px] mt-1 bg-white transition-transform duration-300 ${open ? 'rotate-45 -mt-1' : '-translate-y-2'}`}
          />
          <span
            aria-hidden
            className={`absolute block w-6 h-[2px] -mt-1 bg-white transition-transform duration-300 ${open ? '-rotate-45 mt-1' : 'translate-y-2'}`}
          />  
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="container-x mt-3 rounded-3xl border border-border/60 bg-background/95 p-6 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {nav.map((n) => {
                const isActive = pathname === n.to || (n.to !== "/" && pathname?.startsWith(n.to));
                return (
                  <Link
                    key={n.to}
                    href={n.to}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-5 py-4 text-base font-medium ${isActive ? ' text-primary' : 'hover:bg-cream-deep'}`}
                    data-cursor="interactive"
                    data-cursor-scale="1.6"
                  >
                    {n.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block w-full rounded-lg bg-primary px-6 py-4 text-center text-base font-semibold text-primary-foreground"
                data-cursor="interactive"
                data-cursor-scale="1.6"
              >
                Book a call
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* cursor follower moved to global CursorFollower component */}
    </motion.header>
  );
}
