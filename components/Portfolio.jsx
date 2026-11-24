"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Github,
  Mail,
  ExternalLink,
  X,
  Code2,
  Rocket,
  Trophy,
  GraduationCap,
  Linkedin,
  Minus,
  Eye,
  Download,
  FileText,
  Sparkles,
  Cpu,
  Bot,
  MapPin,
  Briefcase,
  Box,
  Award,
  Check,
  Copy,
  ChevronDown,
  ChevronsUpDown,
  Link as LinkIcon,
  Infinity as InfinityIcon,
  ArrowUpRight,
  Paperclip,
  CircleCheckBig,
  Send,
  Layers,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { PROJECTS as ALL_PROJECTS } from "../lib/projects";
import { CERTIFICATES } from "../data/certificates";
import Header from "./Header";
import MediaModal from "./MediaModal";
import { isPdf, getFormatLabel, safeMediaUrl } from "../lib/media";
import {
  playMetalClick,
  playSoftClick,
  playTickClick,
  playExpandSound,
  playCollapseSound,
  playMiniMapOpen,
  playPenScratch,
  playNamePronunciation,
} from "../lib/sound";

/* ============================================================================
   DATA DEFINITIONS (Preserving all user content + ML Engineer & Data Science Stack)
   ============================================================================ */

const TAGLINES = [
  "Machine Learning Engineer & Full-Stack Developer.",
  "Deep Learning, LLM Fine-Tuning (LoRA/PEFT) & Data Science.",
  "PyTorch · TensorFlow · Hugging Face · LangChain · FastAPI.",
  "B.Sc. Computer Science at Norton University — Phnom Penh.",
];

const STACK_CATEGORIES = [
  {
    category: "Deep Learning & LLMs",
    items: [
      { title: "PyTorch", logo: "/images/logos/pytorch.svg", href: "https://pytorch.org" },
      { title: "TensorFlow", logo: "/images/logos/tensorflow.svg", href: "https://www.tensorflow.org" },
      { title: "Hugging Face", logo: "/images/logos/huggingface.svg", href: "https://huggingface.co/Maoseavik" },
      { title: "LangChain", logo: "/images/logos/langchain.svg", href: "https://www.langchain.com" },
      { title: "LoRA / PEFT", logo: "/images/logos/huggingface.svg", href: "https://github.com/huggingface/peft" },
      { title: "GGUF Quantization", logo: "/images/logos/pytorch.svg", href: "https://huggingface.co/Maoseavik" },
    ],
  },
  {
    category: "Data Science & ML",
    items: [
      { title: "NumPy", logo: "/images/logos/numpy.svg", href: "https://numpy.org" },
      { title: "Pandas", logo: "/images/logos/pandas.svg", href: "https://pandas.pydata.org" },
      { title: "Scikit-learn", logo: "/images/logos/scikitlearn.svg", href: "https://scikit-learn.org" },
      { title: "Matplotlib", logo: "/images/logos/matplotlib.svg", href: "https://matplotlib.org" },
      { title: "Jupyter", logo: "/images/logos/jupyter.svg", href: "https://jupyter.org" },
      { title: "Streamlit", logo: "/images/logos/streamlit.svg", href: "https://streamlit.io" },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      { title: "Python", logo: "/images/logos/python.png", href: "https://www.python.org" },
      { title: "FastAPI", logo: "/images/logos/fastapi.svg", href: "https://fastapi.tiangolo.com" },
      { title: "Flask", logo: "/images/logos/flask.png", href: "https://flask.palletsprojects.com" },
      { title: "PostgreSQL", logo: "/images/logos/postgresql.svg", href: "https://www.postgresql.org" },
      { title: "MySQL", logo: "/images/logos/mysql.svg", href: "https://www.mysql.com" },
      { title: "Laravel", logo: "/images/logos/laravel.svg", href: "https://laravel.com" },
      { title: "PHP", logo: "/images/logos/php.png", href: "https://www.php.net" },
    ],
  },
  {
    category: "Web, MLOps & Tools",
    items: [
      { title: "React", logo: "/images/logos/react.png", href: "https://react.dev" },
      { title: "JavaScript", logo: "/images/logos/js.png", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { title: "Vue 3", logo: "/images/logos/vue.svg", href: "https://vuejs.org" },
      { title: "Docker", logo: "/images/workspace/docker.svg", href: "https://www.docker.com" },
      { title: "VS Code", logo: "/images/workspace/visual-studio-code.svg", href: "https://code.visualstudio.com" },
      { title: "Figma", logo: "/images/workspace/figma.png", href: "https://www.figma.com" },
    ],
  },
];

const WHAT_I_CAN_DO = [
  {
    group: "ML Engineering & Deep Learning",
    description:
      "Training, fine-tuning, and deploying deep learning and language models with PyTorch, TensorFlow, and Hugging Face, optimizing weights via LoRA/PEFT and GGUF quantization, and orchestrating agentic RAG pipelines with LangChain and FastAPI.",
    items: [
      "PyTorch",
      "TensorFlow",
      "Hugging Face",
      "LangChain",
      "Scikit-learn",
      "FastAPI",
      "LoRA / PEFT",
      "GGUF Quantization",
      "ZeroGPU Cloud Spaces",
      "Multimodal Vision",
      "AI Agents & RAG",
      "Python 3.12+",
    ],
  },
  {
    group: "Data Science & ML Analytics",
    description:
      "Performing end-to-end data wrangling, feature engineering, exploratory data analysis, classical machine learning, scientific visualization, and interactive ML web apps using the full Python data science stack.",
    items: [
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Scikit-learn",
      "Jupyter",
      "Streamlit",
      "TensorFlow",
      "PyTorch",
      "Data Cleaning & ETL",
      "Feature Engineering",
      "Statistical Modeling",
      "Data Visualization",
    ],
  },
  {
    group: "Backend APIs & Production Systems",
    description:
      "Developing high-performance async Python services, REST APIs, relational database architectures, containerized ML deployments, and full-stack web interfaces with payment gateways like Bakong KHQR.",
    items: [
      "FastAPI",
      "Flask",
      "Streamlit",
      "React",
      "TypeScript",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Docker",
      "Git & GitHub",
      "RESTful APIs",
      "Bakong KHQR",
    ],
  },
];

const EXPERIENCE = [
  {
    id: "hf-ml-engineering",
    companyName: "Hugging Face Pro • Independent ML Systems & Open Source",
    companyWebsite: "https://huggingface.co/Maoseavik",
    location: "Phnom Penh, Cambodia",
    locationType: "Remote / Open Source",
    isCurrentEmployer: true,
    logo: "/images/logos/huggingface.svg",
    title: "Specialized Machine Learning Engineering & LLM Model Fine-Tuning",
    subtitle: "PyTorch, TensorFlow, LangChain, LoRA / PEFT & ZeroGPU Cloud Spaces",
    employmentType: "ML Engineering & Research",
    period: { start: "2024", end: null },
    badge: "Specialized ML Engineering",
    isExpanded: true,
    desc: "Advanced applied Machine Learning engineering and data science specialization focusing on deep learning, domain-specific LLM fine-tuning (LoRA/PEFT), GGUF quantization, data analytics (NumPy, Pandas, Scikit-learn, Matplotlib, Jupyter), and production ML deployment with FastAPI, LangChain, and Streamlit. Successfully trained and released open-source agricultural language models and GGUF edge builds on Hugging Face, deployed interactive cloud spaces on Hugging Face ZeroGPU (5.7 TFLOPS), and architected OmniChat CRM (ChhlatAI).",
    highlights: [
      "Trained and published 4 domain-specific agricultural language models and GGUF quantized edge weights on Hugging Face (@Maoseavik).",
      "Built end-to-end data cleaning, feature engineering, and evaluation pipelines with NumPy, Pandas, Scikit-learn, Matplotlib, and Jupyter.",
      "Deployed interactive ML applications on Hugging Face ZeroGPU (5.7 TFLOPS) and Streamlit.",
      "Architected OmniChat CRM (ChhlatAI) combining FastAPI, LangChain, multimodal slip verification, and Bakong KHQR checkout.",
    ],
    tags: [
      "PyTorch & TensorFlow",
      "Hugging Face",
      "LangChain",
      "Scikit-learn",
      "NumPy & Pandas",
      "Matplotlib & Jupyter",
      "Streamlit",
      "FastAPI",
      "LoRA / PEFT & GGUF",
    ],
    certificates: [
      { name: "Hugging Face Profile & Model Hub (hf.co/Maoseavik)", link: "https://huggingface.co/Maoseavik" },
      { name: "ChhlatAI - OmniChat CRM Architecture (GitHub)", link: "https://github.com/Seavik2142/ChhlatAI" },
      { name: "AgriSystem AI Expert System (GitHub)", link: "https://github.com/CHHORNGL/Project_Assignment" },
    ],
    images: [
      "/images/experience/huggingface.png",
      "/images/ChhlatAI/Landing_page.png",
      "/images/Agricultureexp/preview.png",
    ],
  },
  {
    id: "kru-backend",
    companyName: "KRU IT Solution & ETEC Center",
    location: "Phnom Penh, Cambodia",
    locationType: "On-site",
    isCurrentEmployer: false,
    logo: "/images/partners/etec-center.png",
    title: "Backend Development Internship",
    subtitle: "API Architecture, Relational Databases & MVC Systems",
    employmentType: "Internship · 10 Weeks",
    period: { start: "07.2026", end: "10.2026" },
    isExpanded: true,
    desc: "Completed an intensive internship in backend development at KRU IT Solution. Gained hands-on experience designing robust APIs, managing MySQL database schemas, implementing server-side authentication, and working collaboratively in full-lifecycle software delivery.",
    highlights: [
      "Developed backend functionality for a tour and travel management platform using PHP and Laravel MVC.",
      "Designed relational database schemas, REST API endpoints, and role-based authentication.",
    ],
    tags: ["Laravel", "PHP", "MySQL", "REST API", "MVC Architecture", "Git"],
    certificates: [
      { name: "Certificate of Completion (PDF)", link: "/certificates/1.pdf" },
    ],
    images: [
      "/images/experience/Etec/1.jpeg",
      "/images/experience/Etec/2.jpeg",
      "/images/experience/Etec/3.jpeg",
    ],
  },
  {
    id: "norton-ai-innovation",
    companyName: "Norton University — Department of Computer Studies",
    location: "Phnom Penh, Cambodia",
    locationType: "Competition",
    isCurrentEmployer: false,
    logo: "/images/partners/kru-it.png",
    title: "AI Expert System & Innovation 2026 (Team Lead)",
    subtitle: "Project: Agriculture Expert System",
    employmentType: "Academic Competition",
    period: { start: "02.2026", end: "09.2026" },
    isExpanded: false,
    desc: "Actively participated and competed in the AI Expert System and Innovation 2026 competition. Led a team of four to build the 'Agriculture Expert System' designed to provide intelligent crop disease diagnosis, localized weather risk alerts, and data-driven agricultural decision making.",
    highlights: [
      "Collected, cleaned, and structured agricultural symptom datasets using Python, Pandas, and NumPy.",
      "Fine-tuned domain-adapted language models and rule-based diagnostic scoring with PyTorch, Hugging Face, and Flask.",
      "Supported bilingual English and Khmer interfaces for rural farmers and agricultural specialists.",
    ],
    tags: ["PyTorch", "Hugging Face", "Pandas", "Scikit-learn", "Flask", "PostgreSQL"],
    certificates: [
      { name: "AI Innovation Certificate (PDF)", link: "/certificates/3.pdf" },
    ],
    images: [
      "/images/experience/innovation/1.jpeg",
      "/images/experience/innovation/2.jpeg",
      "/images/experience/innovation/3.jpeg",
      "/images/experience/innovation/4.jpeg",
      "/images/experience/innovation/5.jpeg",
    ],
  },
  {
    id: "dict-va",
    companyName: "Department of Information and Communications Technology",
    location: "Phnom Penh, Cambodia",
    locationType: "Training",
    isCurrentEmployer: false,
    title: "Virtual Assistance & Digital Operations",
    subtitle: "AI Productivity Workflows & Data Validation",
    employmentType: "Professional Training",
    period: { start: "2026", end: "2026" },
    isExpanded: false,
    desc: "Completed intensive practical training in virtual assistance fundamentals, AI-powered productivity workflows, client outreach, data validation, and digital content scheduling.",
    highlights: [
      "Automated digital operations, structured data validation, and workflow documentation.",
    ],
    tags: ["Workflow Automation", "Data Validation", "Digital Operations"],
    certificates: [],
    images: [
      "/images/experience/va/1.jpeg",
      "/images/experience/va/2.jpeg",
    ],
  },
];

const EDUCATION = [
  {
    id: "norton-cs",
    school: "Norton University",
    degree: "Bachelor of Computer Science (B.Sc.)",
    fieldOfStudy: "Software Development & Artificial Intelligence",
    period: { start: "10.2024", end: "12.2028 (Expected)" },
    isExpanded: true,
    description:
      "Undergraduate computer science program focusing on software engineering, artificial intelligence, algorithms, and database systems. Completed Foundation Year Course with distinguished academic standing (2023–2024) and serves as Student Team Leader for academic research and competitions.",
    certificate: { name: "Foundation Year Certificate (PDF)", link: "/certificates/2.pdf" },
    images: [
      "/images/experience/Chill/1.jpeg",
      "/images/experience/Chill/2.jpeg",
      "/images/experience/Chill/3.jpeg",
    ],
    skills: [
      "Artificial Intelligence",
      "Data Structures",
      "Analysis of Algorithms",
      "Database Management",
      "Systems Programming",
      "Software Methodology",
      "Computer Architecture",
      "Student Team Leader",
    ],
  },
  {
    id: "salait-fullstack",
    school: "SalaIT",
    degree: "Intensive Engineering Program",
    fieldOfStudy: "Full-Stack Software Development",
    period: { start: "02.2025", end: "04.2026" },
    isExpanded: false,
    description:
      "Completed hands-on full-stack software engineering training covering modern web architectures, RESTful APIs, relational database design with PostgreSQL, and production deployment workflows.",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Docker"],
  },
];

const CURRENTLY = [
  { icon: Cpu, label: "ML & Data Science", detail: "PyTorch, TensorFlow & LangChain" },
  { icon: Bot, label: "Building", detail: "OmniChat AI CRM (ChhlatAI)" },
  { icon: Rocket, label: "Deploying", detail: "Hugging Face ZeroGPU Spaces" },
];

const SUPPORTED_COMPANIES = [
  {
    id: "aba-bank",
    name: "ABA Bank",
    role: "KHQR & Payment Ecosystem",
    detail: "Bakong KHQR & PayWay payment slip verification integrated in ChhlatAI OmniChat CRM.",
    logo: "/images/partners/aba-bank.png",
    rounded: "rounded-md",
  },
  {
    id: "angkor-green",
    name: "Angkor Green",
    role: "AgriTech & Crop Innovation",
    detail: "Agricultural domain reference & crop disease knowledge supporting AgriSystem AI.",
    logo: "/images/partners/angkor-green.png",
    rounded: "rounded-full",
  },
  {
    id: "dg-academy",
    name: "DG Academy",
    role: "Digital & Tech Academy",
    detail: "Digital growth, technology education, and software innovation ecosystem partner.",
    logo: "/images/partners/dg-academy.png",
    rounded: "rounded-md",
  },
  {
    id: "bakong-khqr",
    name: "Bakong (NBC)",
    role: "National KHQR Payment System",
    detail: "Bakong KHQR real-time payment gateway & automated checkout verification in ChhlatAI.",
    logo: "/images/partners/canadia-bank.png",
    rounded: "rounded-md",
  },
  {
    id: "norton-cs",
    name: "Norton University (Computer Science)",
    role: "B.Sc. Computer Science & AI",
    detail: "Department of Computer Studies — Bachelor of Computer Science & AI Expert System Innovation 2026.",
    logo: "/images/partners/kru-it.png",
    rounded: "rounded-full",
  },
  {
    id: "cambodia-academic-space",
    name: "Cambodia Academic Space",
    role: "Academic & Research Community",
    detail: "Academic technology, computer science research, and student innovation ecosystem.",
    logo: "/images/partners/as-tech.png",
    rounded: "rounded-full",
  },
  {
    id: "kru-it-etec",
    name: "KRU IT Solution",
    role: "ETEC Center · Backend Engineering",
    detail: "10-week intensive backend engineering internship building production Laravel & MySQL APIs.",
    logo: "/images/partners/etec-center.png",
    rounded: "rounded-full",
  },
  {
    id: "sala-it",
    name: "Sala-IT",
    role: "Software Engineering Academy",
    detail: "Full-stack software engineering program (React, TypeScript, PostgreSQL & Docker).",
    logo: "/images/partners/sala-it.png",
    rounded: "rounded-md",
    invertDark: true,
  },
];

/* ============================================================================
   CHANHDAI CAD / BLUEPRINT PRIMITIVE COMPONENTS
   ============================================================================ */

function Separator({ className = "", children }) {
  return (
    <div
      className={`stripe-divider h-8 w-full border-x border-[var(--line)] ${className}`}
    >
      {children}
    </div>
  );
}

function Panel({ id, className = "", children }) {
  return (
    <section
      id={id}
      data-slot="panel"
      className={`screen-line-top screen-line-bottom relative scroll-mt-20 border-x border-[var(--line)] ${className}`}
    >
      {children}
    </section>
  );
}

function PanelHeader({ className = "", children }) {
  return (
    <header
      data-slot="panel-header"
      className={`screen-line-bottom flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-3 sm:px-4 ${className}`}
    >
      {children}
    </header>
  );
}

function PanelTitle({ id, children, sup, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window === "undefined") return;
    playSoftClick();
    const url = `${window.location.origin}/#${id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group/title flex items-baseline gap-1.5">
      <h2 className="text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
        <a href={`#${id}`} className="hover:underline">
          {children}
        </a>
      </h2>
      {sup !== undefined && (
        <sup className="-top-2 ml-0.5 font-mono text-xs font-medium text-[var(--muted-foreground)]">
          ({sup})
        </sup>
      )}
      {id && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy link to ${children}`}
          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--muted-foreground)] opacity-0 transition-opacity group-hover/title:opacity-100 hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <LinkIcon className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}

function IconTile({ className = "", children }) {
  return (
    <div
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--muted-foreground)]/15 bg-[var(--muted-bg)] text-[var(--muted-foreground)] ring-1 ring-[var(--border)]/60 ring-offset-1 ring-offset-[var(--background)] select-none [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}

function Tag({ children, logo, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-zinc-50 px-2 py-0.5 font-mono text-xs text-[var(--muted-foreground)] dark:bg-zinc-900 ${className}`}
    >
      {logo && (
        <img
          src={logo}
          alt=""
          className="h-3.5 w-3.5 shrink-0 object-contain"
          draggable={false}
        />
      )}
      {children}
    </span>
  );
}

