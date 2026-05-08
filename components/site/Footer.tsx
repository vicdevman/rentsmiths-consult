import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">
                R
              </span>
              <span className="font-display text-xl">Rentsmiths</span>
            </div>
            <p className="mt-5 max-w-sm text-sm text-cream/70">
              Your trusted partner in achieving global education and career goals, from first
              consultation to landing day.
            </p>
            <div className="mt-6 flex gap-2">
             {[{icon:InstagramIcon, link:'https://www.instagram.com/rentsmiths'}, {icon:FacebookIcon, link:"https://www.facebook.com/rentsmithsglobaleducarionconsult"}, {icon:LinkedinIcon, link:"https://www.linkedin.com/in/tope-akinwumi-22963046"}].map((e, i) => (

                <a
                  key={i}
                  href={e.link}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/80 transition-colors hover:bg-primary hover:text-primary-foreground hover:border-transparent"
                  aria-label="social"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <e.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Company"
            links={[
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact" },
            ]}
          />

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cream/60">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                info@rentsmithsconsult.com.ng
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                +234 703 628 7729
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                54 Marian Road, Calabar, Nigeria
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
            <p className="font-display text-2xl leading-tight">Ready to begin?</p>
            <p className="mt-2 text-sm text-primary-foreground/85">
              Book a free 30-minute strategy call.
            </p>
            <Link
              href="/contact"
              className="group mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream"
            >
              Get started
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Rentsmiths Global Consults. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>Crafted with care for ambitious futures.</p>
            <Link
              href="/login"
              className="text-cream/20 transition-colors hover:text-cream/40"
              aria-label="Admin"
            >
              Tope
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-cream/60">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm text-cream/80">
        {links.map((l) => (
          <li key={l.to}>
            <Link href={l.to} className="transition-colors hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
