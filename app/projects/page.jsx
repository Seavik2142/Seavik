"use client";

import React, { useState } from "react";
import { ExternalLink, Eye, FileText } from "lucide-react";
import { PROJECTS } from "../../lib/projects";
import Header from "../../components/Header";
import TypewriterTitle from "../../components/TypewriterTitle";
import MediaModal from "../../components/MediaModal";
import { isPdf, safeMediaUrl, getFormatLabel } from "../../lib/media";

export default function ProjectsPage() {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const openMedia = (project) => {
    const url = project.image || project.file || "";
    setSelectedMedia({
      url,
      title: project.title,
      subtitle: project.category,
    });
    setIsMediaModalOpen(true);
  };

  return (
    <>
      <Header alwaysShowCoffee alwaysShowBackToTop />
      <div className="projects-page">
        <div className="projects-header">
          <div className="section-label">All Work</div>
          <TypewriterTitle text="Technical Projects" />
          <div className="section-desc">
            A complete collection of my technical work, systems, and digital projects.
          </div>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((project, index) => {
            const mediaUrl = project.image || project.file || "";
            const isDocPdf = isPdf(mediaUrl);
            const formatLabel = getFormatLabel(mediaUrl);

            return (
              <div key={index} className="project-card">
                <div
                  className="project-image-wrap"
                  onClick={() => openMedia(project)}
                  style={{ cursor: "pointer" }}
                  title="Click to preview file"
                >
                  {isDocPdf ? (
                    <div className="project-pdf-thumbnail">
                      <div className="project-pdf-badge">
                        <FileText size={12} /> {formatLabel}
                      </div>
                      <FileText size={48} className="project-pdf-icon" />
                      <span className="project-pdf-hint">Preview PDF Document</span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={safeMediaUrl(mediaUrl)}
                        alt={project.title}
                        className="project-image"
                        onError={(e) => {
                          e.currentTarget.src = "/images/profile.png";
                        }}
                      />
                      <div className="project-image-overlay">
                        <span className="project-format-pill">{formatLabel}</span>
                        <span className="project-preview-hint">
                          <Eye size={12} /> Preview
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="project-content">
                  <div className="project-header">
                    <div className="project-num">{project.num}</div>
                    <div className="project-category">{project.category}</div>
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.desc}</p>
                  <div className="project-tech">
                    {project.tech.map((t, i) => (
                      <span key={i} className="project-tech-item">{t}</span>
                    ))}
                  </div>
                  {project.awards && project.awards.length > 0 && (
                    <div className="project-awards">
                      {project.awards.map((award, i) => (
                        <span key={i} className="project-award-item">{award}</span>
                      ))}
                    </div>
                  )}
                  <div className="project-actions" style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "16px" }}>
                    <button
                      type="button"
                      className="project-preview-btn"
                      onClick={() => openMedia(project)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: "var(--surface-2)",
                        color: "var(--text)",
                        border: "1px solid var(--line)",
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={13} /> Preview {isDocPdf ? "Document" : "Media"}
                    </button>
                    <a
                      href={project.link}
                      className="project-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.linkText} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MediaModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        media={selectedMedia}
      />
    </>
  );
}
