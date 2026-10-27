"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { safeMediaUrl } from "../lib/media";

export default function FeaturedProjects({ projects = [] }) {
  const [primary, ...secondary] = projects;

  return (
    <section className="featured-section">
      <div className="bento-grid">
        {primary && (
          <Link href={primary.link} className="bento-card bento-card--large" target="_blank" rel="noopener noreferrer">
            <div className="bento-card-image-wrap">
              <img src={safeMediaUrl(primary.image)} alt={primary.title} className="bento-card-image" draggable={false} />
            </div>
            <div className="bento-card-content">
              <div className="bento-card-top">
                <span className="bento-card-num">{primary.num}</span>
                <span className="bento-card-category">{primary.category}</span>
              </div>
              <h3 className="bento-card-title">{primary.title}</h3>
              <p className="bento-card-desc">{primary.desc}</p>
              <div className="bento-card-bottom">
                <div className="bento-card-tech">
                  {primary.tech.map((t) => (
                    <span key={t} className="bento-tag">{t}</span>
                  ))}
                </div>
                <span className="bento-card-link">
                  {primary.linkText} <ExternalLink size={14} />
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="bento-stack">
          {secondary.map((project) => (
            <Link
              key={project.num}
              href={project.link}
              className="bento-card bento-card--small"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="bento-card-image-wrap bento-card-image-wrap--short">
                <img src={safeMediaUrl(project.image)} alt={project.title} className="bento-card-image" draggable={false} />
              </div>
              <div className="bento-card-content">
                <div className="bento-card-top">
                  <span className="bento-card-num">{project.num}</span>
                  <span className="bento-card-category">{project.category}</span>
                </div>
                <h3 className="bento-card-title">{project.title}</h3>
                <p className="bento-card-desc">{project.desc}</p>
                <div className="bento-card-bottom">
                  <div className="bento-card-tech">
                    {project.tech.map((t) => (
                      <span key={t} className="bento-tag">{t}</span>
                    ))}
                  </div>
                  <span className="bento-card-link">
                    {project.linkText} <ExternalLink size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
