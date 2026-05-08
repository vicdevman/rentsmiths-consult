"use client";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { InstagramIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from "@/components/site/SocialIcons";


export default function Contact() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: null as null | "success" | "error",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    setSent(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
        setSubmitStatus({
          type: "success",
          message:
            "Message sent successfully! Check your email for confirmation.",
        });
        setFormData({ name: "", email: "", phone: "", interest: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onSubmit={handleSubmit}
              className="rounded-3xl bg-background p-6 shadow-soft ring-1 ring-border"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" name="name" placeholder="Jane Doe" value={formData.name} onChange={handleChange} />
                <Field label="Email" name="email" type="email" placeholder="jane@email.com" value={formData.email} onChange={handleChange} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Phone" name="phone" placeholder="+234..." value={formData.phone} onChange={handleChange} />
                <SelectField
                  label="I'm interested in"
                  name="interest"
                  options={[
                    "Study abroad",
                    "Work abroad",
                    "Scholarships",
                    "Trainings",
                    "Visa / work permit",
                    "Online university",
                    "Something else"
                  ]}
                  value={formData.interest}
                  onChange={handleChange}
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
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-border bg-cream px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-background"
                />
              </div>

              {submitStatus.type ? (
                <p
                  className={`mt-4 text-sm ${
                    submitStatus.type === "success" ? "text-emerald-700" : "text-destructive"
                  }`}
                >
                  {submitStatus.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-pop transition-transform hover:scale-[1.02]"
              >
                {isSubmitting ? "Sending..." : sent ? "Message sent — we'll be in touch" : "Send message"}
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
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-background"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-md border border-border bg-cream px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-background"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
