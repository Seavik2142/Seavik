"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { playSoftClick } from "../lib/sound";

export default function ThemeToggle({ className = "", style }) {
  const { dark, toggleTheme } = useTheme();
  const btnRef = useRef(null);
  const rawId = useId();
  const maskId = `theme-eclipse-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [morphKey, setMorphKey] = useState(0);
  const [rippleKey, setRippleKey] = useState(0);

  const triggerToggle = (e) => {
    playSoftClick();
    setMorphKey((k) => k + 1);
    setRippleKey((k) => k + 1);
    toggleTheme(e);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (
        e.key.toLowerCase() === "d" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        document.activeElement &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
      ) {
        triggerToggle({ currentTarget: btnRef.current });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleTheme]);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={triggerToggle}
      aria-label="Toggle mode (D)"
      title={dark ? "Switch to Light Mode (D)" : "Switch to Dark Mode (D)"}
      style={style}
      className={`group/theme relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg text-zinc-700 transition-all duration-200 hover:bg-amber-500/10 hover:text-amber-600 active:scale-90 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 sm:h-7 sm:w-7 dark:text-zinc-300 dark:hover:bg-indigo-400/15 dark:hover:text-indigo-200 ${className}`}
    >
      {/* Ambient Pulse Ring on Toggle */}
      {rippleKey > 0 && (
        <span
          key={`ripple-${rippleKey}`}
          aria-hidden="true"
          className="animate-theme-ripple pointer-events-none absolute inset-1 rounded-full border border-amber-500/50 dark:border-indigo-300/50"
        />
      )}

      {/* Light Mode: Radiant Solar Disk + Animated Expanding Rays */}
      <span
        key={morphKey > 0 && !dark ? `sun-${morphKey}` : "sun-static"}
        className={`inline-flex items-center justify-center dark:hidden ${
          morphKey > 0 && !dark ? "animate-theme-sun-enter" : ""
        }`}
      >
        <svg
          className="h-[17px] w-[17px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/theme:rotate-[22.5deg] group-hover/theme:scale-105"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Crisp Solar Core */}
          <circle
            cx="12"
            cy="12"
            r="4.5"
            fill="currentColor"
            style={{ transformOrigin: "12px 12px" }}
            className="transition-transform duration-300 group-hover/theme:scale-95"
          />
          {/* 8 Geometric Sunbeams */}
          <g
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            style={{ transformOrigin: "12px 12px" }}
            className={`transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/theme:scale-110 ${
              morphKey > 0 && !dark ? "animate-theme-rays-bloom" : ""
            }`}
          >
            <line x1="12" y1="2.2" x2="12" y2="4.4" />
            <line x1="12" y1="19.6" x2="12" y2="21.8" />
            <line x1="2.2" y1="12" x2="4.4" y2="12" />
            <line x1="19.6" y1="12" x2="21.8" y2="12" />
            <line x1="5.07" y1="5.07" x2="6.63" y2="6.63" />
            <line x1="17.37" y1="17.37" x2="18.93" y2="18.93" />
            <line x1="5.07" y1="18.93" x2="6.63" y2="17.37" />
            <line x1="17.37" y1="6.63" x2="18.93" y2="5.07" />
          </g>
        </svg>
      </span>

      {/* Dark Mode: Sculpted SVG Eclipse Crescent Moon + Twinkling Micro-Stars */}
      <span
        key={morphKey > 0 && dark ? `moon-${morphKey}` : "moon-static"}
        className={`hidden items-center justify-center dark:inline-flex ${
          morphKey > 0 && dark ? "animate-theme-moon-enter" : ""
        }`}
      >
        <svg
          className="h-[17px] w-[17px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/theme:-rotate-12 group-hover/theme:scale-105"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <mask id={maskId}>
              <rect x="0" y="0" width="24" height="24" fill="white" />
              <circle cx="16.2" cy="8.1" r="6.1" fill="black" />
            </mask>
          </defs>

          {/* Eclipse-Masked Crescent Body */}
          <circle
            cx="11.4"
            cy="12.4"
            r="7.4"
            fill="currentColor"
            mask={`url(#${maskId})`}
          />

          {/* Primary 4-Point Twinkling Sparkle Star */}
          <path
            d="M18.6 3.4L19.15 4.85L20.6 5.4L19.15 5.95L18.6 7.4L18.05 5.95L16.6 5.4L18.05 4.85Z"
            fill="currentColor"
            style={{ transformOrigin: "18.6px 5.4px" }}
            className={`theme-star-twinkle-1 ${
              morphKey > 0 && dark ? "animate-theme-star-pop-1" : ""
            }`}
          />

          {/* Secondary Micro-Star */}
          <circle
            cx="15.2"
            cy="3.6"
            r="0.95"
            fill="currentColor"
            style={{ transformOrigin: "15.2px 3.6px" }}
            className={`theme-star-twinkle-2 ${
              morphKey > 0 && dark ? "animate-theme-star-pop-2" : ""
            }`}
          />
        </svg>
      </span>
    </button>
  );
}
