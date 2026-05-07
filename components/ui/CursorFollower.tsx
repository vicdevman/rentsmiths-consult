"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const raf = useRef<number | null>(null);

  const [scale, setScale] = useState(1);
  const [color, setColor] = useState("var(--primary)");
  const [visible, setVisible] = useState(true);
  const hoveredRef = useRef<HTMLElement | null>(null);

  const baseSize = 16; // small by default

  const findTextElement = (start: Element | null): HTMLElement | null => {
    let el: HTMLElement | null = (start as HTMLElement) || null;
    for (let i = 0; i < 6 && el; i++) {
      const txt = el.textContent?.trim() ?? "";
      const tag = el.tagName;
      const cs = window.getComputedStyle(el);
      if (
        txt.length > 0 &&
        !["IMG", "SVG", "PATH", "PICTURE", "BUTTON", "INPUT", "TEXTAREA", "SELECT"].includes(tag) &&
        cs.visibility !== "hidden" &&
        cs.display !== "none" &&
        Number.parseFloat(cs.opacity || "1") > 0
      ) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onPointerOver = (e: PointerEvent) => {
      const dataEl = (e.target as Element).closest?.("[data-cursor]") as HTMLElement | null;
      if (dataEl) {
        const t = dataEl.dataset.cursor ?? "interactive";
        if (t === "hide") {
          hoveredRef.current = null;
          setVisible(false);
          return;
        }
        setVisible(true);
        setScale(dataEl.dataset.cursorScale ? Number(dataEl.dataset.cursorScale) : 1.8);
        setColor(dataEl.dataset.cursorColor ?? "var(--primary)");
        hoveredRef.current = dataEl;
        return;
      }

      // no data-cursor: detect text-like element and enable inversion
      const textEl = findTextElement(e.target as Element);
      if (textEl) {
        const fs = parseFloat(window.getComputedStyle(textEl).fontSize || "16");
        const tag = textEl.tagName;
        // Only grow for headings or sufficiently large text
        if (tag.startsWith("H") || fs >= 22) {
          hoveredRef.current = textEl;
          setVisible(true);
          setScale(4);
          setColor("white");
        } else if (fs >= 18) {
          hoveredRef.current = textEl;
          setVisible(true);
          setScale(3);
          setColor("white");
        }
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      const related = e.relatedTarget as Node | null;
      if (hoveredRef.current) {
        if (!related || !hoveredRef.current.contains(related as Node)) {
          hoveredRef.current = null;
          setScale(1);
          setColor("var(--primary)");
          setVisible(true);
        }
      }
    };

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      setPos({ x: current.current.x, y: current.current.y });
      raf.current = window.requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onPointerOver);
    window.addEventListener("pointerout", onPointerOut);
    raf.current = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  const isInversion = color === "white" || color === "#fff";
  const blend = isInversion ? ("difference" as const) : ("normal" as const);
  const bg = isInversion ? "white" : color;

  const size = baseSize * scale;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        mixBlendMode: blend,
        zIndex: 9999,
        pointerEvents: "none",
        transition:
          "width 200ms cubic-bezier(.2,.9,.3,1), height 200ms cubic-bezier(.2,.9,.3,1), opacity 120ms ease, transform 140ms cubic-bezier(.2,.9,.3,1), background 120ms ease",
        boxShadow: isInversion ? undefined : "0 6px 20px rgba(0,0,0,0.12)",
        border: isInversion ? undefined : "2px solid var(--primary)",
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
