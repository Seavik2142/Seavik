"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ExternalLink,
  Eye,
  FileText,
  Search,
  Layers,
  LayoutGrid,
  List,
  Trophy,
  ArrowLeft,
  ArrowUpRight,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import MediaModal from "./MediaModal";
import { isPdf, safeMediaUrl, getFormatLabel } from "../lib/media";
import {
  playSoftClick,
  playTickClick,
  playExpandSound,
  playCollapseSound,
  playMiniMapOpen,
} from "../lib/sound";

export const TECH_LOGOS = {
  Python: "/images/logos/python.png",
  "Python Flask": "/images/logos/flask.png",
  Flask: "/images/logos/flask.png",
  "Python Django": "/images/logos/django.png",
  FastAPI: "/images/logos/fastapi.svg",
  PyTorch: "/images/logos/pytorch.svg",
  TensorFlow: "/images/logos/tensorflow.svg",
  "Hugging Face": "/images/logos/huggingface.svg",
  LangChain: "/images/logos/langchain.svg",
  NumPy: "/images/logos/numpy.svg",
  Pandas: "/images/logos/pandas.svg",
  "Scikit-learn": "/images/logos/scikitlearn.svg",
  Matplotlib: "/images/logos/matplotlib.svg",
  Jupyter: "/images/logos/jupyter.svg",
  Streamlit: "/images/logos/streamlit.svg",
  PostgreSQL: "/images/logos/postgresql.svg",
  MySQL: "/images/logos/mysql.svg",
  Docker: "/images/workspace/docker.svg",
  React: "/images/logos/react.png",
  JavaScript: "/images/logos/js.png",
  PHP: "/images/logos/php.png",
  Laravel: "/images/logos/laravel.svg",
  "Vue.js": "/images/logos/vue.svg",
  "Vue 3": "/images/logos/vue.svg",
  HTML: "/images/logos/html.png",
  CSS: "/images/logos/css.png",
};

function DimensionArrow({ orientation = "horizontal", flip = false }) {
  const isVertical = orientation === "vertical";
  return (
    <svg
      className={`shrink-0 ${flip ? (isVertical ? "-scale-y-100" : "-scale-x-100") : ""}`}
      width={isVertical ? 7 : 9}
      height={isVertical ? 9 : 7}
      viewBox={isVertical ? "0 0 7 9" : "0 0 9 7"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinejoin="round"
    >
      <path d={isVertical ? "M3.5.5 6.5 8.5h-6Z" : "M.5 3.5 8.5.5v6Z"} />
    </svg>
  );
}

export function FrameWidthDimension() {
  return (
    <div
      className="pointer-events-none relative hidden h-8 border-x border-[var(--line)] text-[var(--dimension)] select-none md:block"
      aria-hidden="true"
    >
      <div className="absolute inset-y-1 left-0 w-px bg-current" />
      <div className="absolute inset-y-1 right-0 w-px bg-current" />
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center px-px">
        <DimensionArrow orientation="horizontal" />
        <div className="h-px flex-1 bg-current" />
        <span className="px-1.5 font-mono text-xs leading-none text-[var(--dimension-foreground)] tabular-nums">
          768
        </span>
        <div className="h-px flex-1 bg-current" />
        <DimensionArrow orientation="horizontal" flip />
      </div>
    </div>
  );
}

function AnimatedChevronsUpDown({ isOpen }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]"
      aria-hidden="true"
    >
      <path
        d={isOpen ? "M7 20L12 15L17 20" : "M7 15L12 20L17 15"}
        className="transition-all duration-200 ease-out"
      />
      <path
        d={isOpen ? "M7 4L12 9L17 4" : "M7 9L12 4L17 9"}
        className="transition-all duration-200 ease-out"
      />
    </svg>
  );
}

function TechTag({ tech }) {
  const logo = TECH_LOGOS[tech];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-zinc-50 px-2 py-0.5 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--foreground)]/30 hover:text-[var(--foreground)] dark:bg-zinc-900">
      {logo && (
        <img
          src={logo}
          alt={tech}
          className="h-3.5 w-3.5 shrink-0 object-contain"
          draggable={false}
        />
      )}
      <span>{tech}</span>
    </span>
  );
}

