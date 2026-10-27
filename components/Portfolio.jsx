"use client";

import React, { useEffect, useState, useRef } from "react";
import { Github, Mail, ExternalLink, X, Code2, FlaskConical, Rocket, Trophy, GraduationCap, Linkedin, Minus, Eye, Download, FileText, Sparkles, Cpu, Bot } from "lucide-react";
import Link from "next/link";
import { PROJECTS } from "../data/projects";
import { CERTIFICATES } from "../data/certificates";
import Header from "./Header";
import TypewriterTitle from "./TypewriterTitle";
import Reveal from "./Reveal";
import MediaModal from "./MediaModal";
import { isPdf, isImage, getFormatLabel, safeMediaUrl } from "../lib/media";

const WHAT_I_CAN_DO = [
  {
    group: "AI Engineering & LLM Systems",
    description:
      "Fine-tuning domain-specific language models with LoRA and PEFT adapters, optimizing weights via GGUF quantization for edge inference, and architecting production conversational AI copilots with structured outputs and multimodal vision.",
    visual: "ai",
    size: "large",
    items: [
      "PyTorch",
      "Hugging Face",
      "LoRA / PEFT",
      "Qwen 2.5 & 3B Fine-Tuning",
      "GGUF Quantization",
      "ZeroGPU Cloud Spaces",
      "FastAPI",
      "Claude API",
      "Multimodal Vision",
      "Prompt Caching",
      "AI Copilots & Workflows",
      "Python 3.12+",
    ],
  },
  {
    group: "Full-Stack Web & Backend Engineering",
    description:
      "Developing resilient web platforms, REST APIs, and commerce integrations with modern frameworks, relational databases, and payment gateways like Bakong KHQR and ABA PayWay.",
    visual: "fullstack",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Laravel",
      "PHP",
      "Vue 3",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Bakong KHQR",
      "Telegram Mini Apps",
      "RESTful APIs",
    ],
  },
  {
    group: "Digital Systems & Visual Architecture",
    description:
      "Bridging machine learning engineering with clean UI/UX designs, responsive component kits, automated workflow pipelines, and developer community platforms.",
    visual: "design",
    items: [
      "Figma UI/UX",
      "Tailwind CSS",
      "System Architecture",
      "Git & GitHub",
      "API Integrations",
      "Data Modeling",
      "Workflow Automation",
    ],
  },
];

const SOCIALS = [
  { label: "Email", value: "MaoSeavik@gmail.com", href: "mailto:MaoSeavik@gmail.com", icon: Mail, color: "#000000" },
  { label: "GitHub", value: "github.com/Seavik2142", href: "https://github.com/Seavik2142", icon: Github, color: "#000000" },
  { label: "Hugging Face", value: "huggingface.co/Maoseavik", href: "https://huggingface.co/Maoseavik", icon: Sparkles, color: "#000000" },
  { label: "LinkedIn", value: "linkedin.com/in/mao-seavik", href: "https://www.linkedin.com/in/mao-seavik", icon: Linkedin, color: "#000000" },
];

const CARDS = [
  "Problem Solver",
  "Detail-Oriented",
  "Reliable",
  "Organized",
  "Curious",
  "Quick Learner",
  "Creative",
  "Adaptable",
  "User-Focused",
  "Open to Feedback",
];

// Fixed "chaotic" rotation/offset per card so each trait keeps its own
// scattered position as it cycles through the stack (looks like a messy
// pile of photos rather than a neat deck).
const CARD_SCATTER = [
  { rot: -7, x: 6, y: -4 },
  { rot: 5, x: -8, y: 3 },
  { rot: -3, x: 10, y: 6 },
  { rot: 9, x: -5, y: -6 },
  { rot: -10, x: 4, y: 5 },
  { rot: 4, x: -10, y: -2 },
  { rot: -5, x: 9, y: -5 },
  { rot: 8, x: -3, y: 7 },
  { rot: -8, x: 7, y: 2 },
  { rot: 3, x: -6, y: -7 },
];

const CURRENTLY = [
  { icon: Cpu, label: "Fine-Tuning", detail: "Qwen LLMs & LoRA Adapters" },
  { icon: Bot, label: "Building", detail: "OmniChat AI CRM (ChhlatAI)" },
  { icon: Rocket, label: "Deploying", detail: "Hugging Face ZeroGPU Spaces" },
];

