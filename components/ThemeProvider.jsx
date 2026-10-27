"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { flushSync } from "react-dom";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [clipStyle, setClipStyle] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || (!stored && matchMedia("(prefers-color-scheme: dark)").matches)) {
        setDark(true);
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const applyTheme = (next) => {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const toggleTheme = (e) => {
    if (animating) return;
    const next = !dark;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Preferred path: native View Transitions — animates the real
    // old/new DOM snapshots instead of a stand-in colored overlay.
    if (document.startViewTransition) {
      // Drive the wipe declaratively via a CSS @keyframes animation
      // (see .vt-wipe-active::view-transition-old(root) in globals.css)
      // instead of an imperative document.documentElement.animate() call.
      // The imperative version races against the browser's own
      // view-transition lifecycle — the pseudo-element tree can get torn
      // down slightly out of sync with a separately-scheduled Animation,
      // which shows up as a whole-screen snap/blink right at the end of
      // the wipe. A real CSS animation tied to a class, started in the
      // same tick as startViewTransition(), is what the transition's
      // `finished` promise is actually designed to track.
      document.documentElement.style.setProperty("--vt-x", `${x}px`);
      document.documentElement.style.setProperty("--vt-y", `${y}px`);
      document.documentElement.style.setProperty("--vt-r", `${maxRadius}px`);
      document.documentElement.classList.add("vt-disable-anim", "vt-wipe-active");

      const transition = document.startViewTransition(() => {
        flushSync(() => applyTheme(next));
      });

      transition.finished.then(() => {
        document.documentElement.classList.remove("vt-disable-anim", "vt-wipe-active");
      });
      return;
    }

    // Fallback for browsers without View Transitions support
    setAnimating(true);
    const targetBg = next ? "#0f1115" : "#D9DADD";
    setClipStyle({
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      pointerEvents: "none",
      background: targetBg,
      clipPath: `circle(0px at ${x}px ${y}px)`,
      transition: `clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1)`,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setClipStyle((prev) => ({
          ...prev,
          clipPath: `circle(${maxRadius}px at ${x}px ${y}px)`,
        }));
      });
    });

    setTimeout(() => {
      applyTheme(next);
      setTimeout(() => {
        setClipStyle({});
        setAnimating(false);
      }, 50);
    }, 500);
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
      {animating && (
        <div className="theme-transition-circle" style={clipStyle} aria-hidden="true" />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}