export default function TechnicalArchive({ projects = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid"
  const [expandedMap, setExpandedMap] = useState(() => ({
    "01": true,
    "02": true,
  }));
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const openMedia = useCallback((project) => {
    playMiniMapOpen();
    const url = project.image || project.file || "";
    setSelectedMedia({
      url,
      title: project.title,
      subtitle: project.category,
    });
    setIsMediaModalOpen(true);
  }, []);

  const toggleRow = useCallback((num) => {
    setExpandedMap((prev) => {
      const next = !prev[num];
      if (next) playExpandSound();
      else playCollapseSound();
      return { ...prev, [num]: next };
    });
  }, []);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      if (activeCategory === "ML & AI" && !p.category.toLowerCase().includes("ai")) {
        return false;
      }
      if (
        activeCategory === "WEB & BACKEND" &&
        p.category.toLowerCase().includes("ai")
      ) {
        return false;
      }
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, searchQuery, activeCategory]);

  const allExpanded =
    filteredProjects.length > 0 &&
    filteredProjects.every((p) => !!expandedMap[p.num]);

  const toggleExpandAll = () => {
    if (allExpanded) {
      playCollapseSound();
      setExpandedMap({});
    } else {
      playExpandSound();
      const next = {};
      filteredProjects.forEach((p) => {
        next[p.num] = true;
      });
      setExpandedMap(next);
    }
  };

  return (
    <>
      <section
        id="technical"
        className="screen-line-top screen-line-bottom relative border-x border-[var(--line)]"
      >
        {/* Top Breadcrumb & Archive Header */}
        <div className="screen-line-bottom flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-zinc-50/40 dark:bg-zinc-900/30">
          <Link
            href="/"
            onClick={() => playSoftClick()}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-[var(--muted-foreground)]">
            <span>// archive/technical-projects.md</span>
          </div>
        </div>

        {/* Title & Description Block */}
        <div className="screen-line-bottom p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
                Technical Projects
              </h1>
              <sup className="font-mono text-xs font-medium text-[var(--muted-foreground)]">
                ({filteredProjects.length})
              </sup>
            </div>

            {/* View Switcher (List vs Grid) + Expand All */}
            <div className="flex items-center gap-1.5">
              {viewMode === "list" && (
                <button
                  type="button"
                  onClick={toggleExpandAll}
                  className="rounded-md border border-[var(--border)] bg-zinc-50 px-2.5 py-1 font-mono text-[11px] text-[var(--muted-foreground)] transition-all duration-150 hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] active:scale-95 dark:bg-zinc-900"
                >
                  {allExpanded ? "Collapse All" : "Expand All"}
                </button>
              )}

              <div className="inline-flex rounded-lg border border-[var(--border)] bg-zinc-50 p-0.5 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => {
                    playTickClick();
                    setViewMode("list");
                  }}
                  title="CAD Blueprint List View"
                  className={`inline-flex h-6 items-center gap-1 rounded-md px-2 font-mono text-[11px] transition-all ${
                    viewMode === "list"
                      ? "bg-[var(--foreground)] text-[var(--background)] font-medium"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <List className="h-3 w-3" />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playTickClick();
                    setViewMode("grid");
                  }}
                  title="Visual Grid View"
                  className={`inline-flex h-6 items-center gap-1 rounded-md px-2 font-mono text-[11px] transition-all ${
                    viewMode === "grid"
                      ? "bg-[var(--foreground)] text-[var(--background)] font-medium"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <LayoutGrid className="h-3 w-3" />
                  <span>Grid</span>
                </button>
              </div>
            </div>
          </div>

          <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
            A complete engineering archive of my Machine Learning systems, fine-tuned LLM weights, data science pipelines, and full-stack web applications.
          </p>

          {/* Interactive Search & Category Filter Bar */}
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by project, PyTorch, FastAPI, Hugging Face…"
                className="h-8 w-full rounded-lg border border-[var(--border)] bg-zinc-50/70 pr-3 pl-8 font-mono text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--foreground)]/50 dark:bg-zinc-900/70"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {["ALL", "ML & AI", "WEB & BACKEND"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playTickClick();
                    setActiveCategory(cat);
                  }}
                  className={`h-8 rounded-lg px-3 font-mono text-xs transition-all duration-150 active:scale-95 ${
                    activeCategory === cat
                      ? "bg-[var(--foreground)] font-medium text-[var(--background)]"
                      : "border border-[var(--border)] bg-zinc-50/60 text-[var(--muted-foreground)] hover:text-[var(--foreground)] dark:bg-zinc-900/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="p-10 text-center font-mono text-sm text-[var(--muted-foreground)]">
            No matching technical projects found for &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : viewMode === "list" ? (
          /* ==================================================================
             VIEW MODE 1: CHANHDAI INTERACTIVE COLLAPSIBLE ACCORDION LIST
             ================================================================== */
          <ul>
            {filteredProjects.map((project) => {
              const isOpen = !!expandedMap[project.num];
              const mediaUrl = project.image || project.file || "";
              const formatLabel = getFormatLabel(mediaUrl);

              return (
                <li
                  key={project.num}
                  className="border-b border-[var(--line)] last:border-b-0"
                >
                  <div className="relative flex items-center transition-colors hover:bg-[var(--accent-muted)]">
                    <div className="mx-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--muted-foreground)]/15 bg-[var(--muted-bg)] font-mono text-[10px] font-semibold text-[var(--muted-foreground)] ring-1 ring-[var(--border)]/60 ring-offset-1 ring-offset-[var(--background)] select-none sm:mx-4">
                      {project.num}
                    </div>

                    <div className="flex min-w-0 flex-1 items-center gap-1.5 border-l border-dashed border-[var(--line)] p-3 sm:gap-2 sm:p-4">
                      <button
                        type="button"
                        onClick={() => toggleRow(project.num)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="mb-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h3 className="text-sm font-medium leading-snug text-[var(--foreground)] sm:text-base">
                            {project.title}
                          </h3>
                          {project.awards && project.awards.length > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-600 dark:text-amber-400">
                              <Trophy className="h-2.5 w-2.5" />
                              {project.awards[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-[var(--muted-foreground)] sm:text-xs">
                          <span>{project.category}</span>
                          <span className="hidden sm:inline">·</span>
                          <span className="truncate">{project.tech.slice(0, 3).join(", ")}</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => openMedia(project)}
                        title={`Preview ${formatLabel}`}
                        className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] active:scale-95 sm:flex"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playSoftClick()}
                        title="Open repository / live system"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] active:scale-95"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </a>

                      <button
                        type="button"
                        onClick={() => toggleRow(project.num)}
                        aria-label="Toggle project details"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)]"
                      >
                        <AnimatedChevronsUpDown isOpen={isOpen} />
                      </button>
                    </div>
                  </div>

                  {/* Smooth 0fr -> 1fr Collapsible Drawer */}
                  <div
                    className="cd-collapsible-drawer"
                    data-open={isOpen ? "true" : "false"}
                  >
                    <div className="cd-collapsible-inner">
                      <div className="space-y-4 border-t border-[var(--line)] bg-zinc-50/30 p-4 dark:bg-zinc-900/20">
                        <div className="grid gap-4 sm:grid-cols-[210px_1fr]">
                          <button
                            type="button"
                            onClick={() => openMedia(project)}
                            className="group/pimg relative aspect-video sm:aspect-[16/10] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted-bg)] text-left"
                          >
                            <img
                              src={safeMediaUrl(mediaUrl)}
                              alt={project.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover/pimg:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = "/images/profile.png";
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover/pimg:opacity-100">
                              <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 font-mono text-[10px] text-white">
                                <Eye className="h-3 w-3" /> Preview {formatLabel}
                              </span>
                            </div>
                          </button>

                          <div className="flex flex-col justify-between space-y-3">
                            <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
                              {project.desc}
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                              {project.tech.map((t) => (
                                <TechTag key={t} tech={t} />
                              ))}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => openMedia(project)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-mono text-xs text-[var(--foreground)] transition-all hover:bg-[var(--muted-bg)] active:scale-95"
                              >
                                <Eye className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                                <span>Preview Media</span>
                              </button>

                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playSoftClick()}
                                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--foreground)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-95"
                              >
                                <span>{project.linkText || "View Project →"}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          /* ==================================================================
             VIEW MODE 2: VISUAL CAD BENTO GRID
             ================================================================== */
          <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
            {filteredProjects.map((project) => {
              const mediaUrl = project.image || project.file || "";
              const isDocPdf = isPdf(mediaUrl);
              const formatLabel = getFormatLabel(mediaUrl);

              return (
                <div
                  key={project.num}
                  className="group/card flex flex-col justify-between bg-[var(--background)] p-4 transition-colors hover:bg-zinc-50/40 dark:hover:bg-zinc-900/30"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => openMedia(project)}
                      className="group/img relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted-bg)] text-left"
                    >
                      {isDocPdf ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--muted-foreground)]">
                          <FileText className="h-10 w-10" />
                          <span className="font-mono text-xs">
                            Preview {formatLabel}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={safeMediaUrl(mediaUrl)}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/images/profile.png";
                          }}
                        />
                      )}
                      <span className="absolute top-2 right-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-xs">
                        {formatLabel}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/img:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/85 px-3 py-1 font-mono text-xs text-white">
                          <Eye className="h-3.5 w-3.5" /> Inspect Media
                        </span>
                      </div>
                    </button>

                    <div className="mb-1 flex items-center justify-between gap-2 font-mono text-xs text-[var(--muted-foreground)]">
                      <span className="rounded border border-[var(--border)] bg-[var(--muted-bg)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--foreground)]">
                        #{project.num}
                      </span>
                      <span className="truncate">{project.category}</span>
                    </div>

                    <h3 className="mb-1.5 text-base font-medium tracking-tight text-[var(--foreground)]">
                      {project.title}
                    </h3>

                    <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
                      {project.desc}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-dashed border-[var(--line)] pt-3">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((t) => (
                        <TechTag key={t} tech={t} />
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openMedia(project)}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-xs text-[var(--foreground)] transition-all hover:bg-[var(--muted-bg)] active:scale-95"
                      >
                        <Eye className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <span>Preview</span>
                      </button>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playSoftClick()}
                        className="inline-flex items-center gap-1 rounded-md bg-[var(--foreground)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-95"
                      >
                        <span>{project.linkText || "Open →"}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        media={selectedMedia}
      />
    </>
  );
}
