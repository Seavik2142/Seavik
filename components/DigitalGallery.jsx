"use client";

import React, { useState, useCallback } from "react";
import { FileText, Eye, Sparkles, ArrowUpRight } from "lucide-react";
import MediaModal from "./MediaModal";
import { isPdf, safeMediaUrl, getFormatLabel } from "../lib/media";
import { playMiniMapOpen, playSoftClick } from "../lib/sound";

export default function DigitalGallery({ projects = [] }) {
  const [hero, ...rest] = projects;
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const openMedia = useCallback((project) => {
    playMiniMapOpen();
    const url = project.image || project.file || "";
    setSelectedMedia({
      url,
      title: project.title,
      subtitle: project.category || "Digital Project",
    });
    setIsMediaModalOpen(true);
  }, []);

  if (!projects.length) return null;

  return (
    <>
      <section
        id="digital"
        className="screen-line-top screen-line-bottom relative border-x border-[var(--line)]"
      >
        {/* Header */}
        <header className="screen-line-bottom flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
              Beyond Code — Digital Projects
            </h2>
            <sup className="font-mono text-xs font-medium text-[var(--muted-foreground)]">
              ({projects.length})
            </sup>
          </div>
          <span className="font-mono text-xs text-[var(--muted-foreground)]">
            // creative &amp; digital archive
          </span>
        </header>

        {/* Featured Hero Digital Project */}
        {hero && (
          <div className="screen-line-bottom p-4">
            <div
              onClick={() => openMedia(hero)}
              className="group/hero grid cursor-pointer gap-4 rounded-xl border border-[var(--border)] bg-zinc-50/40 p-3 transition-all duration-200 hover:border-zinc-900/40 hover:bg-zinc-100/70 dark:hover:border-white/35 dark:hover:bg-zinc-900/70 sm:grid-cols-[1.25fr_1fr] sm:p-4 dark:bg-zinc-900/30"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted-bg)]">
                <img
                  src={safeMediaUrl(hero.image || hero.file || "")}
                  alt={hero.title}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/hero:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/images/profile.png";
                  }}
                />
                <span className="absolute top-2.5 right-2.5 rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                  {getFormatLabel(hero.image || hero.file || "")}
                </span>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/hero:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 px-3 py-1 font-mono text-xs text-white">
                    <Eye className="h-3.5 w-3.5" /> Click to Preview
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-3">
                <div>
                  <div className="mb-2 flex items-center justify-between font-mono text-xs text-[var(--muted-foreground)]">
                    <span className="rounded border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 font-semibold text-[var(--foreground)]">
                      #{hero.num} · FEATURED
                    </span>
                    <span>{hero.category}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-medium tracking-tight text-[var(--foreground)] sm:text-xl">
                    {hero.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {hero.desc}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-[var(--line)] pt-3">
                  <div className="flex flex-wrap gap-1">
                    {hero.tech?.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted-foreground)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[var(--foreground)]">
                    <Eye className="h-3.5 w-3.5" /> Inspect →
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remaining Digital Projects Grid */}
        <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
          {rest.map((project) => {
            const url = project.image || project.file || "";
            const isDocPdf = isPdf(url);
            const formatLabel = getFormatLabel(url);

            return (
              <div
                key={project.num}
                onClick={() => openMedia(project)}
                className="group/dcard flex cursor-pointer flex-col justify-between bg-[var(--background)] p-4 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
              >
                <div>
                  <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted-bg)]">
                    {isDocPdf ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-100/80 text-[var(--muted-foreground)] dark:bg-zinc-900/80">
                        <FileText className="h-10 w-10 text-red-500/80" />
                        <span className="font-mono text-xs font-medium text-[var(--foreground)]">
                          Click to Preview PDF Document
                        </span>
                      </div>
                    ) : (
                      <img
                        src={safeMediaUrl(url)}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/dcard:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/images/profile.png";
                        }}
                      />
                    )}
                    <span className="absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                      {formatLabel}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/dcard:opacity-100">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 px-3 py-1 font-mono text-xs text-white">
                        <Eye className="h-3.5 w-3.5" /> View {formatLabel}
                      </span>
                    </div>
                  </div>

                  <div className="mb-1 flex items-center justify-between font-mono text-xs text-[var(--muted-foreground)]">
                    <span className="font-semibold text-[var(--foreground)]">
                      #{project.num}
                    </span>
                    <span>{project.category}</span>
                  </div>

                  <h3 className="mb-1.5 text-base font-medium tracking-tight text-[var(--foreground)]">
                    {project.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {project.desc}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-dashed border-[var(--line)] pt-2.5 font-mono text-xs">
                  <div className="flex flex-wrap gap-1">
                    {project.tech?.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[var(--foreground)] group-hover/dcard:underline">
                    <span>Preview</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        media={selectedMedia}
      />
    </>
  );
}
