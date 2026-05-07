"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Placeholder — skip real auth, just stash a dummy token and redirect
    setTimeout(() => {
      window.localStorage.setItem("rentsmiths_auth_token", "dev-token");
      router.replace("/dashboard");
    }, 600);
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-cream-deep/60 backdrop-blur-sm p-8 shadow-soft">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg font-bold">
              R
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Rentsmiths</span>
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your website content.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={onSubmit}>
            <div className="grid gap-1.5">
              <label htmlFor="login-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@rentsmiths.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-cream pl-10 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="login-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-cream pl-10 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground text-sm transition-colors hover:bg-primary-deep disabled:opacity-60"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Signing in…
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <p className="mt-1 text-center text-xs text-muted-foreground/60">
              Placeholder login — any credentials will work for now.
            </p>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
