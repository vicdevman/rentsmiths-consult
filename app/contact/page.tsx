'use client'
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { InstagramIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from "@/components/site/SocialIcons";


export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="container-x pt-40 pb-12 sm:pt-48">
        <Reveal>
          <h1 className="max-w-3xl text-5xl sm:text-7xl">
            Let's plan your next chapter.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Tell us a little about you. We respond within one business day, and the first call is
            always free.
          </p>
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Info column */}
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-3xl bg-ink p-6 text-cream">
              <div>
                <h2 className="font-display text-3xl">Get in touch directly</h2>
                <ul className="mt-8 space-y-5 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-cream/60">Email</p>
                      <p className="font-medium">info@rentsmithsconsult.com.ng</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-cream/60">Phone</p>
                      <p className="font-medium">+234 703 628 7729</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-cream/60">Office</p>
                      <p className="font-medium">
                        54 Marian Road, beside PWAN building,
                        <br />
                        Calabar, Cross River State, Nigeria
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-12">
                <p className="text-xs uppercase tracking-[0.2em] text-cream/60">Follow us</p>
                <div className="mt-3 flex gap-2">
                  {[InstagramIcon, FacebookIcon, LinkedinIcon, TwitterIcon].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 transition-colors hover:bg-primary hover:border-transparent"
                      aria-label="social"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-3xl bg-background p-6 shadow-soft ring-1 ring-border"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="name" placeholder="Jane Doe" />
                <Field label="Email" name="email" type="email" placeholder="jane@email.com" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Phone" name="phone" placeholder="+234..." />
                <SelectField
                  label="I'm interested in"
                  name="interest"
                  options={[
                    "University admissions",
                    "Scholarship strategy",
                    "Visa & immigration",
                    "Career placement",
                    "Test prep coaching",
                    "Something else",
                  ]}
                />
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your goals..."
                  className="mt-2 w-full rounded-lg border border-border bg-cream px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-background"
                />
              </div>

              <button
                type="submit"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.02]"
              >
                {sent ? "Message sent — we'll be in touch" : "Send message"}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                By submitting, you agree to be contacted by our team. No spam.
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-background"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        className="mt-2 w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-background"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