function VerifiedIcon({ className = "" }) {
  return (
    <span
      className={`group/verified relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center select-none ${className}`}
      style={{ width: 18, height: 18 }}
      title="Verified Machine Learning Engineer"
      aria-label="Verified"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={18}
        height={18}
        className="h-[18px] w-[18px] text-[#2563eb] transition-transform duration-300 ease-out group-hover/verified:scale-110 dark:text-[#3b82f6]"
      >
        <path
          fill="currentColor"
          d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z"
        />
      </svg>
    </span>
  );
}

function PronounceMyName() {
  const [speaking, setSpeaking] = useState(false);
  const [waveStep, setWaveStep] = useState(2);

  const triggerPronounce = useCallback(() => {
    setSpeaking(true);
    setWaveStep(0);
    setTimeout(() => setWaveStep(1), 110);
    setTimeout(() => setWaveStep(2), 230);
    playNamePronunciation(() => {
      setSpeaking(false);
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (
        e.key.toLowerCase() === "p" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        document.activeElement &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
      ) {
        triggerPronounce();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerPronounce]);

  return (
    <button
      type="button"
      onClick={triggerPronounce}
      aria-label="Pronounce my name (P)"
      title="Pronounce my name (P)"
      className={`relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all duration-150 select-none hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] active:scale-90 ${
        speaking ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={17}
        height={17}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-[17px] w-[17px]"
        style={{ width: 17, height: 17 }}
        aria-hidden="true"
      >
        <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
        <path
          d="M16 9a5 5 0 0 1 0 6"
          className="transition-opacity duration-150"
          style={{ opacity: waveStep >= 1 ? 1 : 0.15 }}
        />
        <path
          d="M19.364 18.364a9 9 0 0 0 0-12.728"
          className="transition-opacity duration-150"
          style={{ opacity: waveStep >= 2 ? 1 : 0.15 }}
        />
      </svg>
    </button>
  );
}

function AnimatedChevronsUpDown({ isOpen, className = "h-4 w-4 shrink-0 text-[var(--muted-foreground)]" }) {
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
      className={className}
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

function CollapsibleDrawer({ isOpen, children }) {
  return (
    <div className="cd-collapsible-drawer" data-open={isOpen ? "true" : "false"}>
      <div className="cd-collapsible-inner">{children}</div>
    </div>
  );
}

const TOC_SECTIONS = [
  { id: "hero", title: "Overview", depth: 2 },
  { id: "about", title: "About & Telemetry", depth: 2 },
  { id: "what-i-can-do", title: "Technical Stack", depth: 2 },
  { id: "trainings", title: "Experience", depth: 2 },
  { id: "education", title: "Education", depth: 2 },
  { id: "work", title: "Projects", depth: 2 },
  { id: "awards", title: "Recognition", depth: 2 },
  { id: "contact", title: "Contact", depth: 2 },
];

function TOCMinimap() {
  const [activeId, setActiveId] = useState("hero");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const els = TOC_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleMouseEnter = () => {
    if (!hovered) {
      playMiniMapOpen();
    }
    setHovered(true);
  };

  const handleJump = (e, id) => {
    e.preventDefault();
    playSoftClick();
    setHovered(false);
    const el = document.getElementById(id);
    if (el) {
      window.history.pushState(null, "", `#${id}`);
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <div
      className="fixed top-28 right-5 z-40 hidden xl:block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Minimalist Tick Bars */}
      <div
        className={`flex flex-col items-end gap-3 py-3 pl-6 transition-opacity duration-200 ${
          hovered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Page sections minimap"
      >
        {TOC_SECTIONS.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <div
              key={sec.id}
              className={`h-0.5 rounded-full transition-all duration-200 ease-out ${
                isActive
                  ? "w-6 bg-[var(--foreground)]"
                  : "w-4 bg-[var(--muted-foreground)]/40"
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Expanded Hover Card */}
      {hovered && (
        <div className="animate-cd-minimap absolute top-0 right-0 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)]/95 p-2 shadow-xl backdrop-blur-md">
          <div className="px-3 py-1.5 font-mono text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
            On this page
          </div>
          <ul className="flex flex-col text-xs">
            {TOC_SECTIONS.map((sec) => {
              const isActive = activeId === sec.id;
              return (
                <li key={sec.id} className="flex">
                  <a
                    href={`#${sec.id}`}
                    onClick={(e) => handleJump(e, sec.id)}
                    className={`w-full rounded-lg px-3 py-1.5 transition-colors duration-150 ${
                      isActive
                        ? "bg-[var(--muted-bg)] font-medium text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)]/60 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {sec.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   CAD DIMENSION ANNOTATIONS (768, Ø160, 32, Handwritten Notes)
   ============================================================================ */

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

function FrameWidthDimension() {
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

function DiameterDimension({ diameter = 160 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 hidden text-[var(--dimension)] select-none lg:block"
      aria-hidden="true"
    >
      <div className="absolute top-0 right-1/2 -left-8 h-px bg-current" />
      <div className="absolute top-full right-1/2 -left-8 h-px -translate-y-px bg-current" />
      <div className="absolute inset-y-0 -left-6 flex -translate-x-1/2 flex-col items-center py-px">
        <DimensionArrow orientation="vertical" />
        <div className="w-px flex-1 bg-current" />
        <span className="py-1 font-mono text-xs leading-none text-[var(--dimension-foreground)] tabular-nums">
          Ø{diameter}
        </span>
        <div className="w-px flex-1 bg-current" />
        <DimensionArrow orientation="vertical" flip />
      </div>
    </div>
  );
}

function SeparatorHeightDimension({ height = 32 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 hidden text-[var(--dimension)] select-none lg:block"
      aria-hidden="true"
    >
      <div className="absolute top-0 -right-8 left-full h-px -translate-y-px bg-current" />
      <div className="absolute top-full -right-8 left-full h-px bg-current" />
      <div className="absolute -inset-y-px -right-6 flex translate-x-1/2 flex-col items-center py-px">
        <DimensionArrow orientation="vertical" />
        <div className="w-px flex-1 bg-current" />
        <DimensionArrow orientation="vertical" flip />
      </div>
      <span className="absolute top-1/2 left-full ml-8 -translate-y-1/2 font-mono text-xs leading-none text-[var(--dimension-foreground)] tabular-nums">
        {height}
      </span>
    </div>
  );
}

function HandwrittenArrow({ className = "" }) {
  return (
    <svg
      className={`h-8 w-8 shrink-0 text-blue-900 dark:text-[var(--muted-foreground)] ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M34 4c1 15-5 26-21 30" />
      <path d="m22 37-9-3 7.5-8" />
    </svg>
  );
}

/* ============================================================================
   INTERACTIVE ISOMETRIC 3D BLUEPRINT MARK (ChanhDai style with 30° CAD Arc)
   ============================================================================ */

const ISOMETRIC_ANGLE = Math.PI / 6;
const ANGLE_RADIUS = 88;
const ANGLE_VERTEX = { x: 333.05, y: 0.58 };
const ANGLE_START = { x: ANGLE_VERTEX.x + ANGLE_RADIUS, y: ANGLE_VERTEX.y };
const ANGLE_END = {
  x: ANGLE_VERTEX.x + ANGLE_RADIUS * Math.cos(ISOMETRIC_ANGLE),
  y: ANGLE_VERTEX.y + ANGLE_RADIUS * Math.sin(ISOMETRIC_ANGLE),
};
const ANGLE_LABEL = {
  x: ANGLE_VERTEX.x + (ANGLE_RADIUS + 18) * Math.cos(ISOMETRIC_ANGLE / 2),
  y: ANGLE_VERTEX.y + (ANGLE_RADIUS + 18) * Math.sin(ISOMETRIC_ANGLE / 2),
};

// Back-to-front ordered 30-degree isometric prisms for "S" and "K" (SK = Seavik)
const SK_ISOMETRIC_BOXES = [
  // K (Upper-Right Isometric Letter)
  { name: "K_top_arm", p0: [333.05, 0.58], p1: [416.19, 48.58], p2: [360.76, 80.58], p3: [277.62, 32.58] },
  { name: "K_knot", p0: [360.76, 80.58], p1: [416.19, 112.58], p2: [360.76, 144.58], p3: [305.34, 112.58] },
  { name: "K_bot_leg", p0: [471.61, 80.58], p1: [554.75, 128.58], p2: [499.33, 160.58], p3: [416.19, 112.58] },
  { name: "K_stem", p0: [222.2, 64.58], p1: [443.9, 192.58], p2: [388.48, 224.58], p3: [166.77, 96.58] },
  // S (Lower-Left Isometric Letter)
  { name: "S_top", p0: [111.35, 128.58], p1: [155.69, 154.18], p2: [44.84, 218.18], p3: [0.5, 192.58] },
  { name: "S_ul", p0: [44.84, 218.18], p1: [89.18, 243.78], p2: [44.84, 269.38], p3: [0.5, 243.78] },
  { name: "S_mid", p0: [155.69, 205.38], p1: [200.03, 230.98], p2: [133.52, 269.38], p3: [89.18, 243.78] },
  { name: "S_lr", p0: [244.37, 205.38], p1: [288.71, 230.98], p2: [244.37, 256.58], p3: [200.03, 230.98] },
  { name: "S_bot", p0: [244.37, 256.58], p1: [288.71, 282.18], p2: [222.2, 320.58], p3: [177.86, 294.98] },
];

function SeavikBlueprintIsometric() {
  const [pressOffset, setPressOffset] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [spot, setSpot] = useState({ x: 278, y: 177 });
  const svgRef = useRef(null);
  const physicsRef = useRef({
    targetX: 278,
    targetY: 177,
    curX: 278,
    curY: 177,
    velX: 0,
    velY: 0,
    targetPress: 0,
    curPress: 0,
    velPress: 0,
    rafId: null,
  });

  const startPhysicsLoop = useCallback(() => {
    const p = physicsRef.current;
    if (p.rafId) return;

    const step = () => {
      // Damped spring for spotlight (stiffness 0.14, damping 0.76)
      p.velX = (p.velX + (p.targetX - p.curX) * 0.14) * 0.76;
      p.velY = (p.velY + (p.targetY - p.curY) * 0.14) * 0.76;
      p.curX += p.velX;
      p.curY += p.velY;

      // Damped spring for 3D isometric extrusion press (stiffness 0.24, damping 0.72)
      p.velPress = (p.velPress + (p.targetPress - p.curPress) * 0.24) * 0.72;
      p.curPress += p.velPress;

      setSpot({ x: p.curX, y: p.curY });
      setPressOffset(p.curPress);

      const moving =
        Math.abs(p.targetX - p.curX) > 0.15 ||
        Math.abs(p.targetY - p.curY) > 0.15 ||
        Math.abs(p.targetPress - p.curPress) > 0.05 ||
        Math.abs(p.velPress) > 0.05;

      if (moving) {
        p.rafId = requestAnimationFrame(step);
      } else {
        p.curX = p.targetX;
        p.curY = p.targetY;
        p.curPress = p.targetPress;
        setSpot({ x: p.curX, y: p.curY });
        setPressOffset(p.curPress);
        p.rafId = null;
      }
    };

    p.rafId = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      const p = physicsRef.current;
      p.targetX = (e.clientX / window.innerWidth) * 556;
      p.targetY = (e.clientY / window.innerHeight) * 354;
      startPhysicsLoop();
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (physicsRef.current.rafId) {
        cancelAnimationFrame(physicsRef.current.rafId);
      }
    };
  }, [startPhysicsLoop]);

  const lastSoundTimeRef = useRef(0);

  const triggerMetalSound = () => {
    const now = performance.now();
    if (now - lastSoundTimeRef.current > 80) {
      lastSoundTimeRef.current = now;
      playMetalClick();
    }
  };

  const handlePointerDown = () => {
    triggerMetalSound();
    setIsPressed(true);
    physicsRef.current.targetPress = 16;
    startPhysicsLoop();
  };

  const handlePointerUp = () => {
    if (!isPressed && physicsRef.current.targetPress === 0) return;
    setIsPressed(false);
    physicsRef.current.targetPress = 0;
    startPhysicsLoop();
  };

  const handleClick = () => {
    triggerMetalSound();
    // Ensure a quick tap or keyboard click still visibly compresses and springs back
    physicsRef.current.targetPress = 16;
    startPhysicsLoop();
    setTimeout(() => {
      setIsPressed(false);
      physicsRef.current.targetPress = 0;
      startPhysicsLoop();
    }, 130);
  };

  const topOffset = pressOffset;
  const baseDepth = 32;

  return (
    <svg
      ref={svgRef}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="h-auto w-full cursor-pointer touch-manipulation overflow-visible select-none"
      viewBox="0 0 556 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Interactive SK Isometric CAD Blueprint"
    >
      <defs>
        <pattern
          id="seavik-face-pattern"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--border)"
            strokeWidth="1"
          />
        </pattern>

        <radialGradient
          id="seavik-radial-spot"
          cx={spot.x}
          cy={spot.y}
          r="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Full 556x354 hit rect so clicking anywhere in the SK blueprint area triggers press & sound */}
      <rect width="556" height="354" fill="transparent" />

      {/* Isometric projection construction lines */}
      <g stroke="var(--line)" strokeWidth="1" strokeDasharray="4 2">
        <path d="M-477.55 756.57L1254.51 -243.41" />
        <path d="M977.37 788.58L-754.67 -211.42" />
        <path d="M1143.65 692.58L-588.39 -307.42" />
      </g>

      {/* Back-to-Front 3D Isometric Extruded Prisms for "S" and "K" */}
      {SK_ISOMETRIC_BOXES.map((box) => {
        const [x0, y0] = [box.p0[0], box.p0[1] + topOffset];
        const [x1, y1] = [box.p1[0], box.p1[1] + topOffset];
        const [x2, y2] = [box.p2[0], box.p2[1] + topOffset];
        const [x3, y3] = [box.p3[0], box.p3[1] + topOffset];

        const by1 = box.p1[1] + baseDepth;
        const by2 = box.p2[1] + baseDepth;
        const by3 = box.p3[1] + baseDepth;

        const topPath = `M${x0.toFixed(2)} ${y0.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}L${x3.toFixed(2)} ${y3.toFixed(2)}Z`;
        const wallPath = `M${x3.toFixed(2)} ${y3.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}L${x1.toFixed(2)} ${y1.toFixed(2)}L${x1.toFixed(2)} ${by1.toFixed(2)}L${x2.toFixed(2)} ${by2.toFixed(2)}L${x3.toFixed(2)} ${by3.toFixed(2)}Z`;
        const edgePath = `${topPath}M${x3.toFixed(2)} ${y3.toFixed(2)}V${by3.toFixed(2)}L${x2.toFixed(2)} ${by2.toFixed(2)}L${x1.toFixed(2)} ${by1.toFixed(2)}V${y1.toFixed(2)}M${x2.toFixed(2)} ${y2.toFixed(2)}V${by2.toFixed(2)}`;

        return (
          <g key={box.name}>
            {/* Extruded vertical side walls */}
            <path d={wallPath} fill="var(--background)" />
            {/* Top isometric face + diagonal hatch fill */}
            <path d={topPath} fill="var(--background)" />
            <path d={topPath} fill="url(#seavik-face-pattern)" />
            {/* Base wireframe + cursor-reactive spotlight stroke */}
            <path d={edgePath} stroke="var(--border)" strokeWidth="1.2" strokeLinejoin="round" />
            <path d={edgePath} stroke="url(#seavik-radial-spot)" strokeWidth="1.35" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* 30° CAD Angle Callout at top vertex of K (fades while pressed, returns at rest) */}
      <g
        className="pointer-events-none hidden text-[var(--dimension)] transition-opacity duration-200 sm:block"
        style={{ opacity: isPressed ? 0 : 1 }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      >
        <path d={`M${ANGLE_VERTEX.x} ${ANGLE_VERTEX.y}H${ANGLE_START.x + 12}`} />
        <path
          d={`M${ANGLE_START.x} ${ANGLE_START.y}A${ANGLE_RADIUS} ${ANGLE_RADIUS} 0 0 1 ${ANGLE_END.x} ${ANGLE_END.y}`}
        />
        <path
          fill="var(--background)"
          d="M0 0 8-3v6Z"
          transform={`translate(${ANGLE_START.x} ${ANGLE_START.y}) rotate(90)`}
        />
        <path
          fill="var(--background)"
          d="M0 0 8-3v6Z"
          transform={`translate(${ANGLE_END.x} ${ANGLE_END.y}) rotate(-60)`}
        />
        <text
          fill="var(--dimension-foreground)"
          className="font-mono select-none"
          x={ANGLE_LABEL.x}
          y={ANGLE_LABEL.y}
          stroke="none"
          fontSize="12"
          textAnchor="middle"
          dominantBaseline="central"
        >
          30°
        </text>
      </g>
    </svg>
  );
}

/* ============================================================================
   LIVE PHNOM PENH LOCAL TIME CLOCK (Asia/Phnom_Penh, UTC+7)
   ============================================================================ */

function clockHandsPath(hour, minute) {
  const h = hour % 12;
  const round = (n) => Math.round(n * 1000) / 1000;
  const minuteAngle = (minute / 60) * 2 * Math.PI;
  const hourAngle = ((h + minute / 60) / 12) * 2 * Math.PI;
  const hx = round(12 + 3.6 * Math.sin(hourAngle));
  const hy = round(12 - 3.6 * Math.cos(hourAngle));
  const mx = round(12 + 6 * Math.sin(minuteAngle));
  const my = round(12 - 6 * Math.cos(minuteAngle));
  return `M12 12 L${hx} ${hy} M12 12 L${mx} ${my}`;
}

function CurrentLocalTimeItem({ timeZone = "Asia/Phnom_Penh" }) {
  const [clock, setClock] = useState({
    hour: "12",
    minute: "00",
    period: "PM",
    diff: " // UTC+7",
    hands: clockHandsPath(12, 0),
  });

  useEffect(() => {
    const update = () => {
      try {
        const now = new Date();
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).formatToParts(now);
        const getPart = (t) => parts.find((p) => p.type === t)?.value ?? "";
        const hourStr = getPart("hour");
        const minuteStr = getPart("minute");
        const periodStr = getPart("dayPeriod");

        const viewerOffset = -now.getTimezoneOffset();
        const targetOffset =
          (new Date(now.toLocaleString("en-US", { timeZone })).getTime() -
            new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime()) /
          60000;
        const hoursDiff = Math.abs(targetOffset - viewerOffset) / 60;
        const diff =
          hoursDiff < 0.5
            ? " // same time"
            : ` // ${Math.round(hoursDiff)}h ${targetOffset > viewerOffset ? "ahead" : "behind"}`;

        setClock({
          hour: hourStr,
          minute: minuteStr,
          period: periodStr,
          diff,
          hands: clockHandsPath(parseInt(hourStr, 10) || 12, parseInt(minuteStr, 10) || 0),
        });
      } catch {}
    };
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <div className="flex min-w-0 items-center gap-2.5 font-mono text-xs sm:gap-3.5 sm:text-sm">
      <IconTile>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d={clock.hands} />
        </svg>
      </IconTile>
      <p className="min-w-0 truncate">
        <span className="tabular-nums">{clock.hour}</span>
        <span className="animate-cd-blink">:</span>
        <span className="tabular-nums">{clock.minute}</span>{" "}
        <span>{clock.period}</span>
        <span className="text-[var(--muted-foreground)]">{clock.diff}</span>
      </p>
    </div>
  );
}

/* ============================================================================
   REAL GITHUB CONTRIBUTIONS CALENDAR GRAPH (@Seavik2142 — ChanhDai CAD style)
   ============================================================================ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CONTRIB_BLOCK_SIZE = 11;
const CONTRIB_BLOCK_GAP = 3;
const CONTRIB_COL_STEP = CONTRIB_BLOCK_SIZE + CONTRIB_BLOCK_GAP;

function parseIsoDateUTC(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatIsoDateUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatContributionDate(iso) {
  const dt = parseIsoDateUTC(iso);
  return `${MONTHS[dt.getUTCMonth()] || ""} ${dt.getUTCDate()}, ${dt.getUTCFullYear()}`;
}

function buildContributionCalendar(contributions) {
  if (!Array.isArray(contributions) || contributions.length === 0) {
    return { weeks: [], monthLabels: [], total: 0 };
  }

  const sorted = [...contributions]
    .filter((c) => c && typeof c.date === "string")
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length === 0) {
    return { weeks: [], monthLabels: [], total: 0 };
  }

  // Fill any missing dates cleanly in UTC so columns stay aligned to Sunday..Saturday
  const byDate = new Map(sorted.map((item) => [item.date, item]));
  const startDate = parseIsoDateUTC(sorted[0].date);
  const endDate = parseIsoDateUTC(sorted[sorted.length - 1].date);

  const normalized = [];
  for (let ts = startDate.getTime(); ts <= endDate.getTime(); ts += 86400000) {
    const iso = formatIsoDateUTC(new Date(ts));
    normalized.push(byDate.get(iso) || { date: iso, count: 0, level: 0 });
  }

  const leadingPad = startDate.getUTCDay(); // 0 = Sun .. 6 = Sat
  const padded = [...new Array(leadingPad).fill(null), ...normalized];
  const weekCount = Math.ceil(padded.length / 7);
  const weeks = [];

  for (let w = 0; w < weekCount; w++) {
    const col = padded.slice(w * 7, w * 7 + 7);
    while (col.length < 7) col.push(null);
    weeks.push(col);
  }

  // Place month labels above the exact week where each month begins (avoiding edge collisions)
  const rawLabels = [];
  weeks.forEach((week, weekIndex) => {
    const firstValid = week.find(Boolean);
    if (!firstValid) return;
    const monthLabel = MONTHS[parseIsoDateUTC(firstValid.date).getUTCMonth()];
    const prev = rawLabels[rawLabels.length - 1];
    if (weekIndex === 0 || !prev || prev.label !== monthLabel) {
      rawLabels.push({ weekIndex, label: monthLabel });
    }
  });

  const minWeeks = 3;
  const monthLabels = rawLabels.filter(({ weekIndex }, idx, arr) => {
    if (idx === 0) {
      return arr[1] ? arr[1].weekIndex - weekIndex >= minWeeks : true;
    }
    if (idx === arr.length - 1) {
      return weeks.length - weekIndex >= minWeeks;
    }
    return true;
  });

  const total = normalized.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  return { weeks, monthLabels, total };
}

function GitHubContributionsPanel({ initialData }) {
  const [selectedYear, setSelectedYear] = useState(initialData?.year || "last");
  const [activeData, setActiveData] = useState(() => initialData || null);
  const [availableYears, setAvailableYears] = useState(() =>
    Array.isArray(initialData?.availableYears) && initialData.availableYears.length > 0
      ? initialData.availableYears
      : [String(new Date().getUTCFullYear()), String(new Date().getUTCFullYear() - 1)]
  );
  const [isLoading, setIsLoading] = useState(() => !initialData?.contributions?.length);
  const [hasError, setHasError] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [pinnedCell, setPinnedCell] = useState(null);
  const cacheRef = useRef(
    initialData?.contributions?.length
      ? { [initialData.year || "last"]: initialData }
      : {}
  );

  const loadYearData = useCallback(async (yearKey) => {
    if (cacheRef.current[yearKey]) {
      setActiveData(cacheRef.current[yearKey]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch(`/api/github-contributions?year=${encodeURIComponent(yearKey)}`);
      if (!res.ok) throw new Error("Failed to fetch GitHub contributions");
      const json = await res.json();
      if (Array.isArray(json?.contributions) && json.contributions.length > 0) {
        cacheRef.current[yearKey] = json;
        setActiveData(json);
        if (Array.isArray(json.availableYears) && json.availableYears.length > 0) {
          setAvailableYears(json.availableYears);
        }
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // If SSR had no data (e.g. transient network issue during static build), fetch live on mount
  useEffect(() => {
    if (!initialData?.contributions?.length) {
      loadYearData("last");
    }
  }, [initialData, loadYearData]);

  const handleSelectYear = (yearKey) => {
    if (yearKey === selectedYear) return;
    playTickClick();
    setSelectedYear(yearKey);
    setHoveredCell(null);
    setPinnedCell(null);
    loadYearData(yearKey);
  };

  const calendar = useMemo(
    () => buildContributionCalendar(activeData?.contributions || []),
    [activeData]
  );

  const displayTotal =
    typeof activeData?.total === "number" && activeData.total > 0
      ? activeData.total
      : calendar.total;
  const activeCell = hoveredCell || pinnedCell;
  const gridWidth = Math.max(
    calendar.weeks.length * CONTRIB_COL_STEP - CONTRIB_BLOCK_GAP,
    660
  );

  const getLevelClass = (level) => {
    switch (level) {
      case 1:
        return "bg-zinc-300 dark:bg-zinc-700";
      case 2:
        return "bg-zinc-400 dark:bg-zinc-500";
      case 3:
        return "bg-zinc-700 dark:bg-zinc-300";
      case 4:
        return "bg-zinc-950 dark:bg-white";
      default:
        return "bg-zinc-100 dark:bg-zinc-900";
    }
  };

  const yearOptions = useMemo(() => {
    const uniqueYears = availableYears.filter((y) => /^\d{4}$/.test(String(y))).slice(0, 3);
    return [{ key: "last", label: "Last year" }, ...uniqueYears.map((y) => ({ key: String(y), label: String(y) }))];
  }, [availableYears]);

  return (
    <Panel>
      <div className="px-2.5 py-3.5 sm:px-3 sm:py-4">
        {/* Top bar: Live GitHub label + Year switcher */}
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <h2 className="font-mono text-xs font-medium text-[var(--foreground)]">
              Contribution Activity
            </h2>
            <a
              href="https://github.com/Seavik2142"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSoftClick()}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--muted-bg)]/50 px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] transition-colors hover:border-[var(--foreground)]/30 hover:text-[var(--foreground)]"
            >
              <Github className="h-2.5 w-2.5" />
              <span>@Seavik2142</span>
            </a>
          </div>

          <div
            className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--muted-bg)]/40 p-0.5 font-mono text-[10px]"
            role="tablist"
            aria-label="Select GitHub contribution range"
          >
            {yearOptions.map((opt) => {
              const isSelected = selectedYear === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectYear(opt.key)}
                  className={`rounded px-2 py-0.5 transition-colors ${
                    isSelected
                      ? "bg-[var(--foreground)] text-[var(--background)] font-medium"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Month Header + Real GitHub 53-week Calendar Matrix */}
        <div className="overflow-x-auto pb-1.5 [-webkit-overflow-scrolling:touch]">
          {calendar.weeks.length > 0 ? (
            <div
              className={`transition-opacity duration-200 ${isLoading ? "opacity-50" : "opacity-100"}`}
              style={{ width: `${gridWidth}px` }}
            >
              {/* Exact month labels aligned to each month's first week column */}
              <div className="relative mb-1.5 h-3.5 font-mono text-[10px] leading-none text-[var(--muted-foreground)] select-none">
                {calendar.monthLabels.map(({ weekIndex, label }) => (
                  <span
                    key={`${label}-${weekIndex}`}
                    className="absolute top-0"
                    style={{ left: `${weekIndex * CONTRIB_COL_STEP}px` }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex gap-[3px]" role="grid" aria-label="GitHub contribution graph">
                {calendar.weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3px]" role="row">
                    {week.map((cell, dIdx) => {
                      if (!cell) {
                        return (
                          <span
                            key={dIdx}
                            className="h-[11px] w-[11px] rounded-[2px] opacity-0"
                            aria-hidden="true"
                          />
                        );
                      }
                      const labelText = `${
                        cell.count === 0
                          ? "No contributions"
                          : `${cell.count} contribution${cell.count === 1 ? "" : "s"}`
                      } on ${formatContributionDate(cell.date)}`;
                      const isPinned = pinnedCell?.date === cell.date;

                      return (
                        <button
                          key={cell.date}
                          type="button"
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                          onFocus={() => setHoveredCell(cell)}
                          onBlur={() => setHoveredCell(null)}
                          onClick={() => {
                            playTickClick();
                            setPinnedCell((prev) => (prev?.date === cell.date ? null : cell));
                          }}
                          className={`h-[11px] w-[11px] rounded-[2px] p-0 transition-transform hover:scale-125 focus:outline-none focus:ring-1 focus:ring-[var(--foreground)] ${getLevelClass(
                            cell.level
                          )} ${isPinned ? "scale-125 ring-1 ring-[var(--foreground)]" : ""}`}
                          title={labelText}
                          aria-label={labelText}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex h-[112px] min-w-[660px] items-center justify-center rounded-lg border border-dashed border-[var(--border)] font-mono text-xs text-[var(--muted-foreground)]">
              Syncing live GitHub contributions for @Seavik2142…
            </div>
          ) : (
            <div className="flex h-[112px] min-w-[660px] items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--border)] font-mono text-xs text-[var(--muted-foreground)]">
              <span>Unable to reach GitHub right now.</span>
              <button
                type="button"
                onClick={() => {
                  playTickClick();
                  loadYearData(selectedYear);
                }}
                className="rounded border border-[var(--border)] px-2 py-0.5 text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-0.5 font-mono text-[11px] text-[var(--muted-foreground)] sm:text-xs">
          <div>
            {activeCell ? (
              <span className="font-medium text-[var(--foreground)]">
                {activeCell.count === 0
                  ? "No contributions"
                  : `${activeCell.count} contribution${activeCell.count === 1 ? "" : "s"}`}{" "}
                on {formatContributionDate(activeCell.date)}
              </span>
            ) : hasError && calendar.weeks.length === 0 ? (
              <span>
                View full history on{" "}
                <a
                  href="https://github.com/Seavik2142"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-[var(--foreground)]"
                >
                  GitHub
                </a>
                .
              </span>
            ) : (
              <span>
                <strong className="font-medium text-[var(--foreground)] tabular-nums">
                  {displayTotal.toLocaleString("en-US")}
                </strong>{" "}
                contributions {selectedYear === "last" ? "in the last year" : `in ${selectedYear}`} on{" "}
                <a
                  href="https://github.com/Seavik2142"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-[var(--foreground)]"
                >
                  GitHub
                </a>
                .
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px]" aria-hidden="true">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <span
                key={lvl}
                className={`inline-block h-[11px] w-[11px] rounded-[2px] ${getLevelClass(lvl)}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================================
   ANIMATED TECHNICAL PEN SIGNATURE (Mao Seavik's Handwritten Signature)
   ============================================================================ */

// Pixel-accurate vector trace of Mao Seavik's handwritten signature (viewBox 0 0 180 144, natural 1.25:1 aspect):
// 1: Double-arch monogram + oval loop + horizontal sweep
// 2: Confident ascending diagonal underline slash with crisp start/end ticks
// 3: Final accent ink dash above the underline tip
const SEAVIK_MONOGRAM_STROKE =
  "M 35.8 22.8 C 27.8 15.8 29.8 8.8 37.2 10.2 C 48.4 12.2 55.8 44.5 57.2 78.8 C 57.8 47.0 65.2 12.5 78.5 6.2 C 91.2 4.0 92.8 53.5 95.5 74.5 C 97.2 80.2 100.8 79.2 104.5 65.5 C 109.2 49.0 109.2 33.8 94.2 30.8 C 69.0 27.6 36.8 41.2 22.2 60.5 C 16.8 67.5 22.0 72.2 38.5 67.4 C 74.5 57.5 125.5 43.2 149.2 45.2 C 147.0 45.5 141.0 46.8 134.5 48.2";

const SEAVIK_UNDERLINE_STROKE =
  "M 10.5 130.5 C 8.2 135.0 6.8 138.2 8.6 137.4 C 56.0 111.5 116.5 81.2 171.8 60.5 C 172.6 60.2 170.5 59.3 168.8 58.8";

const SEAVIK_DOT_STROKE =
  "M 158.8 57.6 C 160.0 57.9 161.2 57.9 162.4 57.6";

function TechnicalPen({ transform }) {
  return (
    <g fill="var(--background)" transform={transform}>
      <path d="M-5 -34V-74Q-5 -76 -3 -76H3Q5 -76 5 -74V-34Z" />
      <path fill="currentColor" d="M-5.5 -30H5.5V-34H-5.5Z" />
      <path d="M-4.5 -14H4.5V-30H-4.5Z" />
      <path d="M-1.5 -6L-4.5 -14H4.5L1.5 -6Z" />
      <path d="M0 0V-6" />
    </g>
  );
}

function SeavikSignature({ className = "" }) {
  const btnRef = useRef(null);
  const monogramRef = useRef(null);
  const underlineRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const soundRef = useRef(null);
  const hasSignedRef = useRef(false);

  const [state, setState] = useState({
    len1: 520,
    drawn1: 520,
    len2: 210,
    drawn2: 210,
    len3: 6,
    drawn3: 6,
    penX: 162.4,
    penY: 57.6,
    penOpacity: 0,
  });

  const runSignatureAnimation = useCallback(() => {
    const p1 = monogramRef.current;
    const p2 = underlineRef.current;
    const p3 = dotRef.current;
    if (!p1 || !p2 || !p3) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const len1 = p1.getTotalLength() || 520;
    const len2 = p2.getTotalLength() || 210;
    const len3 = p3.getTotalLength() || 6;
    const totalDurationMs = 2000;
    const startTime = performance.now();
    const angleRad = (42 * Math.PI) / 180;

    // Silky smooth cubic ease-in-out
    const easeInOutCubic = (u) =>
      u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;

    const tick = (now) => {
      const elapsed = (now - startTime) / 1000; // seconds (0 -> 2.00s)

      let drawn1 = len1;
      let drawn2 = len2;
      let drawn3 = len3;
      let pt = { x: 35.8, y: 22.8 };
      let lift = 1;
      let penOpacity = 0;

      if (elapsed < 0.12) {
        // Phase 0 (0.00s - 0.12s): Pen glides down smoothly onto start of Monogram
        const u = easeInOutCubic(elapsed / 0.12);
        drawn1 = 0;
        drawn2 = 0;
        drawn3 = 0;
        pt = { x: 35.8, y: 22.8 };
        lift = 1 - u;
        penOpacity = u;
      } else if (elapsed < 1.28) {
        // Phase 1 (0.12s - 1.28s): Draw Double-Arch Monogram + Oval Loop + Sweep
        const u = Math.min(1, Math.max(0, (elapsed - 0.12) / 1.16));
        // Gentle blend of linear + cubic ease for natural handwriting momentum
        const progress1 = 0.35 * u + 0.65 * easeInOutCubic(u);
        drawn1 = progress1 * len1;
        drawn2 = 0;
        drawn3 = 0;
        try {
          pt = p1.getPointAtLength(drawn1);
        } catch {}
        lift = 0;
        penOpacity = 1;
      } else if (elapsed < 1.44) {
        // Phase 2 (1.28s - 1.44s): Graceful parabolic air-lift to underline start
        const u = Math.min(1, Math.max(0, (elapsed - 1.28) / 0.16));
        const smoothU = easeInOutCubic(u);
        drawn1 = len1;
        drawn2 = 0;
        drawn3 = 0;
        pt = {
          x: 134.5 + (10.5 - 134.5) * smoothU,
          y: 48.2 + (130.5 - 48.2) * smoothU,
        };
        lift = Math.sin(u * Math.PI) * 0.85;
        penOpacity = 0.94;
      } else if (elapsed < 1.88) {
        // Phase 3 (1.44s - 1.88s): Confident ascending diagonal underline slash
        const u = Math.min(1, Math.max(0, (elapsed - 1.44) / 0.44));
        const progress2 = 1 - Math.pow(1 - u, 2.2);
        drawn1 = len1;
        drawn2 = progress2 * len2;
        drawn3 = 0;
        try {
          pt = p2.getPointAtLength(drawn2);
        } catch {}
        lift = 0;
        penOpacity = 1;
      } else if (elapsed < 1.95) {
        // Phase 4 (1.88s - 1.95s): Accent ink dash touch at (158.8, 57.6 -> 162.4, 57.6)
        const u = Math.min(1, Math.max(0, (elapsed - 1.88) / 0.07));
        drawn1 = len1;
        drawn2 = len2;
        drawn3 = u * len3;
        try {
          pt = p3.getPointAtLength(drawn3);
        } catch {}
        lift = 0.08;
        penOpacity = 1;
      } else if (elapsed < 2.04) {
        // Phase 5 (1.95s - 2.04s): Pen lifts smoothly away
        const u = Math.min(1, Math.max(0, (elapsed - 1.95) / 0.09));
        drawn1 = len1;
        drawn2 = len2;
        drawn3 = len3;
        pt = { x: 162.4, y: 57.6 };
        lift = u;
        penOpacity = 1 - u;
      } else {
        drawn1 = len1;
        drawn2 = len2;
        drawn3 = len3;
        pt = { x: 162.4, y: 57.6 };
        lift = 1;
        penOpacity = 0;
      }

      const liftDist = lift * 16;
      setState({
        len1,
        drawn1,
        len2,
        drawn2,
        len3,
        drawn3,
        penX: pt.x + liftDist * Math.sin(angleRad),
        penY: pt.y - liftDist * Math.cos(angleRad),
        penOpacity,
      });

      if (elapsed * 1000 < totalDurationMs + 60) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const node = btnRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasSignedRef.current) {
          hasSignedRef.current = true;
          runSignatureAnimation();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(node);
    return () => {
      obs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (soundRef.current?.stop) soundRef.current.stop();
    };
  }, [runSignatureAnimation]);

  const handleReplay = () => {
    if (soundRef.current?.stop) {
      soundRef.current.stop();
    }
    void playPenScratch().then((handle) => {
      soundRef.current = handle;
    });
    runSignatureAnimation();
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleReplay}
      title="Click to replay handwritten signature"
      aria-label="Replay signature"
      className={`group/sig relative inline-flex cursor-pointer items-center rounded-md py-0.5 outline-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="block h-14 w-[70px] max-w-full overflow-visible text-blue-900 sm:h-16 sm:w-[82px] dark:text-[var(--foreground)]"
        fill="none"
        viewBox="0 0 180 144"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
        aria-hidden="true"
      >
        {/* Stroke 1: Double-arch monogram + sweeping oval loop */}
        <path
          ref={monogramRef}
          d={SEAVIK_MONOGRAM_STROKE}
          strokeDasharray={state.len1}
          strokeDashoffset={Math.max(0, state.len1 - state.drawn1)}
          style={{ opacity: state.drawn1 > 0.5 ? 1 : 0 }}
        />
        {/* Stroke 2: Confident diagonal underline slash */}
        <path
          ref={underlineRef}
          d={SEAVIK_UNDERLINE_STROKE}
          strokeDasharray={state.len2}
          strokeDashoffset={Math.max(0, state.len2 - state.drawn2)}
          style={{ opacity: state.drawn2 > 0.5 ? 1 : 0 }}
        />
        {/* Stroke 3: Terminal accent ink dash */}
        <path
          ref={dotRef}
          d={SEAVIK_DOT_STROKE}
          strokeDasharray={state.len3}
          strokeDashoffset={Math.max(0, state.len3 - state.drawn3)}
          style={{ opacity: state.drawn3 > 0.2 ? 1 : 0 }}
        />
        {state.penOpacity > 0.01 && (
          <g
            transform={`translate(${state.penX.toFixed(2)}, ${state.penY.toFixed(2)})`}
            opacity={state.penOpacity}
          >
            <TechnicalPen transform="rotate(42) scale(1.18)" />
          </g>
        )}
      </svg>
    </button>
  );
}

const SEAVIK_LOGOTYPE_PATH =
  "M33 1H129V33H33V1ZM129 33H161V65H129V33ZM1 33H33V97H1V33ZM33 97H129V129H33V97ZM129 129H161V225H129V129ZM1 193H33V225H1V193ZM33 225H129V257H33V225ZM225 65H321V97H225V65ZM321 97H353V129H321V97ZM225 129H321V161H225V129ZM193 97H225V225H193V97ZM225 225H353V257H225V225ZM417 65H513V97H417V65ZM513 65H545V257H513V65ZM385 97H417V225H385V97ZM481 193H513V225H481V193ZM417 225H481V257H417V225ZM577 65H609V129H577V65ZM609 129H641V193H609V129ZM641 193H673V257H641V193ZM673 129H705V193H673V129ZM705 65H737V129H705V65ZM801 1H833V33H801V1ZM769 65H801V97H769V65ZM801 65H833V257H801V65ZM865 1H897V257H865V1ZM961 65H1025V97H961V65ZM929 97H961V129H929V97ZM897 129H929V161H897V129ZM929 161H993V193H929V161ZM993 193H1025V257H993V193Z";

function SiteFooterInteractiveLogotype() {
  const [width, setWidth] = useState(1280);
  const [mousePct, setMousePct] = useState(0.5);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const obs = new ResizeObserver(([entry]) => {
      if (entry?.contentRect?.width) {
        setWidth(Math.round(entry.contentRect.width));
      }
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div className="screen-line-top screen-line-bottom relative after:z-10">
        <div
          className="cursor-pointer overflow-hidden"
          onClick={() => playTickClick()}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePct((e.clientX - rect.left) / rect.width);
          }}
          onMouseLeave={() => {
            setHovered(false);
            setMousePct(0.5);
          }}
        >
          <div className="flex w-full translate-y-[37.5%] items-center justify-center">
            <svg
              className="mx-auto h-auto w-full max-w-7xl select-none"
              viewBox="0 0 1026 258"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="#seavik-logotype-glyphs" fill="url(#seavik-logotype-hatch)" />
              <use
                href="#seavik-logotype-outline"
                stroke="var(--background)"
                strokeWidth="2"
              />
              <use
                href="#seavik-logotype-glyphs"
                fill="url(#seavik-logotype-gradient)"
                style={{
                  opacity: hovered ? 0.55 : 0.12,
                  transition: "opacity 0.35s ease",
                }}
              />
              <use
                href="#seavik-logotype-outline"
                stroke="var(--foreground)"
                strokeOpacity="0.14"
                strokeWidth="2"
              />

              <defs>
                <g id="seavik-logotype-glyphs">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d={SEAVIK_LOGOTYPE_PATH}
                  />
                </g>

                <path id="seavik-logotype-outline" d={SEAVIK_LOGOTYPE_PATH} />

                <pattern
                  id="seavik-logotype-hatch"
                  x="1"
                  y="1"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M-1 1l2-2M0 8l8-8M7 9l2-2"
                    stroke="var(--line)"
                    strokeWidth="1"
                  />
                </pattern>

                <linearGradient
                  id="seavik-logotype-gradient"
                  x1={mousePct * 1026}
                  y1="1"
                  x2="513"
                  y2="257"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop
                    offset="0.625"
                    stopColor="var(--foreground)"
                    stopOpacity="0"
                  />
                  <stop offset="1" stopColor="var(--foreground)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-1/2 max-w-full -translate-x-1/2 dark:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Live Container Width Dimension under logotype */}
      <div className="px-1 sm:px-0">
        <div
          ref={containerRef}
          className="pointer-events-none relative mx-auto h-7 w-full max-w-7xl text-[var(--dimension)] select-none sm:h-8"
          aria-hidden="true"
        >
          <div className="absolute top-1 bottom-0 left-0 w-px bg-current" />
          <div className="absolute top-1 right-0 bottom-0 w-px bg-current" />
          <div className="absolute inset-x-0 bottom-0 flex items-center px-px">
            <DimensionArrow orientation="horizontal" />
            <div className="h-px flex-1 bg-current" />
            <span className="px-1.5 font-mono text-xs leading-none text-[var(--dimension-foreground)] tabular-nums">
              {width}
            </span>
            <div className="h-px flex-1 bg-current" />
            <DimensionArrow orientation="horizontal" flip />
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================================
   TECH LOGO LOOKUP FOR PROJECT TAGS
   ============================================================================ */

const TECH_LOGO_MAP = {
  Python: "/images/logos/python.png",
  "Python Flask": "/images/logos/flask.png",
  Flask: "/images/logos/flask.png",
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
};

/* ============================================================================
   MAIN PORTFOLIO COMPONENT (ChanhDai CAD / Blueprint Design)
   ============================================================================ */

export default function Portfolio({ initialContributions = null }) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [greeting, setGreeting] = useState("Hello");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [avatarRevealed, setAvatarRevealed] = useState(false);

  // Collapsible states for Experience, Education, Projects, Recognition
  const [expandedExp, setExpandedExp] = useState(() => ({
    "hf-ml-engineering": true,
    "kru-backend": true,
  }));
  const [showAllExp, setShowAllExp] = useState(false);

  const [expandedEdu, setExpandedEdu] = useState(() => ({
    "norton-cs": true,
  }));

  const [projectFilter, setProjectFilter] = useState("ALL");
  const [expandedProjects, setExpandedProjects] = useState(() => ({
    "01": true,
    "02": true,
  }));
  const [showAllProjects, setShowAllProjects] = useState(false);

  const [expandedCerts, setExpandedCerts] = useState(() => ({
    "kru-backend-internship": true,
  }));

  // Contact & Media Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMinimized, setIsModalMinimized] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const openMedia = useCallback((media) => {
    playMiniMapOpen();
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  }, []);

  const toggleExpItem = useCallback((id) => {
    setExpandedExp((prev) => {
      const next = !prev[id];
      if (next) playExpandSound();
      else playCollapseSound();
      return { ...prev, [id]: next };
    });
  }, []);

  const toggleEduItem = useCallback((id) => {
    setExpandedEdu((prev) => {
      const next = !prev[id];
      if (next) playExpandSound();
      else playCollapseSound();
      return { ...prev, [id]: next };
    });
  }, []);

  const toggleProjectItem = useCallback((num) => {
    setExpandedProjects((prev) => {
      const next = !prev[num];
      if (next) playExpandSound();
      else playCollapseSound();
      return { ...prev, [num]: next };
    });
  }, []);

  const toggleCertItem = useCallback((id) => {
    setExpandedCerts((prev) => {
      const next = !prev[id];
      if (next) playExpandSound();
      else playCollapseSound();
      return { ...prev, [id]: next };
    });
  }, []);

  const openResumePdf = useCallback(() => {
    openMedia({
      url: "/resume/Mao Seavik_Resume.pdf",
      title: "Mao Seavik — Resume",
      subtitle: "Curriculum Vitae • Verified Document",
      type: "pdf",
    });
  }, [openMedia]);

  // Rotate profile taglines every 3.2s
  useEffect(() => {
    const id = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  // Time-of-day greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) setGreeting("Good morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const copyEmail = () => {
    playSoftClick();
    navigator.clipboard?.writeText("MaoSeavik@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Filtered projects
  const filteredProjects = ALL_PROJECTS.filter((p) => {
    if (projectFilter === "ALL") return true;
    if (projectFilter === "ML & AI") return p.category.toLowerCase().includes("ai");
    if (projectFilter === "WEB & BACKEND")
      return !p.category.toLowerCase().includes("ai") && !p.category.toLowerCase().includes("digital");
    if (projectFilter === "DIGITAL") return p.category.toLowerCase().includes("digital");
    return true;
  });

  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 5);
  const visibleExperiences = showAllExp ? EXPERIENCE : EXPERIENCE.slice(0, 3);

  return (
    <div className="group/layout relative isolate min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Header onOpenResume={openResumePdf} />
      <TOCMinimap />

      <main className="max-w-[100vw] overflow-x-clip px-2">
        <div className="mx-auto md:max-w-3xl">
          {/* 768px Top CAD Dimension Bar */}
          <FrameWidthDimension />

          {/* ================================================================
              1. PROFILE HEADER (Isometric Blueprint + Ø160 Avatar + Taglines)
             ================================================================ */}
          <div
            id="hero"
            className="screen-line-top screen-line-bottom grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-y-clip border-x border-[var(--line)]"
          >
            {/* Isometric 3D Blueprint Figure */}
            <figure className="relative col-span-2 p-3 sm:col-span-1 sm:col-start-2 sm:p-5">
              <SeavikBlueprintIsometric />

              {/* Handwritten margin annotation (right outer gutter on xl screens) */}
              <div
                className="pointer-events-none absolute bottom-16 left-full ml-3 hidden w-36 flex-col items-start font-handwritten text-lg leading-none text-blue-900 select-none xl:flex dark:text-[var(--muted-foreground)]"
                aria-hidden="true"
              >
                <HandwrittenArrow className="-scale-y-100 -rotate-6" />
                <span className="ml-3 -rotate-6">
                  follows your cursor
                  <span className="block" />
                  click for a sound
                </span>
              </div>
            </figure>

            {/* Left Column: Circular Avatar with Ø160 CAD Diameter Callout */}
            <div className="flex flex-col sm:row-span-2 sm:row-start-1">
              <div className="screen-line-top mt-auto shrink-0 border-r border-[var(--line)] p-1.5 sm:p-0">
                <div className="-mx-px my-0 flex outline-none">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Mao Seavik profile photo — hover or tap to reveal full color"
                    onMouseLeave={() => setAvatarRevealed(false)}
                    onClick={() => {
                      playTickClick();
                      setAvatarRevealed((prev) => !prev);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        playTickClick();
                        setAvatarRevealed((prev) => !prev);
                      }
                    }}
                    className="group/avatar relative z-10 h-24 w-24 cursor-pointer rounded-full outline-none min-[390px]:h-28 min-[390px]:w-28 sm:h-40 sm:w-40"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-full">
                      {/* Default Layer (Cursor Away): Monochrome Manga/Ink Illustrated Portrait */}
                      <img
                        src="/images/about/profile-mono-light.jpg"
                        alt="Mao Seavik monochrome illustration"
                        className={`block h-full w-full rounded-full object-cover select-none transition-transform duration-500 ease-out will-change-transform dark:hidden ${
                          avatarRevealed ? "scale-[1.03]" : "scale-100 group-hover/avatar:scale-[1.03]"
                        }`}
                        draggable={false}
                      />
                      <img
                        src="/images/about/profile-mono-dark.jpg"
                        alt="Mao Seavik monochrome illustration"
                        className={`hidden h-full w-full rounded-full object-cover select-none transition-transform duration-500 ease-out will-change-transform dark:block ${
                          avatarRevealed ? "scale-[1.03]" : "scale-100 group-hover/avatar:scale-[1.03]"
                        }`}
                        draggable={false}
                      />

                      {/* Hover / Tap Reveal Layer: Clear Real Full-Color Portrait */}
                      <img
                        src="/images/about/profile-light.jpg"
                        alt="Mao Seavik"
                        className={`pointer-events-none absolute inset-0 block h-full w-full rounded-full object-cover select-none transition-[opacity,transform] duration-500 ease-out will-change-transform dark:hidden ${
                          avatarRevealed
                            ? "opacity-100 scale-[1.03]"
                            : "opacity-0 scale-100 group-hover/avatar:opacity-100 group-hover/avatar:scale-[1.03] group-focus-visible/avatar:opacity-100"
                        }`}
                        draggable={false}
                      />
                      <img
                        src="/images/about/profile-dark.jpg"
                        alt="Mao Seavik"
                        className={`pointer-events-none absolute inset-0 hidden h-full w-full rounded-full object-cover select-none transition-[opacity,transform] duration-500 ease-out will-change-transform dark:block ${
                          avatarRevealed
                            ? "opacity-100 scale-[1.03]"
                            : "opacity-0 scale-100 group-hover/avatar:opacity-100 group-hover/avatar:scale-[1.03] group-focus-visible/avatar:opacity-100"
                        }`}
                        draggable={false}
                      />
                    </div>
                    <div
                      className={`pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset transition-all duration-500 ${
                        avatarRevealed
                          ? "ring-[var(--foreground)]/70 dark:ring-[var(--foreground)]/50"
                          : "ring-[var(--foreground)] group-hover/avatar:ring-[var(--foreground)]/80 dark:ring-[var(--foreground)]/20 dark:group-hover/avatar:ring-[var(--foreground)]/45"
                      }`}
                    />
                    <DiameterDimension diameter={160} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Right Cell: Display Name + Verified Badge + Rotating Tagline */}
            <div className="flex min-w-0 flex-col">
              <div className="z-10 mt-auto border-t border-[var(--line)]">
                <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 sm:gap-2 sm:px-4">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <h1 className="truncate text-lg font-medium leading-none tracking-tight min-[390px]:text-xl sm:text-2xl">
                      Mao Seavik
                    </h1>
                    <VerifiedIcon />
                    <PronounceMyName />
                  </div>

                  <button
                    type="button"
                    onClick={openResumePdf}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-zinc-50 px-2 py-0.5 font-mono text-[10px] text-[var(--foreground)] transition-all duration-150 hover:border-[var(--foreground)]/40 active:scale-95 sm:gap-1.5 sm:px-2.5 sm:text-[11px] dark:bg-zinc-900"
                  >
                    <FileText className="h-3 w-3 text-[var(--muted-foreground)]" />
                    <span>Resume.pdf</span>
                  </button>
                </div>

                <div
                  onClick={() => {
                    playTickClick();
                    setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
                  }}
                  title="Click to cycle tagline"
                  className="flex min-h-[2.75rem] cursor-pointer items-center overflow-hidden border-t border-[var(--line)] px-3 py-1.5 select-none sm:h-9 sm:min-h-0 sm:px-4 sm:py-0"
                >
                  <p
                    key={taglineIndex}
                    className="animate-text-swap line-clamp-2 font-mono text-[11px] leading-snug text-[var(--muted-foreground)] sm:truncate sm:text-sm"
                  >
                    {TAGLINES[taglineIndex]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Separator with 32px CAD height callout */}
          <Separator>
            <SeparatorHeightDimension height={32} />
          </Separator>

          {/* ================================================================
              2. OVERVIEW PANEL (2-Column Metadata Grid + Live Clock)
             ================================================================ */}
          <Panel>
            <h2 className="sr-only">Overview</h2>
            <div className="grid gap-x-4 gap-y-2.5 p-3 sm:grid-cols-2 sm:p-4">
              <div className="flex min-w-0 items-center gap-2.5 font-mono text-xs sm:gap-3.5 sm:text-sm">
                <IconTile>
                  <Cpu />
                </IconTile>
                <p className="min-w-0 truncate">
                  Machine Learning Engineer{" "}
                  <span className="text-[var(--muted-foreground)]">@</span>
                  <a
                    href="https://huggingface.co/Maoseavik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline ml-1 font-medium"
                  >
                    Hugging Face
                  </a>
                </p>
              </div>

              <div className="flex min-w-0 items-center gap-2.5 font-mono text-xs sm:gap-3.5 sm:text-sm">
                <IconTile>
                  <GraduationCap />
                </IconTile>
                <p className="min-w-0 truncate">
                  B.Sc. Computer Science{" "}
                  <span className="text-[var(--muted-foreground)]">@</span>
                  <a href="#education" className="link-underline ml-1 font-medium">
                    Norton University
                  </a>
                </p>
              </div>

              <div className="flex min-w-0 items-center gap-2.5 font-mono text-xs sm:gap-3.5 sm:text-sm">
                <IconTile>
                  <MapPin />
                </IconTile>
                <p className="min-w-0 truncate">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Phnom+Penh,+Cambodia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Phnom Penh, Cambodia
                  </a>
                </p>
              </div>

              <CurrentLocalTimeItem timeZone="Asia/Phnom_Penh" />

              <div className="flex min-w-0 items-center gap-2.5 font-mono text-xs sm:gap-3.5 sm:text-sm">
                <IconTile>
                  <Mail />
                </IconTile>
                <div className="flex min-w-0 items-center gap-1.5">
                  <a
                    href="mailto:MaoSeavik@gmail.com"
                    className="min-w-0 truncate hover:underline"
                  >
                    MaoSeavik@gmail.com
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    title="Copy email address"
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] sm:h-5 sm:w-5"
                  >
                    {copiedEmail ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-2.5 font-mono text-xs sm:gap-3.5 sm:text-sm">
                <IconTile>
                  <FileText />
                </IconTile>
                <button
                  type="button"
                  onClick={openResumePdf}
                  className="link-underline min-w-0 truncate text-left"
                >
                  Mao Seavik_Resume.pdf (Verified CV)
                </button>
              </div>
            </div>

            {/* Center vertical dashed line on sm+ */}
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 hidden w-px -translate-x-2 border-r border-dashed border-[var(--line)] sm:block"
              aria-hidden="true"
            />
          </Panel>

          {/* ================================================================
              3. SOCIAL LINKS BAR + HANDWRITTEN "follow me" MARGIN NOTE
             ================================================================ */}
          <Panel className="screen-line-top-none screen-line-bottom-none">
            <h2 className="sr-only">Social Links</h2>
            <div className="flex flex-col gap-2.5 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4">
              <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                <li>
                  <a
                    href="https://github.com/Seavik2142"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSoftClick()}
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50/70 px-3 font-mono text-xs text-[var(--foreground)] transition-all duration-150 hover:border-[var(--foreground)]/30 hover:bg-[var(--muted-bg)] active:scale-95 sm:h-8 sm:w-auto sm:justify-start dark:bg-zinc-900/70"
                  >
                    <Github className="h-3.5 w-3.5 shrink-0" />
                    <span>GitHub</span>
                    <span className="hidden text-[var(--muted-foreground)] sm:inline">@Seavik2142</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://huggingface.co/Maoseavik"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSoftClick()}
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50/70 px-3 font-mono text-xs text-[var(--foreground)] transition-all duration-150 hover:border-[var(--foreground)]/30 hover:bg-[var(--muted-bg)] active:scale-95 sm:h-8 sm:w-auto sm:justify-start dark:bg-zinc-900/70"
                  >
                    <img
                      src="/images/logos/huggingface.svg"
                      alt=""
                      className="h-3.5 w-3.5 shrink-0"
                    />
                    <span className="truncate">Hugging Face</span>
                    <span className="hidden text-[var(--muted-foreground)] sm:inline">@Maoseavik</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/mao-seavik"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playSoftClick()}
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50/70 px-3 font-mono text-xs text-[var(--foreground)] transition-all duration-150 hover:border-[var(--foreground)]/30 hover:bg-[var(--muted-bg)] active:scale-95 sm:h-8 sm:w-auto sm:justify-start dark:bg-zinc-900/70"
                  >
                    <Linkedin className="h-3.5 w-3.5 shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:MaoSeavik@gmail.com"
                    onClick={() => playSoftClick()}
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50/70 px-3 font-mono text-xs text-[var(--foreground)] transition-all duration-150 hover:border-[var(--foreground)]/30 hover:bg-[var(--muted-bg)] active:scale-95 sm:h-8 sm:w-auto sm:justify-start dark:bg-zinc-900/70"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span>Email</span>
                  </a>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => {
                  playMiniMapOpen();
                  setIsModalOpen(true);
                  setIsModalMinimized(false);
                }}
                className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--foreground)] px-3 font-mono text-xs font-medium text-[var(--background)] transition-all duration-150 hover:opacity-90 active:scale-95 sm:h-8 sm:w-auto"
              >
                <Send className="h-3 w-3" />
                <span>Send Message</span>
              </button>
            </div>

            {/* Handwritten "follow me" margin note on left gutter */}
            <div
              className="pointer-events-none absolute -top-5 right-full mr-4 hidden w-24 flex-col items-end font-handwritten text-lg leading-none text-blue-900 select-none lg:flex dark:text-[var(--muted-foreground)]"
              aria-hidden="true"
            >
              <span className="-rotate-6">follow me</span>
              <HandwrittenArrow className="h-7 w-7 translate-x-3 -scale-x-100 -rotate-6" />
            </div>
          </Panel>

          {/* ================================================================
              4. REAL GITHUB CONTRIBUTIONS GRAPH (@Seavik2142)
             ================================================================ */}
          <GitHubContributionsPanel initialData={initialContributions} />

          <Separator />

          {/* ================================================================
              5. HELLO / ABOUT PANEL (#about) + NUMBERS TELEMETRY
             ================================================================ */}
          <Panel id="about" className="screen-line-bottom-none">
            <PanelHeader>
              <PanelTitle id="about">{greeting}</PanelTitle>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                // about.md
              </span>
            </PanelHeader>

            <div className="space-y-4 p-4 text-[15px] leading-relaxed">
              <p>
                I’m a <strong className="font-medium">Machine Learning Engineer</strong> and Software Development student at{" "}
                <strong className="font-medium">Norton University</strong> (SalaIT graduate) based in Phnom Penh, Cambodia. I specialize in building ML-powered expert systems, data science pipelines, and scalable backend services. As a developer and student team leader, I work across the full machine learning and data stack—including{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">PyTorch</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">TensorFlow</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">Hugging Face</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">LangChain</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">Scikit-learn</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">NumPy</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">Pandas</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">Matplotlib</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">Jupyter</code>,{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">Streamlit</code>, and{" "}
                <code className="rounded border border-[var(--border)] bg-[var(--muted-bg)]/60 px-1.5 py-0.5 font-mono text-xs">FastAPI</code>—to design intelligent diagnostic engines, conversational LLM agents, and production web platforms.
              </p>

              {/* Currently Strip inside About */}
              <div className="grid gap-2 pt-1 sm:grid-cols-3">
                {CURRENTLY.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2.5 rounded-lg border border-[var(--line)] bg-zinc-50/50 p-2.5 dark:bg-zinc-900/40"
                    >
                      <IconTile>
                        <Icon />
                      </IconTile>
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] tracking-wider text-[var(--muted-foreground)] uppercase">
                          {item.label}
                        </div>
                        <div className="truncate font-mono text-xs font-medium">
                          {item.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-[var(--line)] pt-3 text-sm">
                <span className="text-[var(--muted-foreground)]">
                  Want to inspect my full academic &amp; engineering background?
                </span>
                <button
                  type="button"
                  onClick={openResumePdf}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[var(--foreground)] link-underline"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View my resume (PDF) →</span>
                </button>
              </div>
            </div>

            <div className="screen-line-bottom h-px" />

            {/* ==============================================================
                CHANHDAI SPONSORS / SUPPORTED BY SCROLLING MARQUEE PANEL
               ============================================================== */}
            <div className="relative">
              {/* Vertical dashed CAD grid lines behind marquee */}
              <div
                className="pointer-events-none absolute inset-0 -z-10 hidden grid-cols-4 *:border-r *:border-dashed *:border-[var(--line)] sm:grid"
                aria-hidden="true"
              >
                <div />
                <div />
                <div />
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-[var(--background)] px-3 py-3">
                  <h3 className="flex items-center gap-2 text-center font-mono text-xs font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Known &amp; Supported By</span>
                  </h3>
                </div>
              </div>

              <div className="screen-line-bottom h-px" />

              {/* Seamless Infinite Scrolling Marquee Track (Pauses on Hover) */}
              <div className="cd-partners-marquee-mask py-4">
                <div className="cd-partners-marquee-track gap-3 px-2">
                  {[...SUPPORTED_COMPANIES, ...SUPPORTED_COMPANIES].map((company, idx) => (
                    <button
                      key={`${company.id}-${idx}`}
                      type="button"
                      onClick={() => playTickClick()}
                      onMouseEnter={() => playTickClick()}
                      title={company.detail}
                      className="group/partner relative flex shrink-0 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)]/90 px-3.5 py-2.5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--foreground)]/40 hover:bg-[var(--muted-bg)]/70 active:scale-95"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border)]/80 bg-white p-1 shadow-2xs transition-transform duration-300 ease-out group-hover/partner:scale-110 dark:bg-zinc-900">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className={`h-full w-full object-contain ${company.rounded} ${
                            company.invertDark ? "dark:invert" : ""
                          }`}
                          draggable={false}
                        />
                      </div>

                      <div className="pr-1">
                        <div className="flex items-center gap-1.5 text-sm font-medium leading-tight text-[var(--foreground)]">
                          <span>{company.name}</span>
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] text-[var(--muted-foreground)]">
                          {company.role}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Handwritten "big thanks" margin note on left outer gutter (ChanhDai style) */}
              <div
                className="pointer-events-none absolute top-4 right-full mr-3 hidden w-24 flex-col items-end font-handwritten text-lg leading-none text-blue-900 select-none lg:flex dark:text-[var(--muted-foreground)]"
                aria-hidden="true"
              >
                <span className="-rotate-6">big thanks</span>
                <HandwrittenArrow className="h-7 w-7 translate-x-2 -scale-x-100 -rotate-6" />
              </div>
            </div>

            <div className="screen-line-bottom h-px" />
            <div className="stripe-divider" />
            <div className="screen-line-bottom h-px" />

            {/* Numbers / Engineering Telemetry (ChanhDai dashed leader style) */}
            <div className="flex items-center justify-center py-3">
              <h3 className="text-center font-mono text-xs font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                Engineering &amp; ML Telemetry
              </h3>
            </div>
            <div className="screen-line-bottom h-px" />
            <dl className="grid gap-3.5 p-4 font-mono text-sm">
              {[
                { label: "Production & ML systems shipped", value: "12+" },
                { label: "Published fine-tuned LLM models on Hugging Face", value: "4" },
                { label: "Hugging Face ZeroGPU cloud inference compute", value: "5.7 TFLOPS" },
                { label: "Core ML, Data Science & Backend stack tools", value: "24" },
                { label: "Verified academic & industry accreditations", value: "3 PDFs" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <dt className="flex flex-1 items-baseline gap-2 text-xs sm:text-sm after:flex-1 after:translate-y-0.5 after:border-b after:border-dashed after:border-[var(--line)]">
                    {stat.label}
                  </dt>
                  <dd className="text-xs font-semibold tabular-nums sm:text-sm">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Separator />

          {/* ================================================================
              6. STACK PANEL (#what-i-can-do — ChanhDai Numbered Category Table)
             ================================================================ */}
          <Panel id="what-i-can-do">
            <PanelHeader>
              <PanelTitle id="what-i-can-do">Stack</PanelTitle>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                ML Engineer &amp; Full Data
              </span>
            </PanelHeader>

            <div className="relative">
              {/* Vertical dashed column divider at 13rem on sm+ */}
              <div
                className="pointer-events-none absolute inset-y-0 left-52 -z-10 hidden w-px border-r border-dashed border-[var(--line)] sm:block"
                aria-hidden="true"
              />

              {STACK_CATEGORIES.map((group, idx) => (
                <div
                  key={group.category}
                  className="grid items-start gap-y-2.5 border-b border-[var(--line)] py-4 last:border-b-0 sm:grid-cols-[13rem_1fr]"
                >
                  <div className="pl-4 text-sm font-medium">
                    <span className="mr-2 font-mono text-xs text-[var(--muted-foreground)] select-none">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {group.category}
                  </div>

                  <ul className="flex flex-wrap gap-1.5 px-4">
                    {group.items.map((item) => (
                      <li key={item.title} className="flex">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playTickClick()}
                          className="inline-flex h-6 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] bg-zinc-50/80 px-2.5 font-mono text-xs text-[var(--foreground)] transition-all duration-150 hover:-translate-y-px hover:border-[var(--foreground)]/40 hover:bg-[var(--muted-bg)] active:scale-95 dark:bg-zinc-900/80"
                        >
                          <img
                            src={item.logo}
                            alt={item.title}
                            className="h-3.5 w-3.5 shrink-0 object-contain"
                            draggable={false}
                          />
                          <span>{item.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Capabilities Breakdown Sub-grid */}
            <div className="screen-line-top grid gap-px bg-[var(--line)] sm:grid-cols-3">
              {WHAT_I_CAN_DO.map((cap, idx) => (
                <div
                  key={cap.group}
                  className="flex flex-col justify-between bg-[var(--background)] p-4"
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[var(--muted-foreground)]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        Pillar
                      </span>
                    </div>
                    <h3 className="mb-1.5 text-sm font-semibold tracking-tight">
                      {cap.group}
                    </h3>
                    <p className="mb-3 text-xs leading-relaxed text-[var(--muted-foreground)]">
                      {cap.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cap.items.slice(0, 6).map((item) => (
                      <span
                        key={item}
                        className="rounded border border-[var(--line)] bg-zinc-50/60 px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted-foreground)] dark:bg-zinc-900/60"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Separator />

          {/* ================================================================
              7. EXPERIENCE PANEL (#trainings — ChanhDai Collapsible Timeline)
             ================================================================ */}
          <Panel id="trainings">
            <PanelHeader>
              <PanelTitle id="trainings" sup={EXPERIENCE.length}>
                Experience
              </PanelTitle>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                ML &amp; Software Engineering
              </span>
            </PanelHeader>

            <div className="px-4">
              {visibleExperiences.map((exp) => {
                const isOpen = !!expandedExp[exp.id];
                const isOngoing = !exp.period.end;
                return (
                  <div
                    key={exp.id}
                    className="group/exp screen-line-bottom space-y-3 py-4 last:border-b-0"
                  >
                    {/* Organization Row */}
                    <div className="flex items-start gap-3 sm:items-center">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-zinc-50 dark:bg-zinc-900">
                        {exp.logo ? (
                          <img
                            src={exp.logo}
                            alt=""
                            className="h-4 w-4 object-contain"
                          />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-x-3 gap-y-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                        <h3 className="text-base font-medium sm:text-lg">
                          {exp.companyWebsite ? (
                            <a
                              href={exp.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {exp.companyName}
                            </a>
                          ) : (
                            exp.companyName
                          )}
                        </h3>

                        <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--muted-foreground)]">
                          <span>{exp.location}</span>
                          <span>({exp.locationType})</span>
                          {exp.isCurrentEmployer && (
                            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                              <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-[var(--info)] opacity-60" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--info)]" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline Position Block */}
                    <div className="relative before:absolute before:top-0 before:left-3 before:h-full before:w-px before:bg-[var(--border)]">
                      <div className="pointer-events-none absolute bottom-0 left-3 flex h-4 w-4 bg-[var(--background)]">
                        <span className="h-full w-full -translate-y-2 border-b border-l border-[var(--border)]" />
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpItem(exp.id)}
                        className="group block w-full rounded-lg text-left transition-colors hover:bg-[var(--accent-muted)] p-1 -ml-1"
                      >
                        <div className="relative z-10 mb-1 flex items-start gap-3">
                          <IconTile>
                            <Briefcase />
                          </IconTile>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm sm:text-base">
                              {exp.title}
                            </h4>
                            {exp.subtitle && (
                              <div className="font-mono text-xs text-[var(--muted-foreground)]">
                                {exp.subtitle}
                              </div>
                            )}
                          </div>
                          <AnimatedChevronsUpDown isOpen={isOpen} />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pl-9 font-mono text-xs text-[var(--muted-foreground)]">
                          <span>{exp.employmentType}</span>
                          <span className="h-3.5 w-px bg-[var(--border)]" />
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <span>{exp.period.start}</span>
                            <span>—</span>
                            {isOngoing ? (
                              <InfinityIcon className="h-3.5 w-3.5" />
                            ) : (
                              <span>{exp.period.end}</span>
                            )}
                          </span>
                        </div>
                      </button>

                      <CollapsibleDrawer isOpen={isOpen}>
                        <div className="space-y-3 pt-3 pl-5 sm:pl-9">
                          <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
                            {exp.desc}
                          </p>

                          {exp.highlights && exp.highlights.length > 0 && (
                            <ul className="list-disc space-y-1 pl-4 text-xs sm:text-sm text-[var(--muted-foreground)]">
                              {exp.highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                          )}

                          {/* Interactive Image Thumbnails (click opens MediaModal) */}
                          {exp.images && exp.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {exp.images.map((imgSrc, imgIdx) => (
                                <button
                                  key={imgSrc}
                                  type="button"
                                  onClick={() =>
                                    openMedia({
                                      url: imgSrc,
                                      title: `${exp.title} — Photo ${imgIdx + 1}`,
                                      subtitle: exp.companyName,
                                      type: "image",
                                    })
                                  }
                                  className="group/thumb relative h-16 w-24 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--muted-bg)]"
                                >
                                  <img
                                    src={safeMediaUrl(imgSrc)}
                                    alt={`${exp.title} ${imgIdx + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                                  />
                                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/thumb:opacity-100">
                                    <Eye className="h-3.5 w-3.5 text-white" />
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Attached Certificates / Links */}
                          {exp.certificates && exp.certificates.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {exp.certificates.map((cert, cIdx) =>
                                cert.link.startsWith("http") ? (
                                  <a
                                    key={cIdx}
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => playSoftClick()}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-zinc-50 px-2.5 py-1 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)] dark:bg-zinc-900"
                                  >
                                    <ExternalLink className="h-3 w-3 text-[var(--muted-foreground)]" />
                                    <span>{cert.name}</span>
                                  </a>
                                ) : (
                                  <button
                                    key={cIdx}
                                    type="button"
                                    onClick={() =>
                                      openMedia({
                                        url: cert.link,
                                        title: cert.name,
                                        subtitle: `${exp.companyName} • ${exp.period.start}`,
                                        type: isPdf(cert.link) ? "pdf" : "image",
                                      })
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-zinc-50 px-2.5 py-1 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)] dark:bg-zinc-900"
                                  >
                                    <Paperclip className="h-3 w-3 text-[var(--muted-foreground)]" />
                                    <span>{cert.name}</span>
                                  </button>
                                )
                              )}
                            </div>
                          )}

                          {exp.tags && (
                            <ul className="flex flex-wrap gap-1.5 pt-1">
                              {exp.tags.map((t) => (
                                <li key={t}>
                                  <Tag logo={TECH_LOGO_MAP[t]}>{t}</Tag>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </CollapsibleDrawer>
                    </div>
                  </div>
                );
              })}
            </div>

            {EXPERIENCE.length > 3 && (
              <div className="screen-line-top flex items-center justify-center py-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllExp((v) => {
                      const next = !v;
                      if (next) playExpandSound();
                      else playCollapseSound();
                      return next;
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-zinc-50 px-3 py-1.5 font-mono text-xs font-medium text-[var(--foreground)] transition-all duration-150 hover:bg-[var(--muted-bg)] active:scale-95 dark:bg-zinc-900"
                >
                  <span>{showAllExp ? "Show less" : `Show more (${EXPERIENCE.length - 3})`}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${showAllExp ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}
          </Panel>

          <Separator />

          {/* ================================================================
              8. EDUCATION PANEL (#education — ChanhDai Timeline)
             ================================================================ */}
          <Panel id="education">
            <PanelHeader>
              <PanelTitle id="education">Education</PanelTitle>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                Academic Background
              </span>
            </PanelHeader>

            {EDUCATION.map((edu) => {
              const isOpen = !!expandedEdu[edu.id];
              return (
                <div
                  key={edu.id}
                  className="screen-line-bottom p-4 last:border-b-0"
                >
                  <div className="relative before:absolute before:top-0 before:left-3 before:h-full before:w-px before:bg-[var(--border)]">
                    <div className="pointer-events-none absolute bottom-0 left-3 flex h-4 w-4 bg-[var(--background)]">
                      <span className="h-full w-full -translate-y-2 border-b border-l border-[var(--border)]" />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleEduItem(edu.id)}
                      className="block w-full rounded-lg p-1 -ml-1 text-left transition-colors hover:bg-[var(--accent-muted)]"
                    >
                      <div className="relative z-10 mb-1 flex items-start gap-3">
                        <IconTile>
                          <GraduationCap />
                        </IconTile>
                        <h3 className="flex-1 text-base font-medium">
                          {edu.school}
                        </h3>
                        <AnimatedChevronsUpDown isOpen={isOpen} />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-9 font-mono text-xs text-[var(--muted-foreground)]">
                        <span className="tabular-nums">
                          {edu.period.start} — {edu.period.end}
                        </span>
                        <span className="h-3.5 w-px bg-[var(--border)]" />
                        <span>{edu.degree}</span>
                        <span className="h-3.5 w-px bg-[var(--border)]" />
                        <span>{edu.fieldOfStudy}</span>
                      </div>
                    </button>

                    <CollapsibleDrawer isOpen={isOpen}>
                      <div className="space-y-3 pt-3 pl-9">
                        <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
                          {edu.description}
                        </p>

                        {edu.images && edu.images.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {edu.images.map((imgSrc, idx) => (
                              <button
                                key={imgSrc}
                                type="button"
                                onClick={() =>
                                  openMedia({
                                    url: imgSrc,
                                    title: `${edu.school} — Photo ${idx + 1}`,
                                    subtitle: edu.degree,
                                    type: "image",
                                  })
                                }
                                className="group/thumb relative h-14 w-20 overflow-hidden rounded-md border border-[var(--border)]"
                              >
                                <img
                                  src={safeMediaUrl(imgSrc)}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                                />
                              </button>
                            ))}
                          </div>
                        )}

                        {edu.certificate && (
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                openMedia({
                                  url: edu.certificate.link,
                                  title: edu.certificate.name,
                                  subtitle: edu.school,
                                  type: "pdf",
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-zinc-50 px-2.5 py-1 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)] dark:bg-zinc-900"
                            >
                              <Paperclip className="h-3 w-3 text-[var(--muted-foreground)]" />
                              <span>{edu.certificate.name}</span>
                            </button>
                          </div>
                        )}

                        <ul className="flex flex-wrap gap-1.5 pt-1">
                          {edu.skills.map((skill) => (
                            <li key={skill}>
                              <Tag logo={TECH_LOGO_MAP[skill]}>{skill}</Tag>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CollapsibleDrawer>
                  </div>
                </div>
              );
            })}
          </Panel>

          <Separator />

          {/* ================================================================
              9. PROJECTS PANEL (#work — ChanhDai Accordion List + Filter Tabs)
             ================================================================ */}
          <Panel id="work">
            <PanelHeader className="flex-wrap gap-2">
              <PanelTitle id="work" sup={ALL_PROJECTS.length}>
                Projects
              </PanelTitle>

              <div className="flex flex-wrap items-center gap-1.5">
                {["ALL", "ML & AI", "WEB & BACKEND", "DIGITAL"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      playTickClick();
                      setProjectFilter(tab);
                    }}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-all duration-150 active:scale-95 ${
                      projectFilter === tab
                        ? "bg-[var(--foreground)] font-medium text-[var(--background)]"
                        : "border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <Link
                  href="/work"
                  onClick={() => playSoftClick()}
                  className="ml-1 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-zinc-50 px-2.5 py-0.5 font-mono text-[11px] text-[var(--foreground)] transition-all duration-150 hover:bg-[var(--muted-bg)] active:scale-95 dark:bg-zinc-900"
                >
                  <span>Archive</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </PanelHeader>

            <ul>
              {visibleProjects.map((project) => {
                const isOpen = !!expandedProjects[project.num];
                const mediaUrl = project.image || project.file || "";
                const formatLabel = getFormatLabel(mediaUrl);

                return (
                  <li
                    key={project.num}
                    className="border-b border-[var(--line)] last:border-b-0"
                  >
                    <div className="relative flex items-center transition-colors hover:bg-[var(--accent-muted)]">
                      <IconTile className="mx-2.5 sm:mx-4">
                        <span className="font-mono text-[10px] font-semibold">
                          {project.num}
                        </span>
                      </IconTile>

                      <div className="flex min-w-0 flex-1 items-center gap-1.5 border-l border-dashed border-[var(--line)] p-3 sm:gap-2 sm:p-4">
                        <button
                          type="button"
                          onClick={() => toggleProjectItem(project.num)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="mb-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <h3 className="text-sm font-medium leading-snug sm:text-base">
                              {project.title}
                            </h3>
                            {project.awards && project.awards.length > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                <Trophy className="h-2.5 w-2.5" />
                                {project.awards[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-[11px] text-[var(--muted-foreground)] sm:gap-2 sm:text-xs">
                            <span>{project.category}</span>
                            <span className="hidden sm:inline">·</span>
                            <span className="truncate">{project.tech.slice(0, 3).join(", ")}</span>
                          </div>
                        </button>

                        {/* Quick Media Preview Button */}
                        <button
                          type="button"
                          onClick={() =>
                            openMedia({
                              url: mediaUrl,
                              title: project.title,
                              subtitle: project.category,
                            })
                          }
                          title={`Preview ${formatLabel}`}
                          className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] sm:flex"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Direct External Repository Link */}
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSoftClick()}
                          title="Open project repository"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => toggleProjectItem(project.num)}
                          aria-label="Toggle project details"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)]"
                        >
                          <AnimatedChevronsUpDown isOpen={isOpen} />
                        </button>
                      </div>
                    </div>

                    <CollapsibleDrawer isOpen={isOpen}>
                      <div className="space-y-4 border-t border-[var(--line)] bg-zinc-50/30 p-4 dark:bg-zinc-900/20">
                        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
                          {/* Thumbnail Preview Card */}
                          <button
                            type="button"
                            onClick={() =>
                              openMedia({
                                url: mediaUrl,
                                title: project.title,
                                subtitle: project.category,
                              })
                            }
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
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/pimg:opacity-100">
                              <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 font-mono text-[10px] text-white">
                                <Eye className="h-3 w-3" /> Expand {formatLabel}
                              </span>
                            </div>
                          </button>

                          <div className="flex flex-col justify-between space-y-3">
                            <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
                              {project.desc}
                            </p>

                            <ul className="flex flex-wrap gap-1.5">
                              {project.tech.map((t) => (
                                <li key={t}>
                                  <Tag logo={TECH_LOGO_MAP[t]}>{t}</Tag>
                                </li>
                              ))}
                            </ul>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() =>
                                  openMedia({
                                    url: mediaUrl,
                                    title: project.title,
                                    subtitle: project.category,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
                              >
                                <Eye className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                                <span>Preview Media</span>
                              </button>

                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => playSoftClick()}
                                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--foreground)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--background)] hover:opacity-90"
                              >
                                <span>{project.linkText || "View Project →"}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleDrawer>
                  </li>
                );
              })}
            </ul>

            {filteredProjects.length > 5 && (
              <div className="screen-line-top flex items-center justify-center py-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllProjects((v) => {
                      const next = !v;
                      if (next) playExpandSound();
                      else playCollapseSound();
                      return next;
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-zinc-50 px-3 py-1.5 font-mono text-xs font-medium text-[var(--foreground)] transition-all duration-150 hover:bg-[var(--muted-bg)] active:scale-95 dark:bg-zinc-900"
                >
                  <span>
                    {showAllProjects
                      ? "Show less"
                      : `Show all ${filteredProjects.length} projects`}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      showAllProjects ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}
          </Panel>

          <Separator />

          {/* ================================================================
              10. RECOGNITION & CERTIFICATES PANEL (#awards — ChanhDai Rows)
             ================================================================ */}
          <Panel id="awards">
            <PanelHeader>
              <PanelTitle id="awards" sup={CERTIFICATES.length}>
                Recognition
              </PanelTitle>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                Verified PDFs &amp; Awards
              </span>
            </PanelHeader>

            <ul>
              {CERTIFICATES.map((cert) => {
                const isOpen = !!expandedCerts[cert.id];
                return (
                  <li
                    key={cert.id}
                    className="border-b border-[var(--line)] last:border-b-0"
                  >
                    <div className="relative flex items-center transition-colors hover:bg-[var(--accent-muted)]">
                      <IconTile className="mx-2.5 sm:mx-4">
                        <CircleCheckBig />
                      </IconTile>

                      <div className="flex min-w-0 flex-1 items-center gap-1.5 border-l border-dashed border-[var(--line)] p-3 sm:gap-2 sm:p-4">
                        <button
                          type="button"
                          onClick={() => toggleCertItem(cert.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <h3 className="mb-0.5 text-sm font-medium leading-snug sm:text-base">
                            {cert.title} — {cert.subtitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[11px] text-[var(--muted-foreground)] sm:text-xs">
                            <span>Certificate</span>
                            <span className="h-3 w-px bg-[var(--border)]" />
                            <span>@{cert.org}</span>
                            <span className="h-3 w-px bg-[var(--border)]" />
                            <span>{cert.date}</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openMedia({
                              url: cert.pdf,
                              title: cert.title,
                              subtitle: `${cert.org} • ${cert.date}`,
                              type: "pdf",
                            })
                          }
                          title="Preview Verified PDF"
                          className="hidden h-7 items-center gap-1 rounded-md border border-[var(--border)] bg-zinc-50 px-2 font-mono text-[11px] text-[var(--foreground)] hover:bg-[var(--muted-bg)] sm:inline-flex dark:bg-zinc-900"
                        >
                          <FileText className="h-3 w-3 text-[var(--muted-foreground)]" />
                          <span>View PDF</span>
                        </button>

                        <a
                          href={cert.pdf}
                          download
                          onClick={() => playSoftClick()}
                          title="Download PDF"
                          className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)] sm:flex"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => toggleCertItem(cert.id)}
                          aria-label="Toggle certificate preview"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)]"
                        >
                          <AnimatedChevronsUpDown isOpen={isOpen} />
                        </button>
                      </div>
                    </div>

                    <CollapsibleDrawer isOpen={isOpen}>
                      <div className="grid gap-4 border-t border-[var(--line)] bg-zinc-50/30 p-4 sm:grid-cols-[180px_1fr] dark:bg-zinc-900/20">
                        <button
                          type="button"
                          onClick={() =>
                            openMedia({
                              url: cert.pdf,
                              title: cert.title,
                              subtitle: `${cert.org} • ${cert.date}`,
                              type: "pdf",
                            })
                          }
                          className="group/cthumb relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted-bg)]"
                        >
                          <img
                            src={cert.image}
                            alt={cert.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/cthumb:scale-105"
                          />
                          <span className="absolute top-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white">
                            PDF
                          </span>
                        </button>

                        <div className="flex flex-col justify-between space-y-3">
                          <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
                            {cert.desc}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openMedia({
                                  url: cert.pdf,
                                  title: cert.title,
                                  subtitle: `${cert.org} • ${cert.date}`,
                                  type: "pdf",
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--foreground)] px-3 py-1.5 font-mono text-xs font-medium text-[var(--background)] hover:opacity-90"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Open Interactive PDF</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openMedia({
                                  url: cert.image,
                                  title: cert.title,
                                  subtitle: `${cert.org} • High-Res Scan`,
                                  type: "image",
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                              <span>View Image</span>
                            </button>

                            <a
                              href={cert.pdf}
                              download
                              onClick={() => playSoftClick()}
                              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
                            >
                              <Download className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </CollapsibleDrawer>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Separator />

          {/* ================================================================
              11. CONTACT PANEL (#contact)
             ================================================================ */}
          <Panel id="contact">
            <PanelHeader>
              <PanelTitle id="contact">Contact</PanelTitle>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                Open to ML &amp; Backend Opportunities
              </span>
            </PanelHeader>

            <div className="space-y-4 p-4">
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                I&apos;m open to opportunities where I can contribute to{" "}
                <strong className="font-medium text-[var(--foreground)]">
                  Machine Learning engineering
                </strong>
                ,{" "}
                <strong className="font-medium text-[var(--foreground)]">
                  data science &amp; analytics
                </strong>
                ,{" "}
                <strong className="font-medium text-[var(--foreground)]">
                  LLM fine-tuning
                </strong>
                , and{" "}
                <strong className="font-medium text-[var(--foreground)]">
                  production backend systems
                </strong>
                .
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                <a
                  href="mailto:MaoSeavik@gmail.com"
                  onClick={() => playSoftClick()}
                  className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-zinc-50/50 p-3 transition-colors hover:border-[var(--foreground)]/30 dark:bg-zinc-900/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <IconTile>
                      <Mail />
                    </IconTile>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        01 · EMAIL
                      </div>
                      <div className="truncate font-mono text-xs font-medium">
                        MaoSeavik@gmail.com
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                </a>

                <a
                  href="https://huggingface.co/Maoseavik"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSoftClick()}
                  className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-zinc-50/50 p-3 transition-colors hover:border-[var(--foreground)]/30 dark:bg-zinc-900/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <IconTile>
                      <Sparkles />
                    </IconTile>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        02 · HUGGING FACE
                      </div>
                      <div className="truncate font-mono text-xs font-medium">
                        huggingface.co/Maoseavik
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                </a>

                <a
                  href="https://github.com/Seavik2142"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSoftClick()}
                  className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-zinc-50/50 p-3 transition-colors hover:border-[var(--foreground)]/30 dark:bg-zinc-900/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <IconTile>
                      <Github />
                    </IconTile>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        03 · GITHUB
                      </div>
                      <div className="truncate font-mono text-xs font-medium">
                        github.com/Seavik2142
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                </a>

                <a
                  href="https://www.linkedin.com/in/mao-seavik"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSoftClick()}
                  className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-[var(--line)] bg-zinc-50/50 p-3 transition-colors hover:border-[var(--foreground)]/30 dark:bg-zinc-900/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <IconTile>
                      <Linkedin />
                    </IconTile>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        04 · LINKEDIN
                      </div>
                      <div className="truncate font-mono text-xs font-medium">
                        linkedin.com/in/mao-seavik
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                </a>
              </div>

              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    playMiniMapOpen();
                    setIsModalOpen(true);
                    setIsModalMinimized(false);
                  }}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-4 font-mono text-xs font-medium text-[var(--background)] transition-all hover:opacity-90 active:scale-95 sm:h-9 sm:w-auto"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>SEND ME A MESSAGE →</span>
                </button>

                <button
                  type="button"
                  onClick={openResumePdf}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50 px-4 font-mono text-xs font-medium text-[var(--foreground)] transition-all hover:bg-[var(--muted-bg)] active:scale-95 sm:h-9 sm:w-auto dark:bg-zinc-900"
                >
                  <FileText className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                  <span>VIEW RESUME (PDF) →</span>
                </button>
              </div>
            </div>
          </Panel>
        </div>
      </main>

      {/* ====================================================================
          12. CHANHDAI CAD TECHNICAL SPECIFICATION TITLE-BLOCK FOOTER
         ==================================================================== */}
      <footer className="max-w-[100vw] overflow-x-clip px-2">
        <div className="mx-auto border-x border-[var(--line)] md:max-w-3xl">
          <div className="screen-line-top screen-line-bottom">
            <div className="stripe-divider h-12" />
          </div>

          <div className="relative">
            <div className="screen-line-bottom flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-4 py-3">
              <span
                className="text-2xl font-medium leading-none text-[var(--background)] sm:text-3xl"
                style={{
                  WebkitTextStroke: "1px var(--foreground)",
                  paintOrder: "stroke fill",
                }}
              >
                maoseavik
              </span>
              <span className="font-mono text-xs text-[var(--muted-foreground)]">
                Machine Learning Engineer &amp; Full-Stack Developer
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-px bg-[var(--line)] font-mono md:grid-cols-4">
              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Crafted by
                </dt>
                <dd className="text-xs sm:text-sm">
                  <a
                    href="https://github.com/Seavik2142"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    @Seavik2142
                  </a>
                </dd>
              </div>

              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Primary Role
                </dt>
                <dd className="text-xs sm:text-sm">ML Engineer</dd>
              </div>

              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Location
                </dt>
                <dd className="text-xs sm:text-sm">Phnom Penh, KH</dd>
              </div>

              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Model Hub
                </dt>
                <dd className="text-xs sm:text-sm">
                  <a
                    href="https://huggingface.co/Maoseavik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    hf.co/Maoseavik
                  </a>
                </dd>
              </div>

              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Deployed on
                </dt>
                <dd className="text-xs sm:text-sm">▲ Vercel</dd>
              </div>

              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Source code
                </dt>
                <dd className="text-xs sm:text-sm">
                  <a
                    href="https://github.com/Seavik2142/Seavik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline"
                  >
                    GitHub
                  </a>
                </dd>
              </div>

              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  University
                </dt>
                <dd className="text-xs sm:text-sm">Norton Univ.</dd>
              </div>

              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Typeface
                </dt>
                <dd className="text-xs sm:text-sm">Inter &amp; JetBrains Mono</dd>
              </div>

              <div className="col-span-2 flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  ML &amp; Data Science Stack
                </dt>
                <dd className="text-xs leading-relaxed text-[var(--foreground)]/90">
                  PyTorch · TensorFlow · Hugging Face · LangChain · Scikit-learn · NumPy · Pandas · Matplotlib · Jupyter · Streamlit · FastAPI
                </dd>
              </div>

              <div className="flex flex-col gap-1 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Links
                </dt>
                <dd className="text-xs">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="https://github.com/Seavik2142"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline"
                      >
                        GitHub
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://huggingface.co/Maoseavik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline"
                      >
                        Hugging Face
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.linkedin.com/in/mao-seavik"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline"
                      >
                        LinkedIn
                      </a>
                    </li>
                  </ul>
                </dd>
              </div>

              <div className="flex min-w-0 flex-col justify-between gap-2 bg-[var(--background)] px-3 py-3 sm:px-4">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Approved by
                </dt>
                <dd className="flex h-full min-w-0 flex-col justify-end gap-2">
                  <SeavikSignature className="max-w-full self-start" />
                  <span className="border-t border-[var(--line)] pt-2 font-sans text-xs leading-none font-medium tracking-wide uppercase sm:text-sm">
                    MAO SEAVIK
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SiteFooterInteractiveLogotype />
        <div className="h-24 sm:h-14" />
      </footer>

      {/* ====================================================================
          CONTACT MESSAGE MODAL (Preserved Google Apps Script Integration)
         ==================================================================== */}
      {isModalOpen && (
        <div className={`contact-modal${isModalMinimized ? " contact-modal--minimized" : ""}`}>
          <div
            className="contact-modal-header"
            onClick={() => isModalMinimized && setIsModalMinimized(false)}
          >
            <h3 className="contact-modal-title">Send Me a Message</h3>
            <div className="contact-modal-controls">
              <button
                type="button"
                className="contact-modal-icon-btn contact-modal-minimize-btn"
                aria-label={isModalMinimized ? "Expand" : "Minimize"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalMinimized((v) => !v);
                }}
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                className="contact-modal-icon-btn"
                aria-label="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(false);
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isModalMinimized && (
            <div className="contact-modal-inner">
              <form
                className="contact-modal-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const data = {
                    name: form.name.value.trim(),
                    email: form.email.value.trim(),
                    message: form.message.value.trim(),
                  };

                  setFormStatus("submitting");

                  try {
                    await fetch(
                      "https://script.google.com/macros/s/AKfycbz68sln0VIOOVOegEYiQLJwTdLonmPHMzq8jqzWCaqdgUAG2-LWxJVuRaEM5HQl6ABH/exec",
                      {
                        method: "POST",
                        mode: "no-cors",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                      }
                    );
                    setFormStatus("success");
                    form.reset();
                    setIsModalOpen(false);
                    setShowSuccessModal(true);
                  } catch {
                    setFormStatus("error");
                  }
                }}
              >
                <div className="contact-modal-field">
                  <label className="contact-modal-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="contact-modal-input"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="contact-modal-field">
                  <label className="contact-modal-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="contact-modal-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="contact-modal-field contact-modal-field--grow">
                  <label className="contact-modal-label">Message</label>
                  <textarea
                    rows="5"
                    name="message"
                    className="contact-modal-input"
                    placeholder="Tell me about your ML or software project..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="contact-modal-submit"
                  disabled={formStatus === "submitting"}
                >
                  {formStatus === "submitting"
                    ? "SENDING..."
                    : formStatus === "success"
                    ? "MESSAGE SENT"
                    : "SEND MESSAGE →"}
                </button>

                {formStatus === "error" && (
                  <div className="contact-modal-error">
                    Failed to send message. Please try again or email me directly.
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      )}

      {showSuccessModal && (
        <div
          className="success-modal-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="success-modal-close"
              onClick={() => setShowSuccessModal(false)}
            >
              <X size={20} />
            </button>
            <div className="success-modal-icon">✓</div>
            <h3 className="success-modal-title">Message Sent!</h3>
            <p className="success-modal-text">
              Thanks for reaching out. I&apos;ll get back to you as soon as possible.
            </p>
            <button
              className="success-modal-btn"
              onClick={() => setShowSuccessModal(false)}
            >
              CONTINUE BROWSING
            </button>
          </div>
        </div>
      )}

      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        media={selectedMedia}
      />
    </div>
  );
}
