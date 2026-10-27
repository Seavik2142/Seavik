"use client";

import React, { useState } from "react";
import TypewriterTitle from "./TypewriterTitle";
import Reveal from "./Reveal";
import MediaModal from "./MediaModal";
import { isPdf, safeMediaUrl, getFormatLabel } from "../lib/media";
import { FileText, Eye } from "lucide-react";

export default function DigitalGallery({ projects = [] }) {
  const [hero, ...rest] = projects;
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const openMedia = (project) => {
    const url = project.image || project.file || "";
    setSelectedMedia({
      url,
      title: project.title,
      subtitle: project.category || "Digital Project",
    });
    setIsMediaModalOpen(true);
  };

  const renderThumbnail = (project, isHero = false) => {
    const url = project.image || project.file || "";
    const isDocPdf = isPdf(url);
    const formatLabel = getFormatLabel(url);

    if (isDocPdf) {
      return (
        <div className={`digital-pdf-preview ${isHero ? "digital-pdf-hero" : ""}`}>
          <div className="digital-pdf-badge">
            <FileText size={12} /> {formatLabel}
          </div>
          <FileText size={isHero ? 56 : 40} className="digital-pdf-icon" />
          <span className="digital-pdf-hint">Click to Preview Document</span>
        </div>
      );
    }

    return (
      <div className="digital-img-container">
        <img
          src={safeMediaUrl(url)}
          alt={project.title}
          className="digital-image"
          onError={(e) => {
            e.currentTarget.src = "/images/profile.png";
          }}
        />
        <div className="digital-overlay">
          <span className="digital-format-tag">{formatLabel}</span>
          <span className="digital-preview-hint">
            <Eye size={12} /> Click to View
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="digital-section" id="digital">
        <Reveal>
          <div className="digital-header">
            <div className="section-label">Digital Projects</div>
            <TypewriterTitle text="Beyond Code" />
            <div className="section-desc">
              Creative, visual, content, and digital projects developed alongside my technical work.
            </div>
          </div>
        </Reveal>

        {hero && (
          <Reveal delay={100}>
            <div
              className="digital-card digital-card--hero"
              onClick={() => openMedia(hero)}
              style={{ cursor: "pointer" }}
            >
              <div className="digital-image-wrap digital-image-wrap--hero">
                {renderThumbnail(hero, true)}
              </div>
              <div className="digital-content digital-content--hero">
                <span className="digital-hero-num" aria-hidden="true">{hero.num}</span>
                <h3 className="digital-title">{hero.title}</h3>
                <p className="digital-desc">{hero.desc}</p>
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={100}>
          <div className="digital-grid">
            {rest.map((project) => (
              <div
                key={project.num}
                className="digital-card"
                onClick={() => openMedia(project)}
                style={{ cursor: "pointer" }}
              >
                <div className="digital-image-wrap">
                  {renderThumbnail(project, false)}
                </div>
                <div className="digital-content digital-content--grid">
                  <span className="digital-grid-num" aria-hidden="true">{project.num}</span>
                  <h3 className="digital-title">{project.title}</h3>
                  <p className="digital-desc">{project.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        media={selectedMedia}
      />
    </>
  );
}