"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Menu,
  X,
  ArrowUp,
  ArrowUpRight,
  Coffee,
  Search,
  Github,
  Sparkles,
  Linkedin,
  Mail,
  FileText,
  Layers,
  Briefcase,
  GraduationCap,
  Box,
  Award,
  User,
  Sun,
  Moon,
  CornerDownLeft,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { PROJECTS } from "../lib/projects";
import { CERTIFICATES } from "../data/certificates";

const NAV_ITEMS = [
  { label: "About", href: "/#about", id: "about", icon: User },
  { label: "Stack", href: "/#what-i-can-do", id: "what-i-can-do", icon: Layers },
  { label: "Experience", href: "/#trainings", id: "trainings", icon: Briefcase },
  { label: "Education", href: "/#education", id: "education", icon: GraduationCap },
  { label: "Projects", href: "/#work", id: "work", icon: Box },
  { label: "Recognition", href: "/#awards", id: "awards", icon: Award },
];

export function SeavikMark({ className = "h-6 w-auto" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 44 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* M */}
      <path
        d="M2 21V3H6.5L11.5 12.5L16.5 3H21V21H17V10.2L12.3 18.8H10.7L6 10.2V21H2Z"
        fill="currentColor"
      />
      {/* S */}
      <path
        d="M25 16.5H29C29.2 17.7 30.5 18.4 32.5 18.4C34.4 18.4 35.6 17.7 35.6 16.5C35.6 15.4 34.6 14.9 32.2 14.4L30.2 14C26.8 13.3 25.3 11.7 25.3 8.9C25.3 5.5 28.1 3.2 32.4 3.2C36.6 3.2 39.3 5.4 39.5 8.6H35.5C35.3 7.3 34.1 6.5 32.3 6.5C30.6 6.5 29.4 7.3 29.4 8.5C29.4 9.5 30.3 10.1 32.6 10.5L34.6 10.9C38.2 11.6 39.8 13.1 39.8 16.1C39.8 19.6 37 21.8 32.3 21.8C27.8 21.8 25.2 19.7 25 16.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Header({
  alwaysShowCoffee = true,
  alwaysShowBackToTop = false,
  onOpenResume,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(Boolean(alwaysShowBackToTop));
  const [coffeeCount, setCoffeeCount] = useState(37);
  const [coffeeLoading, setCoffeeLoading] = useState(true);
  const [justClicked, setJustClicked] = useState(false);
  const [floaterKey, setFloaterKey] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const cmdInputRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    let localSaved = 37;
    try {
      const stored = localStorage.getItem("seavik_coffee_count");
      if (stored) {
        const parsed = Number(stored);
        if (Number.isFinite(parsed) && parsed > 0) localSaved = parsed;
      }
    } catch {}

    setCoffeeCount(localSaved);

    fetch("/api/coffee-count")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data.count === "number" && data.count > 0) {
          const best = Math.max(data.count, localSaved);
          setCoffeeCount(best);
          try {
            localStorage.setItem("seavik_coffee_count", String(best));
          } catch {}
        }
        if (!cancelled) setCoffeeLoading(false);
      })
      .catch(() => {
        if (!cancelled) setCoffeeLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keyboard shortcut Cmd+K or /
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      } else if (
        e.key === "/" &&
        !cmdOpen &&
        document.activeElement &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
      ) {
        e.preventDefault();
        setCmdOpen(true);
      } else if (e.key === "Escape") {
        setCmdOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cmdOpen]);

  useEffect(() => {
    if (cmdOpen) {
      setTimeout(() => cmdInputRef.current?.focus(), 30);
    } else {
      setCmdQuery("");
    }
  }, [cmdOpen]);

  const handleCoffeeClick = async (e) => {
    e.preventDefault();
    setJustClicked(true);
    setFloaterKey((prev) => prev + 1);

    const previousCount = coffeeCount || 37;
    const nextCount = previousCount + 1;
    setCoffeeCount(nextCount);

    try {
      localStorage.setItem("seavik_coffee_count", String(nextCount));
    } catch {}

    try {
      const res = await fetch("/api/coffee-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientCount: nextCount }),
      });
      const data = await res.json();
      if (data && typeof data.count === "number" && data.count >= nextCount) {
        setCoffeeCount(data.count);
        try {
          localStorage.setItem("seavik_coffee_count", String(data.count));
        } catch {}
      }
    } catch {}
  };

  useEffect(() => {
    if (!justClicked) return;
    const timer = setTimeout(() => setJustClicked(false), 1200);
    return () => clearTimeout(timer);
  }, [justClicked]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(alwaysShowBackToTop || window.scrollY > 360);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysShowBackToTop]);

  useEffect(() => {
    const sectionIds = ["about", "what-i-can-do", "trainings", "education", "work", "awards", "contact"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, targetId) => {
    if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "")) {
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        setMenuOpen(false);
        setCmdOpen(false);
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${targetId}`);
        setActiveSection(targetId);
      }
    } else {
      setMenuOpen(false);
      setCmdOpen(false);
    }
  };

  const commandGroups = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    const match = (str) => !q || str.toLowerCase().includes(q);

    const sections = NAV_ITEMS.filter((item) => match(item.label)).map((item) => ({
      id: `sec-${item.id}`,
      label: item.label,
      meta: "Section",
      icon: item.icon,
      onSelect: (e) => {
        if (window.location.pathname === "/") {
          handleNavClick(e, item.id);
        } else {
          window.location.href = item.href;
        }
      },
    }));

    const pages = [
      {
        id: "page-work",
        label: "Technical & Digital Work Archive",
        meta: "/work",
        icon: Box,
        onSelect: () => {
          setCmdOpen(false);
          window.location.href = "/work";
        },
      },
      {
        id: "page-projects",
        label: "All Technical Projects Grid",
        meta: "/projects",
        icon: Layers,
        onSelect: () => {
          setCmdOpen(false);
          window.location.href = "/projects";
        },
      },
    ].filter((p) => match(p.label) || match(p.meta));

    const projectItems = PROJECTS.filter(
      (p) => match(p.title) || match(p.category) || p.tech.some((t) => match(t))
    )
      .slice(0, 6)
      .map((p) => ({
        id: `proj-${p.num}`,
        label: p.title,
        meta: p.category,
        icon: Box,
        onSelect: () => {
          setCmdOpen(false);
          window.open(p.link, "_blank", "noopener,noreferrer");
        },
      }));

    const certItems = CERTIFICATES.filter((c) => match(c.title) || match(c.org)).map((c) => ({
      id: `cert-${c.id}`,
      label: `${c.title} — ${c.org}`,
      meta: "PDF",
      icon: Award,
      onSelect: () => {
        setCmdOpen(false);
        window.open(c.pdf, "_blank", "noopener,noreferrer");
      },
    }));

    const actions = [
      {
        id: "act-resume",
        label: "View Resume / CV (Mao Seavik_Resume.pdf)",
        meta: "PDF",
        icon: FileText,
        onSelect: () => {
          setCmdOpen(false);
          if (onOpenResume) {
            onOpenResume();
          } else {
            window.open("/resume/Mao Seavik_Resume.pdf", "_blank", "noopener,noreferrer");
          }
        },
      },
      {
        id: "act-copy-email",
        label: copiedEmail ? "Copied MaoSeavik@gmail.com!" : "Copy Email (MaoSeavik@gmail.com)",
        meta: "Action",
        icon: copiedEmail ? Check : Copy,
        onSelect: () => {
          navigator.clipboard?.writeText("MaoSeavik@gmail.com");
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2000);
        },
      },
      {
        id: "act-theme",
        label: `Toggle Theme (Current: ${theme === "dark" ? "Dark" : "Light"})`,
        meta: "Appearance",
        icon: theme === "dark" ? Sun : Moon,
        onSelect: () => {
          toggleTheme();
          setCmdOpen(false);
        },
      },
      {
        id: "act-hf",
        label: "Hugging Face Hub (@Maoseavik)",
        meta: "External",
        icon: Sparkles,
        onSelect: () => {
          setCmdOpen(false);
          window.open("https://huggingface.co/Maoseavik", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "act-gh",
        label: "GitHub Profile (@Seavik2142)",
        meta: "External",
        icon: Github,
        onSelect: () => {
          setCmdOpen(false);
          window.open("https://github.com/Seavik2142", "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "act-li",
        label: "LinkedIn (linkedin.com/in/mao-seavik)",
        meta: "External",
        icon: Linkedin,
        onSelect: () => {
          setCmdOpen(false);
          window.open("https://www.linkedin.com/in/mao-seavik", "_blank", "noopener,noreferrer");
        },
      },
    ].filter((a) => match(a.label) || match(a.meta));

    return [
      { heading: "Portfolio Sections", items: sections },
      { heading: "Quick Actions & Links", items: actions },
      { heading: "Projects", items: projectItems },
      { heading: "Certificates", items: certItems },
      { heading: "Pages", items: pages },
    ].filter((g) => g.items.length > 0);
  }, [cmdQuery, copiedEmail, theme, toggleTheme, onOpenResume]);

  return (
    <>
      <header className="sticky top-0 z-50 h-14 max-w-[100vw] overflow-x-clip bg-[var(--background)]/90 backdrop-blur-md px-2 pt-1">
        <div className="screen-line-top screen-line-bottom mx-auto flex h-full items-center gap-2 border-x border-[var(--line)] pr-2 pl-4 sm:gap-3 md:max-w-3xl">
          <Link
            href="/"
            aria-label="Mao Seavik Home"
            className="flex items-center gap-2 text-[var(--foreground)] transition-opacity hover:opacity-80"
          >
            <SeavikMark className="h-5 w-auto shrink-0" />
            <span className="hidden font-mono text-xs font-semibold tracking-wider sm:inline-block">
              SEAVIK
            </span>
          </Link>

          <div className="flex-1" />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                    isActive
                      ? "bg-[var(--muted-bg)] font-medium text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <Link
              href="/work"
              className="rounded-md px-2 py-1 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Archive
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden h-4 w-px bg-[var(--border)] sm:block" />

            {/* Command Menu Trigger (ChanhDai style) */}
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[var(--border)] bg-zinc-50/80 px-2.5 font-mono text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--foreground)]/30 hover:text-[var(--foreground)] dark:bg-zinc-900/80"
              aria-label="Open command palette"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-[var(--border)] bg-[var(--background)] px-1 py-0.2 text-[10px] font-medium text-[var(--muted-foreground)] sm:inline-block">
                ⌘K
              </kbd>
            </button>

            {alwaysShowCoffee && (
              <>
                <div className="h-4 w-px bg-[var(--border)]" />
                <button
                  type="button"
                  onClick={handleCoffeeClick}
                  title="Buy me a coffee (click to cheer!)"
                  className="relative inline-flex h-7 items-center gap-1.5 rounded-full border border-[var(--border)] bg-zinc-50/80 px-2.5 font-mono text-xs text-[var(--foreground)] transition-all hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-95 dark:bg-zinc-900/80"
                >
                  {justClicked && (
                    <span
                      key={floaterKey}
                      className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce whitespace-nowrap rounded bg-amber-500 px-1.5 py-0.5 font-mono text-[10px] font-bold text-black shadow"
                    >
                      +1 ☕
                    </span>
                  )}
                  <Coffee className="h-3.5 w-3.5 text-amber-500" />
                  <span className="tabular-nums">{coffeeLoading ? ".." : coffeeCount}</span>
                </button>
              </>
            )}

            <div className="hidden h-4 w-px bg-[var(--border)] sm:block" />

            <a
              href="https://github.com/Seavik2142"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hidden h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] sm:inline-flex"
            >
              <Github className="h-4 w-4" />
            </a>

            <div className="h-4 w-px bg-[var(--border)]" />

            <ThemeToggle className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]" />

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu inside CAD frame */}
        {menuOpen && (
          <div className="mx-auto border-x border-b border-[var(--line)] bg-[var(--background)] px-4 py-3 shadow-lg md:hidden md:max-w-3xl">
            <div className="grid grid-cols-2 gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="flex items-center gap-2 rounded-md border border-[var(--line)] px-3 py-2 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
                  >
                    <Icon className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
              <Link
                href="/work"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-md border border-[var(--line)] px-3 py-2 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
              >
                <Box className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                <span>Work Archive</span>
              </Link>
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="flex items-center justify-between rounded-md bg-[var(--foreground)] px-3 py-2 font-mono text-xs font-medium text-[var(--background)]"
              >
                <span>Contact Me</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Command Palette Modal (⌘K) */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-3 pt-16 backdrop-blur-xs sm:pt-24"
          onClick={() => setCmdOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--line)] px-3.5 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
              <input
                ref={cmdInputRef}
                type="text"
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Type a command or search sections, ML stack, projects…"
                className="w-full bg-transparent font-mono text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none"
              />
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                ESC
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {commandGroups.length === 0 ? (
                <div className="py-8 text-center font-mono text-xs text-[var(--muted-foreground)]">
                  No matching results found.
                </div>
              ) : (
                commandGroups.map((group) => (
                  <div key={group.heading} className="mb-3 last:mb-0">
                    <div className="px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                      {group.heading}
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={item.onSelect}
                            className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-[var(--muted-bg)]"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--muted-bg)] text-[var(--muted-foreground)]">
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="truncate font-medium">{item.label}</span>
                            </div>
                            <span className="shrink-0 font-mono text-[10px] text-[var(--muted-foreground)]">
                              {item.meta}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[var(--line)] bg-zinc-50/50 px-3.5 py-2 font-mono text-[11px] text-[var(--muted-foreground)] dark:bg-zinc-900/50">
              <div className="flex items-center gap-1.5">
                <SeavikMark className="h-3.5 w-auto opacity-75" />
                <span>maoseavik.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Select</span>
                <kbd className="inline-flex h-4 items-center rounded border border-[var(--border)] bg-[var(--background)] px-1">
                  <CornerDownLeft className="h-2.5 w-2.5" />
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to top button */}
      {showBackToTop && !menuOpen && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed right-4 bottom-4 z-40 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-md transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
