"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/admin/AuthGuard";
import type { EditableContent, GalleryItem, ServiceItem, StatItem, TestimonialItem } from "@/lib/admin/types";
import { getEditableContent, saveEditableContent } from "@/lib/admin/contentClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, LogOut, Plus, Save, X, LayoutGrid, BarChart3, MessageSquareQuote, Image as ImageIcon, ImagePlus, Trash2 } from "lucide-react";

type SectionKey = "services" | "stats" | "testimonials" | "gallery";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

/* ------------------------------------------------------------------ */
/*  Framer-motion center popup modal                                  */
/* ------------------------------------------------------------------ */
function PopupModal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          />
          {/* modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <div
              className="relative w-full max-w-lg rounded-2xl border border-border bg-cream p-4 sm:p-6 shadow-pop"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-accent transition-colors"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
              <h2 className="font-display text-base sm:text-lg font-semibold">{title}</h2>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
              <div className="mt-5">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Main dashboard page                                               */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const router = useRouter();
  const [section, setSection] = useState<SectionKey>("services");
  const [content, setContent] = useState<EditableContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    getEditableContent().then(setContent);
  }, []);

  const navItems: { key: SectionKey; label: string; icon: ReactNode }[] = useMemo(
    () => [
      { key: "services", label: "Services", icon: <LayoutGrid className="h-4 w-4" /> },
      { key: "stats", label: "Stats", icon: <BarChart3 className="h-4 w-4" /> },
      { key: "testimonials", label: "Testimonials", icon: <MessageSquareQuote className="h-4 w-4" /> },
      { key: "gallery", label: "Gallery", icon: <ImageIcon className="h-4 w-4" /> },
    ],
    [],
  );

  async function onLogout() {
    window.localStorage.removeItem("rentsmiths_auth_token");
    router.replace("/login");
  }

  async function onSave() {
    if (!content) return;
    setSaving(true);
    try {
      await saveEditableContent(content);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-cream">
        <div className="container-x flex min-h-screen flex-col py-4 sm:py-6">
          {/* Top bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNav(true)}
                className="rounded-lg border border-border bg-cream-deep p-2 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-lg sm:text-xl font-semibold">Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage content blocks on your site.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={onSave} disabled={!content || saving} className="gap-2" size="sm">
                <Save className="h-4 w-4" />
                <span className="inline">{saving ? "Saving" : "Save"}</span>
              </Button>
              <Button variant="outline" onClick={onLogout} className="gap-2" size="sm">
                <LogOut className="h-4 w-4" />
                <span className="inline">Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile nav popup */}
          <PopupModal open={mobileNav} onClose={() => setMobileNav(false)} title="Navigation">
            <div className="grid gap-1">
              {navItems.map((i) => (
                <button
                  key={i.key}
                  onClick={() => { setSection(i.key); setMobileNav(false); }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    section === i.key ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                  type="button"
                >
                  {i.icon}
                  {i.label}
                </button>
              ))}
            </div>
          </PopupModal>

          {/* Content grid */}
          <div className="mt-6 grid flex-1 min-h-0 gap-6 md:grid-cols-[240px_1fr]">
            {/* Desktop sidebar */}
            <aside className="hidden md:block self-start sticky top-6">
              <div className="rounded-xl border bg-cream-deep p-3">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Content
                </p>
                <div className="grid gap-1">
                  {navItems.map((i) => (
                    <button
                      key={i.key}
                      onClick={() => setSection(i.key)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        section === i.key ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                      }`}
                      type="button"
                    >
                      {i.icon}
                      {i.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <main className="min-w-0 overflow-y-auto pr-0 md:pr-1">
              {!content ? (
                <Card className="bg-cream-deep">
                  <CardHeader>
                    <CardTitle>Loading</CardTitle>
                    <CardDescription>Fetching editable content…</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <>
                  {section === "services" && (
                    <ServicesEditor items={content.services} onChange={(next) => setContent({ ...content, services: next })} />
                  )}
                  {section === "stats" && (
                    <StatsEditor items={content.stats} onChange={(next) => setContent({ ...content, stats: next })} />
                  )}
                  {section === "testimonials" && (
                    <TestimonialsEditor items={content.testimonials} onChange={(next) => setContent({ ...content, testimonials: next })} />
                  )}
                  {section === "gallery" && (
                    <GalleryEditor items={content.gallery} onChange={(next) => setContent({ ...content, gallery: next })} />
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

/* ------------------------------------------------------------------ */
/*  Image upload helper                                               */
/* ------------------------------------------------------------------ */
function ImageUpload({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const inputId = `img-${Math.random().toString(36).slice(2, 8)}`;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) onChange(result);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // reset so same file can be re-selected
  }

  return (
    <div className="grid gap-2">
      {/* Hidden native input */}
      <input id={inputId} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {value ? (
        <>
          <div className="overflow-hidden rounded-lg border bg-cream">
            <img src={value} alt="" className="h-40 w-full object-cover" />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => document.getElementById(inputId)?.click()}>
              <ImagePlus className="h-3.5 w-3.5" /> Change
            </Button>
            <Button type="button" variant="outline" size="sm" className="gap-1.5 text-destructive hover:bg-destructive/10" onClick={() => onChange("")}>
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => document.getElementById(inputId)?.click()}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-cream p-4 sm:p-6 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <ImagePlus className="h-5 w-5" />
          Add image
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Services editor                                                   */
/* ------------------------------------------------------------------ */
function ServicesEditor({ items, onChange }: { items: ServiceItem[]; onChange: (next: ServiceItem[]) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<ServiceItem, "id">>({ title: "", description: "", imageUrl: "", tag: "" });

  return (
    <Card className="bg-cream-deep">
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle>Services</CardTitle>
            <CardDescription>Add, edit, or remove service cards.</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add service
          </Button>
        </div>
      </CardHeader>

      <PopupModal open={open} onClose={() => setOpen(false)} title="New service" description="These fields will later map directly to your API and DB.">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input placeholder="e.g. University Admissions" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Brief description of this service…" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Image</label>
            <ImageUpload value={draft.imageUrl} onChange={(next) => setDraft({ ...draft, imageUrl: next })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tag (optional)</label>
            <Input placeholder="e.g. Most popular" value={draft.tag ?? ""} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => {
                const next: ServiceItem = { id: uid("service"), ...draft, tag: draft.tag || undefined };
                onChange([next, ...items]);
                setDraft({ title: "", description: "", imageUrl: "", tag: "" });
                setOpen(false);
              }}
              disabled={!draft.title || !draft.description}
            >
              Create
            </Button>
          </div>
        </div>
      </PopupModal>

      <CardContent>
        <div className="grid gap-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No services yet. Click &ldquo;Add service&rdquo; to create one.</p>
          ) : (
            items.map((s) => (
              <div key={s.id} className="rounded-xl border bg-cream p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-start">
                  <div className="grid gap-2">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input placeholder="Service title" value={s.title} onChange={(e) => onChange(items.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)))} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-medium text-muted-foreground">Tag</label>
                    <Input placeholder="Optional tag" value={s.tag ?? ""} onChange={(e) => onChange(items.map((x) => (x.id === s.id ? { ...x, tag: e.target.value || undefined } : x)))} />
                  </div>
                  <Button type="button" variant="destructive" onClick={() => onChange(items.filter((x) => x.id !== s.id))} className="md:mt-6">
                    Remove
                  </Button>
                </div>
                <div className="mt-3 grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <Textarea placeholder="Service description…" value={s.description} onChange={(e) => onChange(items.map((x) => (x.id === s.id ? { ...x, description: e.target.value } : x)))} />
                </div>
                <div className="mt-3 grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Image</label>
                  <ImageUpload value={s.imageUrl} onChange={(next) => onChange(items.map((x) => (x.id === s.id ? { ...x, imageUrl: next } : x)))} />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats editor                                                      */
/* ------------------------------------------------------------------ */
function StatsEditor({ items, onChange }: { items: StatItem[]; onChange: (next: StatItem[]) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<StatItem, "id">>({ value: 0, suffix: "+", label: "" });

  return (
    <Card className="bg-cream-deep">
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle>Stats</CardTitle>
            <CardDescription>Update the number cards and labels.</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add stat
          </Button>
        </div>
      </CardHeader>

      <PopupModal open={open} onClose={() => setOpen(false)} title="New stat" description="Displayed as a large value + label on the website.">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Value</label>
            <Input type="number" placeholder="e.g. 500" value={draft.value} onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Suffix</label>
            <Input placeholder="e.g. +" value={draft.suffix} onChange={(e) => setDraft({ ...draft, suffix: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Label</label>
            <Input placeholder="e.g. Students placed" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => {
                onChange([{ id: uid("stat"), ...draft }, ...items]);
                setDraft({ value: 0, suffix: "+", label: "" });
                setOpen(false);
              }}
              disabled={!draft.label}
            >
              Create
            </Button>
          </div>
        </div>
      </PopupModal>

      <CardContent>
        <div className="grid gap-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No stats yet.</p>
          ) : (
            items.map((s) => (
              <div key={s.id} className="grid gap-3 rounded-xl border bg-cream p-4 md:grid-cols-[140px_120px_1fr_auto] md:items-end">
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Value</label>
                  <Input type="number" placeholder="0" value={s.value} onChange={(e) => onChange(items.map((x) => (x.id === s.id ? { ...x, value: Number(e.target.value) } : x)))} />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Suffix</label>
                  <Input placeholder="+" value={s.suffix} onChange={(e) => onChange(items.map((x) => (x.id === s.id ? { ...x, suffix: e.target.value } : x)))} />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Label</label>
                  <Input placeholder="Label text" value={s.label} onChange={(e) => onChange(items.map((x) => (x.id === s.id ? { ...x, label: e.target.value } : x)))} />
                </div>
                <Button type="button" variant="destructive" onClick={() => onChange(items.filter((x) => x.id !== s.id))}>
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials editor                                               */
/* ------------------------------------------------------------------ */
function TestimonialsEditor({ items, onChange }: { items: TestimonialItem[]; onChange: (next: TestimonialItem[]) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<TestimonialItem, "id">>({ quote: "", name: "", role: "" });

  return (
    <Card className="bg-cream-deep">
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Manage customer quotes shown on the homepage.</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add testimonial
          </Button>
        </div>
      </CardHeader>

      <PopupModal open={open} onClose={() => setOpen(false)} title="New testimonial" description="Quote, name, and role/company.">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Quote</label>
            <Textarea placeholder="What the customer said…" value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="e.g. Jane Doe" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Role</label>
            <Input placeholder="e.g. MSc, University of Toronto" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => {
                onChange([{ id: uid("tt"), ...draft }, ...items]);
                setDraft({ quote: "", name: "", role: "" });
                setOpen(false);
              }}
              disabled={!draft.quote || !draft.name}
            >
              Create
            </Button>
          </div>
        </div>
      </PopupModal>

      <CardContent>
        <div className="grid gap-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No testimonials yet.</p>
          ) : (
            items.map((t) => (
              <div key={t.id} className="rounded-xl border bg-cream p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <Input placeholder="Customer name" value={t.name} onChange={(e) => onChange(items.map((x) => (x.id === t.id ? { ...x, name: e.target.value } : x)))} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-xs font-medium text-muted-foreground">Role</label>
                    <Input placeholder="Role / company" value={t.role} onChange={(e) => onChange(items.map((x) => (x.id === t.id ? { ...x, role: e.target.value } : x)))} />
                  </div>
                </div>
                <div className="mt-3 grid gap-2">
                  <label className="text-xs font-medium text-muted-foreground">Quote</label>
                  <Textarea placeholder="Customer quote…" value={t.quote} onChange={(e) => onChange(items.map((x) => (x.id === t.id ? { ...x, quote: e.target.value } : x)))} />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="button" variant="destructive" onClick={() => onChange(items.filter((x) => x.id !== t.id))}>
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Gallery editor                                                    */
/* ------------------------------------------------------------------ */
function GalleryEditor({ items, onChange }: { items: GalleryItem[]; onChange: (next: GalleryItem[]) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Omit<GalleryItem, "id">>({ title: "", imageUrl: "", alt: "" });

  return (
    <Card className="bg-cream-deep">
      <CardHeader>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>Manage your gallery items (images + titles).</CardDescription>
          </div>
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        </div>
      </CardHeader>

      <PopupModal open={open} onClose={() => setOpen(false)} title="New gallery item" description="Prepare fields for your future media/API integration.">
        <div className="grid gap-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input placeholder="e.g. Student Success" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Image</label>
            <ImageUpload value={draft.imageUrl} onChange={(next) => setDraft({ ...draft, imageUrl: next })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Alt text</label>
            <Input placeholder="Describe the image…" value={draft.alt} onChange={(e) => setDraft({ ...draft, alt: e.target.value })} />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => {
                onChange([{ id: uid("gallery"), ...draft }, ...items]);
                setDraft({ title: "", imageUrl: "", alt: "" });
                setOpen(false);
              }}
              disabled={!draft.title}
            >
              Create
            </Button>
          </div>
        </div>
      </PopupModal>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground sm:col-span-full">No gallery items yet.</p>
          ) : (
            items.map((g) => (
              <div key={g.id} className="rounded-xl border bg-cream overflow-hidden">
                {/* Image area */}
                <div className="aspect-[4/3] bg-cream-deep">
                  <ImageUpload value={g.imageUrl} onChange={(next) => onChange(items.map((x) => (x.id === g.id ? { ...x, imageUrl: next } : x)))} />
                </div>
                {/* Fields */}
                <div className="p-4 grid gap-3">
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input placeholder="Item title" value={g.title} onChange={(e) => onChange(items.map((x) => (x.id === g.id ? { ...x, title: e.target.value } : x)))} />
                  </div>
                  <div className="grid gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Alt text</label>
                    <Input placeholder="Describe the image…" value={g.alt} onChange={(e) => onChange(items.map((x) => (x.id === g.id ? { ...x, alt: e.target.value } : x)))} />
                  </div>
                  <div className="flex justify-end pt-1">
                    <Button type="button" variant="destructive" size="sm" onClick={() => onChange(items.filter((x) => x.id !== g.id))}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
