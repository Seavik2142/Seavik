"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUp, ArrowUpRight, ChevronRight, Coffee } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Capabilities", href: "/#what-i-can-do", id: "what-i-can-do" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Awards", href: "/#awards", id: "awards" },
  { label: "Experience", href: "/#trainings", id: "trainings" },
];

export default function Header({ alwaysShowCoffee = true, alwaysShowBackToTop = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(Boolean(alwaysShowBackToTop));
  const [showCoffee, setShowCoffee] = useState(alwaysShowCoffee !== false);
  const [coffeeCount, setCoffeeCount] = useState(37);
  const [coffeeLoading, setCoffeeLoading] = useState(true);
  const [justClicked, setJustClicked] = useState(false);
  const [floaterKey, setFloaterKey] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef(null);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    } catch {
      // On network failure or Vercel glitch, keep optimistic nextCount! NEVER reset to 0!
    }
  };

  useEffect(() => {
    if (!justClicked) return;
    const timer = setTimeout(() => setJustClicked(false), 1200);
    return () => clearTimeout(timer);
  }, [justClicked]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowBackToTop(alwaysShowBackToTop || window.scrollY > 400);
      setShowCoffee(alwaysShowCoffee !== false);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysShowCoffee, alwaysShowBackToTop]);

  // Scrollspy to detect active section on home page
  useEffect(() => {
    const sectionIds = ["work", "what-i-can-do", "about", "awards", "trainings", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    const handleScrollCheck = () => {
      if (window.scrollY < 200) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScrollCheck, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollCheck);
    };
  }, []);

  // Handle clicking nav links smoothly on home page
  const handleNavClick = (e, targetId) => {
    if (typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname === "")) {
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        setMenuOpen(false);
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `/#${targetId}`);
        setActiveSection(targetId);
      }
    } else {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickAway = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("touchstart", handleClickAway);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("touchstart", handleClickAway);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <div
        className={`nav-mobile-backdrop ${menuOpen ? "nav-mobile-backdrop--visible" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        ref={navRef}
        className={`nav-bar ${scrolled ? "scrolled" : ""} ${menuOpen ? "nav-bar--expanded" : ""}`}
        aria-label="Primary Navigation"
      >
        <div className="nav-mobile-header">
          <a href="/" className="nav-left" aria-label="Seavik Home">
            <div className="nav-logo">S</div>
            <div className="nav-brand-group">
              <span className="nav-brand">SEAVIK</span>
              <span className="nav-status-dot" title="Available for work" />
            </div>
          </a>

          <div className="nav-mobile-actions lg:hidden">
            <ThemeToggle className="nav-theme-toggle" />
            <button
              className="nav-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="nav-mobile-menu lg:hidden">
            <div className="nav-mobile-menu-inner">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`nav-link ${isActive ? "nav-link--active" : ""}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={15} className="nav-mobile-chevron" />
                  </a>
                );
              })}
              <a
                href="/#contact"
                className="nav-cta nav-mobile-cta"
                onClick={(e) => handleNavClick(e, "contact")}
              >
                <span>Hire Me</span>
                <ArrowUpRight size={15} className="nav-cta-arrow" />
              </a>
            </div>
          </div>
        )}

        <div className="nav-center hidden lg:flex" role="navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`nav-link ${isActive ? "nav-link--active" : ""}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {isActive && <span className="nav-link-dot" />}
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="nav-right hidden lg:flex">
          <ThemeToggle className="nav-theme-toggle" />
          <a
            href="/#contact"
            className="nav-cta"
            onClick={(e) => handleNavClick(e, "contact")}
          >
            <span>Hire Me</span>
            <ArrowUpRight size={14} className="nav-cta-arrow" />
          </a>
        </div>
      </nav>

      {showBackToTop && !menuOpen && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          <ArrowUp size={20} />
        </button>
      )}
      {showCoffee && !menuOpen && (
        <button
          type="button"
          className={`coffee-btn ${justClicked ? "coffee-btn--clicked" : ""}`}
          aria-label="Get me a coffee"
          onClick={handleCoffeeClick}
        >
        {justClicked && (
          <span key={floaterKey} className="coffee-floater">
            +1 ☕
          </span>
        )}
        <div className="coffee-icon-wrap">
          <Coffee size={15} className="coffee-icon" />
        </div>
        <span className="coffee-label">
          {justClicked ? "Thank you! ❤️" : "Get me a coffee"}
        </span>
        <span className="coffee-count">
          {coffeeLoading ? "..." : coffeeCount}
        </span>
      </button>
      )}
    </>
  );
}
