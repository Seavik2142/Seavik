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
      const isDark =
        stored === "dark" ||
        (!stored && matchMedia("(prefers-color-scheme: dark)").matches);
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
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
    const btn =
      (e && e.currentTarget && typeof e.currentTarget.getBoundingClientRect === "function"
        ? e.currentTarget
        : null) ||
      document.querySelector('[aria-label="Toggle mode (D)"]');
    const rect = btn ? btn.getBoundingClientRect() : null;
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 24;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Preferred path: native View Transitions — animates the real
    // old/new DOM snapshots instead of a stand-in colored overlay.
    if (typeof document.startViewTransition === "function") {
      document.documentElement.style.setProperty("--vt-x", `${x}px`);
      document.documentElement.style.setProperty("--vt-y", `${y}px`);
      document.documentElement.style.setProperty("--vt-r", `${maxRadius}px`);
      document.documentElement.classList.add("vt-disable-anim", "vt-wipe-active");

      try {
        const transition = document.startViewTransition(() => {
          flushSync(() => applyTheme(next));
        });

        transition.finished.finally(() => {
          document.documentElement.classList.remove("vt-disable-anim", "vt-wipe-active");
        });
      } catch {
        applyTheme(next);
        document.documentElement.classList.remove("vt-disable-anim", "vt-wipe-active");
      }
      return;
    }

    // Fallback for browsers without View Transitions support
    setAnimating(true);
    const targetBg = next ? "#09090b" : "#ffffff";
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
    <ThemeContext.Provider value={{ dark, theme: dark ? "dark" : "light", toggleTheme }}>
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