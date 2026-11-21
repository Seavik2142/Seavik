"use client";

import React from "react";
import Link from "next/link";
import { Send, ArrowLeft, Sparkles } from "lucide-react";
import { playSoftClick } from "../lib/sound";

export default function WorkCTA() {
  return (
    <section className="screen-line-top screen-line-bottom relative border-x border-[var(--line)] p-6 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="font-mono text-xs font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
            // HAVE A PROJECT IN MIND?
          </div>
          <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)] sm:text-2xl">
            Let&apos;s build something intelligent &amp; useful.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Available for Machine Learning engineering, data science pipelines, and full-stack software systems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/#contact"
            onClick={() => playSoftClick()}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--foreground)] px-4 font-mono text-xs font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-95"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Hire Me →</span>
          </Link>

          <Link
            href="/"
            onClick={() => playSoftClick()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--border)] bg-zinc-50 px-3.5 font-mono text-xs font-medium text-[var(--foreground)] transition-all hover:bg-[var(--muted-bg)] active:scale-95 dark:bg-zinc-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Overview</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
