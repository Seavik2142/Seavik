"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { playSoftClick } from "../lib/sound";

export default function ThemeToggle({ className = "", style }) {
  const { toggleTheme } = useTheme();
  const btnRef = useRef(null);

  const handleToggle = (e) => {
    playSoftClick();
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
        playSoftClick();
        toggleTheme({ currentTarget: btnRef.current });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleTheme]);

  return (
    <button
      ref={btnRef}
      type="button"
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--foreground)]/80 transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] ${className}`}
      onClick={handleToggle}
      aria-label="Toggle mode (D)"
      title="Toggle theme (D)"
      style={style}
    >
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M16 .5C7.4.5.5 7.4.5 16S7.4 31.5 16 31.5 31.5 24.6 31.5 16 24.6.5 16 .5zm0 28.1V3.4C23 3.4 28.6 9 28.6 16S23 28.6 16 28.6z"
          className="origin-center transition-transform duration-500 ease-out dark:rotate-180"
        />
      </svg>
    </button>
  );
}
