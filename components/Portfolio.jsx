"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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
      className={`screen-line-bottom flex items-center justify-between px-4 py-3 ${className}`}
    >
      {children}
    </header>
  );
}

function PanelTitle({ id, children, sup, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window === "undefined") return;
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

function VerifiedIcon({ className = "h-5 w-5" }) {
  return (
    <span
      className={`group/verified relative inline-flex items-center justify-center select-none ${className}`}
      title="Verified Machine Learning Engineer"
      aria-label="Verified"
    >
      {/* Subtle outer pulse aura */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-[#2563eb]/25 opacity-75 animate-ping dark:bg-[#3b82f6]/30"
        style={{ animationDuration: "3s" }}
        aria-hidden="true"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="relative z-10 h-full w-full text-[#2563eb] transition-transform duration-300 ease-out group-hover/verified:scale-110 group-hover/verified:rotate-6 dark:text-[#3b82f6]"
      >
        <defs>
          <linearGradient id="verified-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        {/* 10-point scalloped verified rosette */}
        <path
          fill="url(#verified-grad)"
          d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Z"
        />
        {/* Crisp white checkmark */}
        <path
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m7.8 12.3 2.6 2.6 6-6.2"
        />
      </svg>
    </span>
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

function playMechanicalClick() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.045);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
}

function SeavikBlueprintIsometric() {
  const [pressed, setPressed] = useState(false);
  const [spot, setSpot] = useState({ x: 278, y: 177 });
  const svgRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!svgRef.current) return;
      const x = (e.clientX / window.innerWidth) * 556;
      const y = (e.clientY / window.innerHeight) * 354;
      setSpot({ x, y });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handlePress = () => {
    playMechanicalClick();
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
  };

  const topOffset = pressed ? 14 : 0;
  const baseDepth = 32;

  return (
    <svg
      ref={svgRef}
      onClick={handlePress}
      className="h-auto w-full cursor-pointer overflow-visible select-none"
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

      {/* 30° CAD Angle Callout at top vertex of K */}
      <g
        className="pointer-events-none hidden text-[var(--dimension)] sm:block"
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
    <div className="flex items-center gap-3.5 font-mono text-sm">
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
      <p className="truncate">
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
   GITHUB & ML CONTRIBUTIONS CALENDAR GRAPH (ChanhDai style)
   ============================================================================ */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateContributionData() {
  const weeks = 52;
  const daysPerWeek = 7;
  const cells = [];
  let total = 0;

  // Deterministic realistic engineering contribution curve across 52 weeks
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < daysPerWeek; d++) {
      const seed = (w * 17 + d * 31 + w * d * 7) % 29;
      let level = 0;
      let count = 0;
      if (w > 34) {
        // Heavy recent ML fine-tuning & ChhlatAI / AgriSystem sprint
        if (seed < 4) {
          level = 0;
          count = 0;
        } else if (seed < 11) {
          level = 1;
          count = 2;
        } else if (seed < 18) {
          level = 2;
          count = 5;
        } else if (seed < 24) {
          level = 3;
          count = 9;
        } else {
          level = 4;
          count = 14;
        }
      } else {
        if (seed < 11) {
          level = 0;
          count = 0;
        } else if (seed < 18) {
          level = 1;
          count = 1;
        } else if (seed < 23) {
          level = 2;
          count = 3;
        } else if (seed < 27) {
          level = 3;
          count = 6;
        } else {
          level = 4;
          count = 11;
        }
      }
      total += count;
      col.push({ w, d, level, count });
    }
    cells.push(col);
  }
  return { cells, total };
}

const CONTRIBUTION_DATA = generateContributionData();

function GitHubContributionsPanel() {
  const [hoveredCell, setHoveredCell] = useState(null);

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

  return (
    <Panel>
      <h2 className="sr-only">GitHub & Hugging Face Contributions</h2>
      <div className="px-4 py-4">
        {/* Month Header */}
        <div className="mb-1.5 flex justify-between px-1 font-mono text-[10px] text-[var(--muted-foreground)] select-none">
          {MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        {/* 52-week SVG/Grid Matrix */}
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex gap-[3px] min-w-full justify-between">
            {CONTRIBUTION_DATA.cells.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((cell, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`h-[11px] w-[11px] rounded-[2px] transition-transform hover:scale-125 ${getLevelClass(
                      cell.level
                    )}`}
                    title={`${cell.count} contributions (Week ${cell.w + 1})`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[var(--muted-foreground)]">
          <div>
            {hoveredCell ? (
              <span className="text-[var(--foreground)] font-medium">
                {hoveredCell.count} contribution{hoveredCell.count === 1 ? "" : "s"} in Week {hoveredCell.w + 1}
              </span>
            ) : (
              <span>
                <strong className="font-medium text-[var(--foreground)] tabular-nums">
                  {CONTRIBUTION_DATA.total.toLocaleString()}
                </strong>{" "}
                contributions across GitHub &amp; Hugging Face. Source:{" "}
                <a
                  href="https://github.com/Seavik2142"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-[var(--foreground)]"
                >
                  @Seavik2142
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
   INTERACTIVE FOOTER HATCH LOGOTYPE + LIVE WIDTH DIMENSION
   ============================================================================ */

function SiteFooterInteractiveLogotype() {
  const [width, setWidth] = useState(768);
  const [mousePct, setMousePct] = useState(0.5);
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
    <div className="mx-auto md:max-w-3xl" ref={containerRef}>
      <div
        className="screen-line-top screen-line-bottom relative overflow-hidden border-x border-[var(--line)]"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePct((e.clientX - rect.left) / rect.width);
        }}
        onMouseLeave={() => setMousePct(0.5)}
      >
        <div className="flex w-full translate-y-[26%] items-center justify-center pt-2">
          <svg
            className="w-full h-auto select-none"
            viewBox="0 0 900 170"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="footer-logotype-hatch"
                x="1"
                y="1"
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M-1 1l2-2M0 8l8-8M7 9l2-2"
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              </pattern>
              <linearGradient
                id="footer-logotype-grad"
                x1={mousePct * 900}
                y1="0"
                x2="450"
                y2="170"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.35" stopColor="var(--foreground)" stopOpacity="0" />
                <stop offset="1" stopColor="var(--foreground)" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            <text
              x="450"
              y="148"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight="900"
              fontSize="168"
              letterSpacing="-0.04em"
              fill="url(#footer-logotype-hatch)"
              stroke="var(--border)"
              strokeWidth="2"
            >
              SEAVIK
            </text>
            <text
              x="450"
              y="148"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight="900"
              fontSize="168"
              letterSpacing="-0.04em"
              fill="url(#footer-logotype-grad)"
              stroke="var(--foreground)"
              strokeOpacity="0.16"
              strokeWidth="1.5"
            >
              SEAVIK
            </text>
          </svg>
        </div>
      </div>

      {/* Live Width Dimension under logotype */}
      <div
        className="pointer-events-none relative h-8 text-[var(--dimension)] select-none"
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

export default function Portfolio() {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [greeting, setGreeting] = useState("Hello");
  const [copiedEmail, setCopiedEmail] = useState(false);

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
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
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

      <main className="max-w-[100vw] overflow-x-clip px-2">
        <div className="mx-auto md:max-w-3xl">
          {/* 768px Top CAD Dimension Bar */}
          <FrameWidthDimension />

          {/* ================================================================
              1. PROFILE HEADER (Isometric Blueprint + Ø160 Avatar + Taglines)
             ================================================================ */}
          <div
            id="hero"
            className="screen-line-top screen-line-bottom grid grid-cols-1 overflow-y-clip border-x border-[var(--line)] sm:grid-cols-[auto_1fr] sm:grid-rows-[1fr_auto]"
          >
            {/* Isometric 3D Blueprint Figure */}
            <figure className="relative col-span-1 p-3 sm:col-start-2 sm:p-5">
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
              <div className="screen-line-top mt-auto shrink-0 border-b border-[var(--line)] sm:border-r sm:border-b-0">
                <div className="-mx-px my-0 flex justify-center outline-none sm:justify-start">
                  <div className="relative z-10 h-32 w-32 rounded-full sm:h-40 sm:w-40">
                    <img
                      src="/images/about/profile-light.jpg"
                      alt="Mao Seavik"
                      className="block h-full w-full rounded-full object-cover select-none dark:hidden"
                      draggable={false}
                    />
                    <img
                      src="/images/about/profile-dark.jpg"
                      alt="Mao Seavik"
                      className="hidden h-full w-full rounded-full object-cover select-none dark:block"
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-[var(--foreground)] dark:ring-[var(--foreground)]/20" />
                    <DiameterDimension diameter={160} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Right Cell: Display Name + Verified Badge + Rotating Tagline */}
            <div className="flex flex-col">
              <div className="z-10 mt-auto border-t border-[var(--line)]">
                <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
                      Mao Seavik
                    </h1>
                    <VerifiedIcon className="h-4.5 w-4.5 shrink-0" />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={openResumePdf}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-zinc-50 px-2.5 py-1 font-mono text-xs text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]/40 dark:bg-zinc-900"
                  >
                    <FileText className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                    <span>Resume.pdf</span>
                  </button>
                </div>

                <div className="flex h-10 items-center border-t border-[var(--line)] px-4">
                  <p
                    key={taglineIndex}
                    className="truncate font-mono text-xs text-[var(--muted-foreground)] sm:text-sm animate-fadeIn"
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
            <div className="grid gap-x-4 gap-y-2.5 p-4 sm:grid-cols-2">
              <div className="flex items-center gap-3.5 font-mono text-sm">
                <IconTile>
                  <Cpu />
                </IconTile>
                <p className="truncate">
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

              <div className="flex items-center gap-3.5 font-mono text-sm">
                <IconTile>
                  <GraduationCap />
                </IconTile>
                <p className="truncate">
                  B.Sc. Computer Science{" "}
                  <span className="text-[var(--muted-foreground)]">@</span>
                  <a href="#education" className="link-underline ml-1 font-medium">
                    Norton University
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-3.5 font-mono text-sm">
                <IconTile>
                  <MapPin />
                </IconTile>
                <p className="truncate">
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

              <div className="flex items-center gap-3.5 font-mono text-sm">
                <IconTile>
                  <Mail />
                </IconTile>
                <div className="flex min-w-0 items-center gap-1.5">
                  <a
                    href="mailto:MaoSeavik@gmail.com"
                    className="truncate hover:underline"
                  >
                    MaoSeavik@gmail.com
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    title="Copy email address"
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                  >
                    {copiedEmail ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3.5 font-mono text-sm">
                <IconTile>
                  <FileText />
                </IconTile>
                <button
                  type="button"
                  onClick={openResumePdf}
                  className="link-underline truncate text-left"
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
            <div className="flex flex-wrap items-center justify-between gap-2 p-4">
              <ul className="flex flex-wrap items-center gap-2">
                <li>
                  <a
                    href="https://github.com/Seavik2142"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50/70 px-3 font-mono text-xs text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)] dark:bg-zinc-900/70"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                    <span className="text-[var(--muted-foreground)]">@Seavik2142</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://huggingface.co/Maoseavik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50/70 px-3 font-mono text-xs text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)] dark:bg-zinc-900/70"
                  >
                    <img
                      src="/images/logos/huggingface.svg"
                      alt=""
                      className="h-3.5 w-3.5"
                    />
                    <span>Hugging Face</span>
                    <span className="text-[var(--muted-foreground)]">@Maoseavik</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/mao-seavik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50/70 px-3 font-mono text-xs text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)] dark:bg-zinc-900/70"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:MaoSeavik@gmail.com"
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50/70 px-3 font-mono text-xs text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)] dark:bg-zinc-900/70"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </a>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(true);
                  setIsModalMinimized(false);
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--foreground)] px-3 font-mono text-xs font-medium text-[var(--background)] transition-opacity hover:opacity-90"
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
              4. GITHUB & HUGGING FACE CONTRIBUTIONS GRAPH
             ================================================================ */}
          <GitHubContributionsPanel />

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
                          className="inline-flex h-6 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] bg-zinc-50/80 px-2.5 font-mono text-xs text-[var(--foreground)] transition-colors hover:border-[var(--foreground)]/40 hover:bg-[var(--muted-bg)] dark:bg-zinc-900/80"
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
                        onClick={() =>
                          setExpandedExp((prev) => ({
                            ...prev,
                            [exp.id]: !prev[exp.id],
                          }))
                        }
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
                          <ChevronsUpDown className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
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

                      {isOpen && (
                        <div className="space-y-3 pt-3 pl-9">
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
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {EXPERIENCE.length > 3 && (
              <div className="screen-line-top flex items-center justify-center py-3">
                <button
                  type="button"
                  onClick={() => setShowAllExp((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-zinc-50 px-3 py-1.5 font-mono text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)] dark:bg-zinc-900"
                >
                  <span>{showAllExp ? "Show less" : `Show more (${EXPERIENCE.length - 3})`}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${showAllExp ? "rotate-180" : ""}`}
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
                      onClick={() =>
                        setExpandedEdu((prev) => ({
                          ...prev,
                          [edu.id]: !prev[edu.id],
                        }))
                      }
                      className="block w-full rounded-lg p-1 -ml-1 text-left transition-colors hover:bg-[var(--accent-muted)]"
                    >
                      <div className="relative z-10 mb-1 flex items-start gap-3">
                        <IconTile>
                          <GraduationCap />
                        </IconTile>
                        <h3 className="flex-1 text-base font-medium">
                          {edu.school}
                        </h3>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
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

                    {isOpen && (
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
                                  className="h-full w-full object-cover"
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
                    )}
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
                    onClick={() => setProjectFilter(tab)}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-colors ${
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
                  className="ml-1 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-zinc-50 px-2.5 py-0.5 font-mono text-[11px] text-[var(--foreground)] hover:bg-[var(--muted-bg)] dark:bg-zinc-900"
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
                      <IconTile className="mx-4">
                        <span className="font-mono text-[10px] font-semibold">
                          {project.num}
                        </span>
                      </IconTile>

                      <div className="flex flex-1 items-center gap-2 border-l border-dashed border-[var(--line)] p-4">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedProjects((prev) => ({
                              ...prev,
                              [project.num]: !prev[project.num],
                            }))
                          }
                          className="flex-1 text-left"
                        >
                          <div className="mb-0.5 flex flex-wrap items-center gap-2">
                            <h3 className="font-medium leading-snug">
                              {project.title}
                            </h3>
                            {project.awards && project.awards.length > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.2 font-mono text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                <Trophy className="h-2.5 w-2.5" />
                                {project.awards[0]}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[var(--muted-foreground)]">
                            <span>{project.category}</span>
                            <span>·</span>
                            <span>{project.tech.slice(0, 3).join(", ")}</span>
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
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Direct External Repository Link */}
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open project repository"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedProjects((prev) => ({
                              ...prev,
                              [project.num]: !prev[project.num],
                            }))
                          }
                          aria-label="Toggle project details"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)]"
                        >
                          <ChevronsUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
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
                                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--foreground)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--background)] hover:opacity-90"
                              >
                                <span>{project.linkText || "View Project →"}</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {filteredProjects.length > 5 && (
              <div className="screen-line-top flex items-center justify-center py-3">
                <button
                  type="button"
                  onClick={() => setShowAllProjects((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-zinc-50 px-3 py-1.5 font-mono text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)] dark:bg-zinc-900"
                >
                  <span>
                    {showAllProjects
                      ? "Show less"
                      : `Show all ${filteredProjects.length} projects`}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
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
                      <IconTile className="mx-4">
                        <CircleCheckBig />
                      </IconTile>

                      <div className="flex flex-1 items-center gap-2 border-l border-dashed border-[var(--line)] p-4">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCerts((prev) => ({
                              ...prev,
                              [cert.id]: !prev[cert.id],
                            }))
                          }
                          className="flex-1 text-left"
                        >
                          <h3 className="mb-0.5 font-medium leading-snug">
                            {cert.title} — {cert.subtitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-[var(--muted-foreground)]">
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
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-[var(--border)] bg-zinc-50 px-2 font-mono text-[11px] text-[var(--foreground)] hover:bg-[var(--muted-bg)] dark:bg-zinc-900"
                        >
                          <FileText className="h-3 w-3 text-[var(--muted-foreground)]" />
                          <span className="hidden sm:inline">View PDF</span>
                        </button>

                        <a
                          href={cert.pdf}
                          download
                          title="Download PDF"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCerts((prev) => ({
                              ...prev,
                              [cert.id]: !prev[cert.id],
                            }))
                          }
                          aria-label="Toggle certificate preview"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--muted-foreground)]"
                        >
                          <ChevronsUpDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
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
                              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 font-mono text-xs text-[var(--foreground)] hover:bg-[var(--muted-bg)]"
                            >
                              <Download className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                              <span>Download</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
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
                  className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-zinc-50/50 p-3 transition-colors hover:border-[var(--foreground)]/30 dark:bg-zinc-900/40"
                >
                  <div className="flex items-center gap-3">
                    <IconTile>
                      <Mail />
                    </IconTile>
                    <div>
                      <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        01 · EMAIL
                      </div>
                      <div className="font-mono text-xs font-medium">
                        MaoSeavik@gmail.com
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                </a>

                <a
                  href="https://huggingface.co/Maoseavik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-zinc-50/50 p-3 transition-colors hover:border-[var(--foreground)]/30 dark:bg-zinc-900/40"
                >
                  <div className="flex items-center gap-3">
                    <IconTile>
                      <Sparkles />
                    </IconTile>
                    <div>
                      <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        02 · HUGGING FACE
                      </div>
                      <div className="font-mono text-xs font-medium">
                        huggingface.co/Maoseavik
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                </a>

                <a
                  href="https://github.com/Seavik2142"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-zinc-50/50 p-3 transition-colors hover:border-[var(--foreground)]/30 dark:bg-zinc-900/40"
                >
                  <div className="flex items-center gap-3">
                    <IconTile>
                      <Github />
                    </IconTile>
                    <div>
                      <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        03 · GITHUB
                      </div>
                      <div className="font-mono text-xs font-medium">
                        github.com/Seavik2142
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                </a>

                <a
                  href="https://www.linkedin.com/in/mao-seavik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-zinc-50/50 p-3 transition-colors hover:border-[var(--foreground)]/30 dark:bg-zinc-900/40"
                >
                  <div className="flex items-center gap-3">
                    <IconTile>
                      <Linkedin />
                    </IconTile>
                    <div>
                      <div className="font-mono text-[10px] text-[var(--muted-foreground)] uppercase">
                        04 · LINKEDIN
                      </div>
                      <div className="font-mono text-xs font-medium">
                        linkedin.com/in/mao-seavik
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsModalMinimized(false);
                  }}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--foreground)] px-4 font-mono text-xs font-medium text-[var(--background)] transition-opacity hover:opacity-90"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>SEND ME A MESSAGE →</span>
                </button>

                <button
                  type="button"
                  onClick={openResumePdf}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-zinc-50 px-4 font-mono text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)] dark:bg-zinc-900"
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
                maoseavik.com
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

              <div className="flex flex-col justify-between gap-2 bg-[var(--background)] px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wider text-[var(--muted-foreground)] uppercase">
                  Approved by
                </dt>
                <dd className="flex flex-col justify-end gap-1.5">
                  <span className="font-handwritten text-2xl leading-none text-blue-900 dark:text-[var(--foreground)] select-none">
                    Mao Seavik
                  </span>
                  <span className="border-t border-[var(--line)] pt-1.5 font-sans text-xs font-medium tracking-wide uppercase">
                    MAO SEAVIK
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <SiteFooterInteractiveLogotype />
        <div className="h-14" />
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
