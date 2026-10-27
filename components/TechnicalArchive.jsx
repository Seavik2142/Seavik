"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import TypewriterTitle from "./TypewriterTitle";
import Reveal from "./Reveal";

const TECH_LOGOS = {
  "Python": "/images/logos/python.png",
  "Python Flask": "/images/logos/flask.png",
  "Python Django": "/images/logos/django.png",
  "FastAPI": "/images/logos/fastapi.svg",
  "PyTorch": "/images/logos/pytorch.svg",
  "PostgreSQL": "/images/logos/postgresql.svg",
  "React": "/images/logos/react.png",
  "JavaScript": "/images/logos/js.png",
  "PHP": "/images/logos/php.png",
  "Laravel": "/images/logos/laravel.svg",
  "Vue.js": "/images/logos/vue.svg",
  "HTML": "/images/logos/html.png",
  "CSS": "/images/logos/css.png",
};

function TechTag({ tech }) {
  const logo = TECH_LOGOS[tech];
  if (logo) {
    return (
      <span className="archive-tag">
        <img src={logo} alt={tech} className="archive-tag-img" />
      </span>
    );
  }
  return <span className="archive-tag">{tech}</span>;
}

export default function TechnicalArchive({ projects = [] }) {
  return (
    <section className="archive-section" id="technical">
      <Reveal>
        <div className="archive-header">
          <div className="archive-header-left">
            <div className="section-label">Archive</div>
            <TypewriterTitle text="Technical Projects" />
            <p className="archive-description">A complete collection of my technical work, systems, and digital projects.</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="archive-list">
          {projects.map((project) => (
            <Link
              key={project.num}
              href={project.link}
              className="archive-row"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="archive-row-num">{project.num}</span>
              <div className="archive-row-main">
                <div className="archive-row-title">{project.title}</div>
                <div className="archive-row-desc">{project.desc}</div>
                <div className="archive-row-tags">
                  <span className="archive-row-category">{project.category}</span>
                  <div className="archive-row-tech">
                    {project.tech.map((t) => (
                      <TechTag key={t} tech={t} />
                    ))}
                  </div>
                </div>
              </div>
              <span className="archive-row-action">
                <ExternalLink size={16} />
              </span>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