const EXPERIENCE = [
  {
    title: "Specialized AI Engineering & LLM Model Fine-Tuning",
    subtitle: "LoRA / PEFT Adapters, GGUF Quantization & ZeroGPU Cloud Spaces",
    org: "Hugging Face Pro • Independent AI Systems & Open Source",
    date: "2024 - 2026",
    badge: "Specialized AI Engineering",
    desc: "Advanced applied AI engineering specialization focusing on domain-specific LLM fine-tuning, parameter-efficient training (LoRA/PEFT), model quantization, and production AI copilot deployment. Successfully trained and released models on Hugging Face including agri-qwen3b-lora, agrisystem-qwen2.5-3b-adapter, and GGUF quantized models for edge diagnostics. Deployed interactive MCP cloud spaces on Hugging Face ZeroGPU (KeleoIP running at 5.7 TFLOPS and AgriSystem Assistant). Architected OmniChat CRM (ChhlatAI) combining Claude LLM structured outputs, prompt caching, vision-based slip verification, and Bakong KHQR checkout.",
    tags: [
      "Hugging Face Pro",
      "LoRA / PEFT",
      "Qwen 2.5 & 3B",
      "GGUF Quantization",
      "ZeroGPU (5.7 TFLOPS)",
      "FastAPI & Claude API",
      "Multimodal Vision",
      "Bakong KHQR",
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
    title: "Backend Development Internship",
    org: "KRU IT Solution & ETEC Center",
    date: "2026",
    imageLeft: true,
    desc: "Completed an intensive internship in backend development at KRU IT Solution. Gained hands-on experience designing robust APIs, managing MySQL database schemas, implementing server-side authentication, and working collaboratively in full-lifecycle software delivery.",
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
    title: "AI Expert System & Innovation 2026",
    subtitle: "Project: Agriculture Expert System",
    org: "Norton University — Department of Computer Studies",
    date: "September 2026",
    imageLeft: true,
    desc: "Actively participated and competed in the AI Expert System and Innovation 2026 competition. Collaborated in a team of four to build the 'Agriculture Expert System' designed to provide intelligent crop management and data-driven agricultural decision making.",
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
    title: "Foundation Year Course",
    subtitle: "Undergraduate Academic Program",
    org: "Norton University",
    date: "2023 - 2024",
    desc: "Successfully completed the Foundation Year Course at Norton University in the 2023-2024 academic year, acquiring core fundamentals in computer science, software logic, discrete structures, and technical problem solving.",
    certificates: [
      { name: "Norton University Certificate (PDF)", link: "/certificates/2.pdf" },
    ],
    images: [
      "/images/experience/Chill/1.jpeg",
      "/images/experience/Chill/2.jpeg",
      "/images/experience/Chill/3.jpeg",
    ],
  },
  {
    title: "Virtual Assistance & Digital Operations",
    org: "Department of Information and Communications Technology",
    date: "2026",
    imageLeft: true,
    desc: "Completed intensive practical training in virtual assistance fundamentals, AI-powered productivity workflows, client outreach, data validation, and digital content scheduling.",
    certificates: [],
    images: [
      "/images/experience/va/1.jpeg",
      "/images/experience/va/2.jpeg",
    ],
  },
];


// Same click-to-flick mechanic as the About-me trait cards: the front image
// flies off and the next one in the pile takes its place.
function ExperienceImageStack({ images, title }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  return (
    <div
      className="experience-image-stack"
      onClick={() => setIndex((prev) => (prev + 1) % count)}
    >
      {images.map((src, i) => {
        const offset = (i - index + count) % count;
        const isExiting = offset === count - 1;
        // Only the front 3 images and the one that just got flicked away are rendered.
        if (offset > 2 && !isExiting) return null;

        const scatter = CARD_SCATTER[i % CARD_SCATTER.length];
        let style;

        if (isExiting) {
          style = {
            "--tx": `${scatter.x + 100}px`,
            "--ty": `${scatter.y - 40}px`,
            "--rot": `${scatter.rot + 25}deg`,
            "--sc": 0.88,
            "--op": 0,
            zIndex: 5,
          };
        } else {
          const depth = offset;
          const isFront = depth === 0;
          const calm = 0.4; // dampens the scatter chaos for the album stack
          const dir = depth % 2 === 1 ? -1 : 1; // alternate: mid card peeks up, back card peeks down
          style = {
            "--tx": isFront ? "0px" : `${scatter.x * calm + depth * 8}px`,
            "--ty": isFront ? "0px" : `${scatter.y * calm + dir * depth * 10}px`,
            "--rot": isFront ? "0deg" : `${scatter.rot * calm + depth * (scatter.rot >= 0 ? 1.5 : -1.5)}deg`,
            "--sc": isFront ? 1 : 1 - depth * 0.06,
            "--op": isFront ? 1 : 0.75 - (depth - 1) * 0.2,
            zIndex: 30 - depth * 10,
          };
        }

        return (
          <img
            key={src}
            src={safeMediaUrl(src)}
            alt={`${title} ${i + 1}`}
            className={`stacked-image${offset === 0 ? " stacked-image-front" : ""}`}
            style={style}
          />
        );
      })}
    </div>
  );
}

// Mobile-only stacked album for the Work Gallery — same click-to-flick
// mechanic as the Experience section's image stack, but cycling through
// project cover images instead of a single experience's photos.
function WorkAlbumStack({ projects, activeIndex, onAdvance }) {
  const count = projects.length;

  return (
    <div className="work-mobile-stack" onClick={onAdvance}>
      {projects.map((project, i) => {
        const offset = (i - activeIndex + count) % count;
        const isExiting = offset === count - 1;
        // Only the front 3 cards and the one that just got flicked away are rendered.
        if (offset > 2 && !isExiting) return null;

        const scatter = CARD_SCATTER[i % CARD_SCATTER.length];
        let style;

        if (isExiting) {
          style = {
            "--tx": `${scatter.x + 100}px`,
            "--ty": `${scatter.y - 40}px`,
            "--rot": `${scatter.rot + 25}deg`,
            "--sc": 0.88,
            "--op": 0,
            zIndex: 5,
          };
        } else {
          const depth = offset;
          const isFront = depth === 0;
          const calm = 0.4; // dampens the scatter chaos for the album stack
          const dir = depth % 2 === 1 ? -1 : 1; // alternate: mid card peeks up, back card peeks down
          style = {
            "--tx": isFront ? "0px" : `${scatter.x * calm + depth * 8}px`,
            "--ty": isFront ? "0px" : `${scatter.y * calm + dir * depth * 10}px`,
            "--rot": isFront ? "0deg" : `${scatter.rot * calm + depth * (scatter.rot >= 0 ? 1.5 : -1.5)}deg`,
            "--sc": isFront ? 1 : 1 - depth * 0.06,
            "--op": isFront ? 1 : 0.75 - (depth - 1) * 0.2,
            zIndex: 30 - depth * 10,
          };
        }

        const mediaUrl = project.image || project.file || "";
        const isDocPdf = isPdf(mediaUrl);

        if (isDocPdf) {
          return (
            <div
              key={project.num}
              className={`stacked-image stacked-pdf${offset === 0 ? " stacked-image-front" : ""}`}
              style={style}
            >
              <div className="stacked-pdf-badge">
                <FileText size={12} /> PDF
              </div>
              <FileText size={40} className="stacked-pdf-icon" />
              <span className="stacked-pdf-title">{project.title}</span>
            </div>
          );
        }

        return (
          <img
            key={project.num}
            src={safeMediaUrl(mediaUrl)}
            alt={project.title}
            className={`stacked-image${offset === 0 ? " stacked-image-front" : ""}`}
            style={style}
            draggable={false}
            onError={(e) => {
              e.currentTarget.src = "/images/profile.png";
            }}
          />
        );
      })}
    </div>
  );
}

export default function Portfolio() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rootRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const heroRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const [cardIndex, setCardIndex] = useState(0);
  const [cardPaused, setCardPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMinimized, setIsModalMinimized] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const openMedia = (media) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  const activeProject = PROJECTS[activeIndex];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goTo = (index) => {
    const normalized = ((index % PROJECTS.length) + PROJECTS.length) % PROJECTS.length;
    setActiveIndex(normalized);
  };

  useEffect(() => {
    const handleMouse = (e) => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const track = marqueeTrackRef.current;
    if (!track) return;

    const syncMarqueeSpeed = () => {
      const enterSeconds = 8; // matches marquee-enter duration in CSS
      const pxPerSecond = window.innerWidth / enterSeconds; // entrance travels 100vw in 4s
      const loopDistance = track.scrollWidth / 2; // loop travels -50% of the doubled track
      const loopSeconds = loopDistance / pxPerSecond;
      // Set on the hero section (not the track itself) so every bg-name-track
      // descendant -- the center row and all mobile fill rows -- inherits the
      // exact same duration and stays in perfect sync as one cohesive animation.
      heroRef.current?.style.setProperty("--marquee-loop-duration", `${loopSeconds}s`);
    };

    syncMarqueeSpeed();
    window.addEventListener("resize", syncMarqueeSpeed);
    return () => window.removeEventListener("resize", syncMarqueeSpeed);
  }, []);

  useEffect(() => {
    if (cardPaused) return;
    const id = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % CARDS.length);
    }, 1500);
    return () => clearInterval(id);
  }, [cardPaused]);

  return (
    <div
  ref={rootRef}
  className="portfolio-root"
>
      <svg className="bg-lines" viewBox="0 0 1440 5000" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
        <g opacity="0.28">
          <path d="M-100 200 C 200 100, 500 300, 800 200 C 1100 100, 1300 280, 1540 180" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 350 C 300 250, 600 400, 900 320 C 1200 240, 1400 380, 1440 300" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
          <path d="M-80 500 C 240 420, 540 580, 840 500 C 1140 420, 1360 560, 1500 480" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
        </g>
        <g opacity="0.32">
          <path d="M0 700 C 320 620, 620 780, 920 700 C 1220 620, 1420 760, 1440 680" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
          <path d="M-100 850 C 260 780, 560 920, 860 860 C 1160 800, 1380 940, 1540 880" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 1000 C 300 940, 600 1060, 900 1000 C 1200 940, 1400 1080, 1440 1020" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
        </g>
        <g opacity="0.22">
          <path d="M-120 1250 C 200 1180, 500 1320, 820 1260 C 1140 1200, 1340 1340, 1560 1280" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 1400 C 280 1340, 580 1460, 880 1400 C 1180 1340, 1380 1480, 1440 1420" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
          <path d="M-60 1550 C 240 1490, 540 1610, 840 1550 C 1140 1490, 1360 1630, 1500 1570" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 1700 C 320 1640, 620 1760, 920 1700 C 1220 1640, 1420 1780, 1440 1720" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
        </g>
        <g opacity="0.3">
          <path d="M-140 1950 C 220 1880, 520 2020, 860 1960 C 1200 1900, 1400 2040, 1580 1980" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 2100 C 300 2040, 600 2160, 900 2100 C 1200 2040, 1400 2180, 1440 2120" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
          <path d="M-80 2250 C 240 2190, 540 2310, 840 2250 C 1140 2190, 1360 2330, 1500 2270" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
        </g>
        <g opacity="0.26">
          <path d="M0 2500 C 320 2440, 620 2560, 920 2500 C 1220 2440, 1420 2580, 1440 2520" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
          <path d="M-100 2650 C 260 2590, 560 2710, 860 2650 C 1160 2590, 1380 2730, 1540 2670" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 2800 C 300 2740, 600 2860, 900 2800 C 1200 2740, 1400 2880, 1440 2820" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
          <path d="M-60 2950 C 240 2890, 540 3010, 840 2950 C 1140 2890, 1360 3030, 1500 2970" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
        </g>
        <g opacity="0.34">
          <path d="M-120 3250 C 200 3180, 500 3320, 820 3260 C 1140 3200, 1340 3340, 1560 3280" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 3400 C 280 3340, 580 3460, 880 3400 C 1180 3340, 1380 3480, 1440 3420" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
          <path d="M-80 3550 C 240 3490, 540 3610, 840 3550 C 1140 3490, 1360 3630, 1500 3570" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 3700 C 320 3640, 620 3760, 920 3700 C 1220 3640, 1420 3780, 1440 3720" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
        </g>
        <g opacity="0.24">
          <path d="M-100 4050 C 260 3990, 560 4110, 860 4050 C 1160 3990, 1380 4130, 1540 4070" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 4200 C 300 4140, 600 4260, 900 4200 C 1200 4140, 1400 4280, 1440 4220" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
          <path d="M-60 4350 C 240 4290, 540 4410, 840 4350 C 1140 4290, 1360 4430, 1500 4370" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
        </g>
        <g opacity="0.3">
          <path d="M-140 4600 C 220 4540, 520 4660, 860 4600 C 1200 4540, 1400 4680, 1580 4620" stroke="var(--light-gray)" strokeWidth="1.5" fill="none"/>
          <path d="M0 4750 C 300 4690, 600 4810, 900 4750 C 1200 4690, 1400 4830, 1440 4770" stroke="var(--light-gray)" strokeWidth="1" fill="none"/>
        </g>
      </svg>
      <Header />

      {/* HERO */}
      <section id="hero" className="hero-root" ref={heroRef}>

<div className="bg-name-marquee">
          <div className="bg-name-track" ref={marqueeTrackRef}>
            <span className="bg-name-text">MAO SEAVIK</span>
            <span className="bg-name-text">MAO SEAVIK</span>
          </div>
        </div>


        <div className="concentric-circles">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
          <div className="circle circle-3" />
        </div>

        <div className="profile-wrap">
          <img src="/images/profile.png?v=pro_seavik" alt="Mao Seavik" className="profile-image" draggable={false} />
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll Down</span>
        </div>
      </section>

      {/* WORK GALLERY */}
      <section id="work" className="section">
        <Reveal>
          <div className="work-header">
            <div>
              <div className="section-label">Selected Work</div>
              <TypewriterTitle text="Work Gallery" />
              <div className="section-desc">A collection of systems, digital projects, and technical work I've built.</div>
            </div>
            <Link href="/work" className="work-album-btn-top">
              View More Projects <ExternalLink size={14} />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="work-album">
            <div className="work-album-inner">
              {PROJECTS.map((project, index) => {
                const total = PROJECTS.length;

                let diff = (index - activeIndex + total) % total;
                if (diff > total / 2) diff -= total;

                const isCenter = diff === 0;
                const distance = Math.abs(diff);
                const dir = isCenter ? 0 : diff / distance;

                const style = isCenter
                  ? {
                      transform: "translate(-50%, -50%) scale(1)",
                      zIndex: 5,
                      opacity: 1,
                    }
                  : {
                      transform: `translate(calc(-50% + ${
                        dir * (200 + (distance - 1) * 130)
                      }px), -50%) scale(${Math.max(0.55, 1 - distance * 0.28)})`,
                      zIndex: 5 - distance,
                      opacity: distance <= 2 ? Math.max(0, 0.85 - (distance - 1) * 0.55) : 0,
                      pointerEvents: distance <= 2 ? "auto" : "none",
                    };

                const mediaUrl = project.image || project.file || "";
                const isDocPdf = isPdf(mediaUrl);
                const formatLabel = getFormatLabel(mediaUrl);

                return (
                  <div
                    key={project.num}
                    className={`work-album-item${isCenter ? " work-album-item-center" : ""}`}
                    style={style}
                    onClick={() => {
                      if (isCenter) {
                        openMedia({
                          url: mediaUrl,
                          title: project.title,
                          subtitle: project.category,
                        });
                      } else {
                        goTo(index);
                      }
                    }}
                    title={isCenter ? "Click to view full preview" : "Click to select"}
                  >
                    {isDocPdf ? (
                      <div className="work-album-pdf-card">
                        <div className="work-album-pdf-badge">
                          <FileText size={12} />
                          <span>{formatLabel}</span>
                        </div>
                        <div className="work-album-pdf-content">
                          <div className="work-album-pdf-icon-ring">
                            <FileText size={42} className="work-album-pdf-icon" />
                          </div>
                          <span className="work-album-pdf-title">{project.title}</span>
                          <span className="work-album-pdf-hint">
                            <Eye size={12} /> {isCenter ? "Click to preview document" : "PDF Document"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="work-album-img-wrap">
                        <img
                          src={safeMediaUrl(mediaUrl)}
                          alt={project.title}
                          className="work-album-img"
                          draggable={false}
                          onError={(e) => {
                            e.currentTarget.src = "/images/profile.png";
                          }}
                        />
                        <div className="work-album-overlay">
                          <span className="work-album-format-pill">{formatLabel}</span>
                          {isCenter && (
                            <span className="work-album-preview-hint">
                              <Eye size={12} /> Click to expand
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="work-mobile-stack-wrap">
            <WorkAlbumStack
              projects={PROJECTS}
              activeIndex={activeIndex}
              onAdvance={() => goTo(activeIndex + 1)}
            />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="work-info" key={activeProject.num}>
            <div className="work-info-meta">
              <span className="work-info-category">{activeProject.category}</span>
              <span className="work-info-format-badge">
                {isPdf(activeProject.image) ? <FileText size={12} /> : null}
                {getFormatLabel(activeProject.image)}
              </span>
            </div>
            <h3 className="work-info-title">{activeProject.title}</h3>
            <p className="work-info-desc">{activeProject.desc}</p>

            {activeProject.tech && activeProject.tech.length > 0 && (
              <div className="work-info-tech">
                {activeProject.tech.map((t) => (
                  <span key={t} className="work-info-tech-tag">{t}</span>
                ))}
              </div>
            )}

            <div className="work-info-actions">
              <button
                type="button"
                className="work-info-preview-btn"
                onClick={() =>
                  openMedia({
                    url: activeProject.image,
                    title: activeProject.title,
                    subtitle: activeProject.category,
                  })
                }
              >
                <Eye size={14} />
                <span>Preview {isPdf(activeProject.image) ? "Document" : "Media"}</span>
              </button>

              <a
                href={activeProject.link}
                className="work-info-link"
                target={activeProject.link !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                {activeProject.linkText || "View Project →"}
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* WHAT I CAN DO */}
      <section id="what-i-can-do" className="section">
        <div className="what-i-can-do-grid">
          <div className="what-i-can-do-left">
            <Reveal>
              <div className="section-label">My Capabilities</div>
              <TypewriterTitle text="What I Can Do" />
              <div className="what-i-can-do-desc">
                I combine technical, problem-solving, and digital skills to build reliable systems, test systems, manage data, and support efficient digital workflows.
              </div>
              <div className="tech-stack">
                <div className="tech-stack-column">
                  <div className="tech-stack-item">
                    <img src="/images/logos/python.png" alt="Python" draggable={false} />
                    <span className="tech-stack-label">Python</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/pytorch.svg" alt="PyTorch" draggable={false} />
                    <span className="tech-stack-label">PyTorch</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/huggingface.svg" alt="Hugging Face" draggable={false} />
                    <span className="tech-stack-label">Hugging Face</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/fastapi.svg" alt="FastAPI" draggable={false} />
                    <span className="tech-stack-label">FastAPI</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/flask.png" alt="Flask" draggable={false} />
                    <span className="tech-stack-label">Flask</span>
                  </div>
                </div>
                <div className="tech-stack-column">
                  <div className="tech-stack-item">
                    <img src="/images/logos/react.png" alt="React" draggable={false} />
                    <span className="tech-stack-label">React</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/vue.svg" alt="Vue 3" draggable={false} />
                    <span className="tech-stack-label">Vue 3</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/js.png" alt="JavaScript" draggable={false} />
                    <span className="tech-stack-label">JavaScript</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/laravel.svg" alt="Laravel" draggable={false} />
                    <span className="tech-stack-label">Laravel</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/postgresql.svg" alt="PostgreSQL" draggable={false} />
                    <span className="tech-stack-label">PostgreSQL</span>
                  </div>
                </div>
                <div className="tech-stack-column workspace-column">
                  <div className="tech-stack-item">
                    <img src="/images/workspace/visual-studio-code.svg" alt="VS Code" draggable={false} />
                    <span className="tech-stack-label">VS Code</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/workspace/docker.svg" alt="Docker" draggable={false} />
                    <span className="tech-stack-label">Docker</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/mysql.svg" alt="MySQL" draggable={false} />
                    <span className="tech-stack-label">MySQL</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/php.png" alt="PHP" draggable={false} />
                    <span className="tech-stack-label">PHP</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/logos/html.png" alt="HTML5" draggable={false} />
                    <span className="tech-stack-label">HTML5</span>
                  </div>
                </div>
                <div className="tech-stack-column workspace-column">
                  <div className="tech-stack-item">
                    <img src="/images/workspace/figma.png" alt="Figma" draggable={false} />
                    <span className="tech-stack-label">Figma</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/workspace/notion.png" alt="Notion" draggable={false} />
                    <span className="tech-stack-label">Notion</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/workspace/canva.png" alt="Canva" draggable={false} />
                    <span className="tech-stack-label">Canva</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/workspace/capcut.png" alt="CapCut" draggable={false} />
                    <span className="tech-stack-label">CapCut</span>
                  </div>
                  <div className="tech-stack-item">
                    <img src="/images/workspace/telegram.svg" alt="Telegram" draggable={false} />
                    <span className="tech-stack-label">Telegram</span>
                  </div>
                </div>
              </div>
        </Reveal>
          </div>

          <div className="what-i-can-do-right">
            {WHAT_I_CAN_DO.map((group, index) => (
              <Reveal key={group.group} delay={150 + index * 120}>
                <div className={`bento-card ${group.size === "large" ? "bento-large" : "bento-medium"}`}>
                  <div className="bento-header">
                    <div className="bento-number">{String(index + 1).padStart(2, "0")}</div>
                    <div className="bento-category">{group.group}</div>
                  </div>

                  <div className="bento-visual">
                    {index === 0 && (
                      <img src="/images/gif/coding.gif" alt="Web Development & QA" className="bento-gif" draggable={false} />
                    )}
                    {index === 1 && (
                      <img src="/images/gif/assistant.gif" alt="Virtual Assistance" className="bento-gif" draggable={false} />
                    )}
                    {index === 2 && (
                      <img src="/images/gif/social.gif" alt="Content & Digital" className="bento-gif" draggable={false} />
                    )}
                  </div>

                  <p className="bento-desc">{group.description}</p>

                  <div className="bento-skills">
                    {group.items.map((item) => (
                      <span key={item} className="bento-tag">{item}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <Reveal>
          <div className="section-label">ABOUT ME</div>
          <TypewriterTitle text={isMobile ? "Problem Solver.\nDigital Generalist." : "Problem Solver. Digital Generalist."} />
        </Reveal>

        <Reveal delay={100}>
          <div className="about-profile-card">
            <div className="about-profile-header">
              <div className="about-profile-image-wrapper">
                <img src="/images/about/profile.png?v=pro_seavik" alt="Profile" className="about-profile-image" draggable={false} />
              </div>
              <div className="about-profile-info">
                <div className="about-profile-name">
                  MAO SEAVIK
                  <img src="/images/about/badge.png" alt="Verified" className="about-profile-badge" draggable={false} />
                </div>
                <div className="about-profile-stats">
                  <div className="about-stat-item">
                    <span className="about-stat-label">PROJECTS</span>
                    <span className="about-stat-value">12+</span>
                  </div>
                  <div className="about-stat-item">
                    <span className="about-stat-label">DEGREE</span>
                    <span className="about-stat-value">CS</span>
                  </div>
                  <div className="about-stat-item">
                    <span className="about-stat-label">LOCATION</span>
                    <span className="about-stat-value">CAMBODIA</span>
                  </div>
                </div>
                <div className="about-description">
                  <p>
                    I’m a Computer Science student at Norton University and full-stack developer (SalaIT graduate) based in Phnom Penh, Cambodia. I specialize in building AI-powered expert systems, web applications, and digital platforms. As a developer and student team leader, I have designed rule-based crop disease diagnosis engines with PyTorch and Flask, created social community platforms for software engineers using Next.js and TypeScript, and developed high-performance Telegram Mini Apps and e-commerce solutions.
                  </p>
                  <p>
                    Want to know more about my experience?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        openMedia({
                          url: "/resume/Mao Seavik_Resume.pdf",
                          title: "Mao Seavik — Resume",
                          subtitle: "Curriculum Vitae • Verified Document",
                          type: "pdf",
                        })
                      }
                      className="about-resume-link"
                      style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer", textDecoration: "underline" }}
                    >
                      View my resume (PDF)
                    </button>.
                  </p>
                </div>
              </div>
            </div>
            {/* CURRENTLY + CARD STACK */}
            <div className="about-bottom-row">
              <div className="currently-strip">
                <div className="currently-strip-label">CURRENTLY</div>
                <div className="currently-strip-items">
                  {CURRENTLY.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div className="currently-item" key={item.label}>
                        <span className="currently-icon">
                          <Icon size={16} strokeWidth={2} />
                        </span>
                        <div className="currently-text">
                          <div className="currently-item-label">{item.label}</div>
                          <div className="currently-item-detail">{item.detail}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="card-stack">
                <div
                  className="card-stack-container"
                  onClick={() => setCardIndex((prev) => (prev + 1) % CARDS.length)}
                  onMouseEnter={() => setCardPaused(true)}
                  onMouseLeave={() => setCardPaused(false)}
                >
                {CARDS.map((trait, i) => {
                  const offset = (i - cardIndex + CARDS.length) % CARDS.length;
                  const isExiting = offset === CARDS.length - 1;
                  // Only the front 3 cards and the one that just got flicked away are rendered.
                  if (offset > 2 && !isExiting) return null;

                  const scatter = CARD_SCATTER[i];
                  let style;

                  if (isExiting) {
                    style = {
                      "--tx": `${scatter.x + 140}px`,
                      "--ty": `${scatter.y - 60}px`,
                      "--rot": `${scatter.rot + 40}deg`,
                      "--sc": 0.85,
                      "--op": 0,
                      zIndex: 5,
                    };
                  } else {
                    const depth = offset;
                    style = {
                      "--tx": `${scatter.x + depth * 10}px`,
                      "--ty": `${scatter.y + depth * 8}px`,
                      "--rot": `${scatter.rot + depth * (scatter.rot >= 0 ? 5 : -5)}deg`,
                      "--sc": 1 - depth * 0.045,
                      "--op": depth === 0 ? 1 : 0.55 + (2 - depth) * 0.15,
                      zIndex: 30 - depth * 10,
                    };
                  }

                  return (
                    <div
                      key={trait}
                      className={`card-stack-card${offset === 0 ? " card-stack-card-front" : ""}`}
                      style={style}
                    >
                      <div className="card-stack-label">TRAIT</div>
                      <div className="card-stack-value">{trait}</div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CERTIFICATES & CREDENTIALS (AUTHENTIC HIGH-RES PDF DOCUMENTS) */}
      <section id="awards" className="section">
        <Reveal>
          <div className="section-label">Verified Credentials</div>
          <TypewriterTitle text="Certificates & Accreditations" />
          <div className="section-desc">
            Official academic and industry credentials converted into interactive, high-definition PDF documents for verification and inspection.
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="certificates-grid">
            {CERTIFICATES.map((cert) => (
              <div key={cert.id} className="certificate-card">
                <div
                  className="certificate-thumb-wrap"
                  onClick={() =>
                    openMedia({
                      url: cert.pdf,
                      title: cert.title,
                      subtitle: `${cert.org} • ${cert.date}`,
                      type: "pdf",
                    })
                  }
                  title={`Click to preview ${cert.title} PDF`}
                >
                  <img src={cert.image} alt={cert.title} className="certificate-thumb" />
                  <div className="certificate-badge-overlay">
                    <FileText size={12} /> PDF
                  </div>
                  <div className="certificate-hover-prompt">
                    <Eye size={18} /> Click to View PDF
                  </div>
                </div>

                <div className="certificate-body">
                  <div className="certificate-meta">
                    <span className="certificate-org">{cert.org}</span>
                    <span className="certificate-date">{cert.date}</span>
                  </div>
                  <h3 className="certificate-title">{cert.title}</h3>
                  <div className="certificate-subtitle">{cert.subtitle}</div>
                  <p className="certificate-desc">{cert.desc}</p>

                  <div className="certificate-footer">
                    <button
                      type="button"
                      className="certificate-btn-primary"
                      onClick={() =>
                        openMedia({
                          url: cert.pdf,
                          title: cert.title,
                          subtitle: `${cert.org} • ${cert.date}`,
                          type: "pdf",
                        })
                      }
                    >
                      <Eye size={14} /> View PDF
                    </button>
                    <button
                      type="button"
                      className="certificate-btn-secondary"
                      onClick={() =>
                        openMedia({
                          url: cert.image,
                          title: cert.title,
                          subtitle: `${cert.org} • Original Certificate Image`,
                          type: "image",
                        })
                      }
                      title="View High-Res Certificate Image"
                    >
                      <ExternalLink size={14} />
                    </button>
                    <a
                      href={cert.pdf}
                      download
                      className="certificate-btn-secondary"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      <section id="trainings" className="section">
        <Reveal>
          <div className="section-label">Growth & Experience</div>
          <TypewriterTitle text="Trainings & Hackathons" />
          <div className="section-desc">
            A collection of trainings, workshops, and hackathons that shaped my technical and collaborative skills.
          </div>
        </Reveal>

        <div className="experience-list">
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className={`experience-card${exp.imageLeft ? " experience-card-reverse" : ""}`}>
              <div className="experience-text">
                <div className="experience-header">
                  <div className="experience-heading-wrap">
                    {exp.badge && (
                      <div className="experience-badge-pill">
                        <Sparkles size={12} /> {exp.badge}
                      </div>
                    )}
                    <h4 className="experience-title">{exp.title}</h4>
                    {exp.subtitle && <div className="experience-subtitle">{exp.subtitle}</div>}
                  </div>
                  <div className="experience-date">{exp.date}</div>
                </div>
                <div className="experience-org">{exp.org}</div>
                <div className="experience-desc">{exp.desc}</div>

                {exp.tags && (
                  <div className="experience-tags">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="experience-tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {exp.certificates && exp.certificates.length > 0 && (
                  <div className="experience-links-stack">
                    {exp.certificates.map((cert, certIdx) => (
                      <div key={certIdx} className="experience-link-item">
                        {cert.link.startsWith("http") ? (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="experience-certificate"
                          >
                            <span>{cert.name}</span>
                            <ExternalLink size={12} style={{ marginLeft: 6, flexShrink: 0 }} />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              openMedia({
                                url: cert.link,
                                title: cert.name,
                                subtitle: `${exp.org} • ${exp.date}`,
                                type: isPdf(cert.link) ? "pdf" : "image",
                              })
                            }
                            className="experience-certificate"
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                          >
                            <span>{cert.name}</span>
                            <ExternalLink size={12} style={{ marginLeft: 6, flexShrink: 0 }} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {exp.images && exp.images.length > 0 && (
                <ExperienceImageStack images={exp.images} title={exp.title} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="contact-grid">
          <div className="contact-left">
            <Reveal>
              <div className="contact-eyebrow">GET IN TOUCH</div>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="contact-headline">
                LET'S<br />
                <span className="contact-headline-accent">WORK</span><br />
                TOGETHER
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="contact-description">Looking for the next problem worth solving.</p>
            </Reveal>
            <Reveal delay={300}>
              <p className="contact-secondary">
                I'm open to opportunities where I can contribute to AI engineering, LLM fine-tuning, full-stack systems, and intelligent digital workflows.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <button
                type="button"
                onClick={() =>
                  openMedia({
                    url: "/resume/Mao Seavik_Resume.pdf",
                    title: "Mao Seavik — Resume",
                    subtitle: "Curriculum Vitae • Verified Document",
                    type: "pdf",
                  })
                }
                className="contact-resume-btn"
                style={{ cursor: "pointer", border: "none" }}
              >
                VIEW RESUME (PDF) →
              </button>
            </Reveal>
          </div>

          <div className="contact-right">
            <div className="contact-cards">
              <Reveal delay={200}>
                <a href="mailto:MaoSeavik@gmail.com" className="contact-card" target="_blank" rel="noopener noreferrer">
                  <span className="contact-card-number">01</span>
                  <div className="contact-card-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-card-info">
                    <div className="contact-card-label">EMAIL</div>
                    <div className="contact-card-value">MaoSeavik@gmail.com</div>
                  </div>
                </a>
              </Reveal>
              <Reveal delay={280}>
                <a href="https://github.com/Seavik2142" className="contact-card" target="_blank" rel="noopener noreferrer">
                  <span className="contact-card-number">02</span>
                  <div className="contact-card-icon">
                    <Github size={20} />
                  </div>
                  <div className="contact-card-info">
                    <div className="contact-card-label">GITHUB</div>
                    <div className="contact-card-value">github.com/Seavik2142</div>
                  </div>
                  <ExternalLink size={16} className="contact-card-arrow" />
                </a>
              </Reveal>
              <Reveal delay={340}>
                <a href="https://huggingface.co/Maoseavik" className="contact-card" target="_blank" rel="noopener noreferrer">
                  <span className="contact-card-number">03</span>
                  <div className="contact-card-icon">
                    <Sparkles size={20} />
                  </div>
                  <div className="contact-card-info">
                    <div className="contact-card-label">HUGGING FACE</div>
                    <div className="contact-card-value">huggingface.co/Maoseavik</div>
                  </div>
                  <ExternalLink size={16} className="contact-card-arrow" />
                </a>
              </Reveal>
              <Reveal delay={400}>
                <a href="https://www.linkedin.com/in/mao-seavik" className="contact-card" target="_blank" rel="noopener noreferrer">
                  <span className="contact-card-number">04</span>
                  <div className="contact-card-icon">
                    <Linkedin size={20} />
                  </div>
                  <div className="contact-card-info">
                    <div className="contact-card-label">LINKEDIN</div>
                    <div className="contact-card-value">linkedin.com/in/mao-seavik</div>
                  </div>
                  <ExternalLink size={16} className="contact-card-arrow" />
                </a>
              </Reveal>
            </div>
            <Reveal delay={440}>
              <button className="contact-cta" onClick={() => { setIsModalOpen(true); setIsModalMinimized(false); }}>
                SEND ME A MESSAGE →
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className={`contact-modal${isModalMinimized ? " contact-modal--minimized" : ""}`}>
          <div className="contact-modal-header" onClick={() => isModalMinimized && setIsModalMinimized(false)}>
            <h3 className="contact-modal-title">Send Me a Message</h3>
            <div className="contact-modal-controls">
              <button
                type="button"
                className="contact-modal-icon-btn contact-modal-minimize-btn"
                aria-label={isModalMinimized ? "Expand" : "Minimize"}
                onClick={(e) => { e.stopPropagation(); setIsModalMinimized((v) => !v); }}
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                className="contact-modal-icon-btn"
                aria-label="Close"
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
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
                     await fetch('https://script.google.com/macros/s/AKfycbz68sln0VIOOVOegEYiQLJwTdLonmPHMzq8jqzWCaqdgUAG2-LWxJVuRaEM5HQl6ABH/exec', {
                       method: 'POST',
                       mode: 'no-cors',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify(data),
                     });
                     setFormStatus("success");
                     form.reset();
                     setIsModalOpen(false);
                     setShowSuccessModal(true);
                   } catch (error) {
                     setFormStatus("error");
                   }
                }}
              >
                <div className="contact-modal-field">
                  <label className="contact-modal-label">Full Name</label>
                  <input type="text" name="name" className="contact-modal-input" placeholder="Your full name" required />
                </div>

                <div className="contact-modal-field">
                  <label className="contact-modal-label">Email Address</label>
                  <input type="email" name="email" className="contact-modal-input" placeholder="your.email@example.com" required />
                </div>

                <div className="contact-modal-field contact-modal-field--grow">
                  <label className="contact-modal-label">Message</label>
                  <textarea rows="6" name="message" className="contact-modal-input" placeholder="Tell me about your project..." required />
                </div>

                <button type="submit" className="contact-modal-submit" disabled={formStatus === "submitting"}>
                  {formStatus === "submitting" ? "SENDING..." : formStatus === "success" ? "MESSAGE SENT" : "SEND MESSAGE →"}
                </button>

                {formStatus === "error" && (
                  <div className="contact-modal-error">
                    Failed to send message. Please try again or contact me directly.
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      )}

      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <button className="success-modal-close" onClick={() => setShowSuccessModal(false)}>
              <X size={20} />
            </button>
            <div className="success-modal-icon">✓</div>
            <h3 className="success-modal-title">Message Sent!</h3>
            <p className="success-modal-text">Thanks for reaching out. I'll get back to you as soon as possible.</p>
            <button className="success-modal-btn" onClick={() => setShowSuccessModal(false)}>
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