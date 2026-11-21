"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  ArrowUp,
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
  { label: "Projects", href: "/#work", id: "work", icon: Box },
  { label: "Recognition", href: "/#awards", id: "awards", icon: Award },
];

export function SeavikMark({ className = "h-6 w-auto" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 512 256"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="currentColor"
        d="M192 256H64v-64h128v64ZM448 64H320v128h128v64H256V0h192v64ZM64 192H0V64h64v128ZM512 192h-64V64h64v128ZM192 64H64V0h128v64Z"
      />
    </svg>
  );
}

export default function Header({
  alwaysShowCoffee = true,
  alwaysShowBackToTop = false,
  onOpenResume,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const mobileMenuRef = useRef(null);
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
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cmdOpen]);

  // Close mobile popover when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onPointerDown = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [mobileMenuOpen]);

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
        setMobileMenuOpen(false);
        setCmdOpen(false);
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${targetId}`);
        setActiveSection(targetId);
      }
    } else {
      setMobileMenuOpen(false);
      setCmdOpen(false);
    }
  };

  const commandGroups = useMemo(() => {
    const q = cmdQuery.trim().toLowerCase();
    const match = (str) => !q || str.toLowerCase().includes(q);

    const allSections = [
      ...NAV_ITEMS,
      { label: "Education", href: "/#education", id: "education", icon: GraduationCap },
      { label: "Contact", href: "/#contact", id: "contact", icon: Mail },
    ];

    const sections = allSections
      .filter((item) => match(item.label))
      .map((item) => ({
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
      { heading: "Portfolio", items: sections },
      { heading: "Quick Actions & Socials", items: actions },
      { heading: "Projects", items: projectItems },
      { heading: "Certificates", items: certItems },
      { heading: "Pages", items: pages },
    ].filter((g) => g.items.length > 0);
  }, [cmdQuery, copiedEmail, theme, toggleTheme, onOpenResume]);

  return (
    <>
      {/* ====================================================================
          CHANHDAI STICKY TOP HEADER (Minimalist 60px CAD Frame)
         ==================================================================== */}
      <header className="sticky top-0 z-50 h-[60px] max-w-[100vw] overflow-x-clip bg-[var(--background)] px-2 pt-1">
        <div className="screen-line-top screen-line-bottom mx-auto flex h-full items-center gap-2 border-x border-[var(--line)] pr-2 pl-4 after:z-10 sm:gap-4 md:max-w-3xl">
          {/* Left: Clean Pixel-Grid Geometric Mark */}
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center text-[var(--foreground)] transition-opacity hover:opacity-80"
          >
            <SeavikMark className="h-6 w-auto shrink-0" />
          </Link>

          <div className="flex-1" />

          {/* Desktop Navigation (Exact ChanhDai NavDesktop typography) */}
          <nav
            className="hidden items-center gap-4 sm:flex"
            aria-label="Primary Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-[var(--foreground)] ${
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <Link
              href="/work"
              className="text-sm font-medium tracking-wide text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              Archive
            </Link>
          </nav>

          {/* Right Action Controls (Command Menu + GitHub + Coffee + ThemeToggle) */}
          <div className="flex items-center">
            <div className="mr-2 hidden h-5 w-px bg-[var(--border)] sm:block" />

            {/* Command Menu Trigger (Ghost button with Search icon + [⌘][K] keycaps) */}
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="hidden h-7 items-center gap-1.5 rounded-md px-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] select-none sm:inline-flex"
              aria-label="Open command menu (⌘K)"
              title="Search & Commands (⌘K)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden items-center gap-0.5 md:inline-flex">
                <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--border)] bg-zinc-50 font-sans text-[11px] font-medium text-[var(--muted-foreground)] dark:bg-zinc-900">
                  ⌘
                </kbd>
                <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--border)] bg-zinc-50 font-sans text-[11px] font-medium text-[var(--muted-foreground)] dark:bg-zinc-900">
                  K
                </kbd>
              </span>
            </button>

            <div className="mx-2 hidden h-5 w-px bg-[var(--border)] sm:block" />

            {/* GitHub Icon + Stars/Repos Link */}
            <a
              href="https://github.com/Seavik2142"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub (@Seavik2142)"
              className="inline-flex h-7 items-center gap-1.5 rounded-md px-1.5 text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 0C5.37 0 0 5.372 0 11.997 0 17.3 3.438 21.795 8.205 23.38c.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.609-4.042-1.609C4.422 17.77 3.633 17.4 3.633 17.4c-1.087-.744.084-.73.084-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.417-1.304.76-1.604-2.665-.3-5.466-1.332-5.466-5.929 0-1.31.465-2.38 1.235-3.219-.135-.303-.54-1.523.105-3.175 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.006 2.04.138 3 .404 2.28-1.551 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.608-2.805 5.623-5.475 5.918.42.36.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.284 0 .315.21.69.825.57C20.565 21.79 24 17.291 24 11.997 24 5.372 18.627 0 12 0"
                  fill="currentColor"
                />
              </svg>
              <span className="text-[13px] leading-none text-[var(--muted-foreground)] tabular-nums">
                23
              </span>
            </a>

            <div className="mx-2 h-5 w-px bg-[var(--border)]" />

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ====================================================================
          CHANHDAI FLOATING MOBILE BOTTOM DOCK (SiteBottomNav — sm:hidden)
         ==================================================================== */}
      <div
        ref={mobileMenuRef}
        className="fixed bottom-3 left-1/2 z-50 flex w-fit -translate-x-1/2 items-center rounded-xl bg-[var(--background)]/95 py-1 pr-1.5 pl-3 shadow-lg ring-1 ring-[var(--foreground)]/10 backdrop-blur-md sm:hidden dark:ring-[var(--foreground)]/20"
      >
        {/* Mobile Popover Menu */}
        {mobileMenuOpen && (
          <div className="absolute bottom-full left-1/2 mb-2.5 w-48 -translate-x-1/2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-1.5 shadow-xl">
            <div className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--muted-bg)] text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <Link
                href="/work"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
              >
                Archive
              </Link>
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
              >
                Contact
              </a>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            setCmdOpen(true);
          }}
          className="inline-flex min-w-20 items-center gap-2 py-1 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <Search className="h-4 w-4" />
          <span>Search…</span>
        </button>

        <div className="mr-1 ml-2.5 h-5 w-px bg-[var(--border)]" />

        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
          className="relative flex h-7 w-7 flex-col items-center justify-center gap-1 rounded-lg hover:bg-[var(--muted-bg)]"
        >
          <span
            className={`flex h-0.5 w-4 rounded-[1px] bg-[var(--foreground)] transition-transform ${
              mobileMenuOpen ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`flex h-0.5 w-4 rounded-[1px] bg-[var(--foreground)] transition-transform ${
              mobileMenuOpen ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* ====================================================================
          COMMAND PALETTE MODAL (⌘K / /)
         ==================================================================== */}
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
                placeholder="Type a command or search…"
                className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none"
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
                <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                  No results found.
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

            <div className="flex items-center justify-between border-t border-[var(--line)] bg-zinc-50/50 px-4 py-2 text-xs font-medium text-[var(--muted-foreground)] dark:bg-zinc-900/50">
              <SeavikMark className="h-4 w-auto text-[var(--muted-foreground)]" />
              <div className="flex items-center gap-2">
                <span>Go to section</span>
                <kbd className="inline-flex h-5 w-5 items-center justify-center rounded border border-[var(--border)] bg-[var(--background)]">
                  <CornerDownLeft className="h-3 w-3" />
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to top button */}
      {showBackToTop && !mobileMenuOpen && (
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
