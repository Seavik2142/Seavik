"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Image as ImageIcon,
  File,
} from "lucide-react";
import { isPdf, isImage, getFormatLabel, getFileBasename } from "../lib/media";

export default function MediaModal({ isOpen, onClose, media }) {
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const url = media?.url || "";
  const title = media?.title || getFileBasename(url) || "Document Preview";
  const subtitle = media?.subtitle || "";
  const fileIsPdf = isPdf(url) || media?.type === "pdf";
  const fileIsImage = isImage(url) || media?.type === "image";
  const formatLabel = getFormatLabel(url);

  // Reset state when media changes or opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setLoading(true);
      setHasError(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, url]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !url) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => setZoom(1);

  return (
    <div
      className="media-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="media-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="media-modal-header">
          <div className="media-modal-info">
            <div className="media-modal-badge-group">
              <span
                className={`media-modal-badge ${
                  fileIsPdf
                    ? "media-modal-badge--pdf"
                    : fileIsImage
                    ? "media-modal-badge--img"
                    : "media-modal-badge--file"
                }`}
              >
                {fileIsPdf ? (
                  <FileText size={12} className="inline mr-1" />
                ) : fileIsImage ? (
                  <ImageIcon size={12} className="inline mr-1" />
                ) : (
                  <File size={12} className="inline mr-1" />
                )}
                {formatLabel}
              </span>
              {subtitle && (
                <span className="media-modal-subtitle">{subtitle}</span>
              )}
            </div>
            <h3 className="media-modal-title" title={title}>
              {title}
            </h3>
          </div>

          <div className="media-modal-actions">
            {/* Zoom Controls (Images only) */}
            {fileIsImage && (
              <div className="media-modal-zoom-group">
                <button
                  type="button"
                  className="media-modal-btn"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  aria-label="Zoom Out"
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut size={16} />
                </button>
                <span className="media-modal-zoom-level">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  className="media-modal-btn"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  aria-label="Zoom In"
                  disabled={zoom >= 3}
                >
                  <ZoomIn size={16} />
                </button>
                {zoom !== 1 && (
                  <button
                    type="button"
                    className="media-modal-btn"
                    onClick={handleZoomReset}
                    title="Reset Zoom"
                    aria-label="Reset Zoom"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Direct Open in New Tab */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="media-modal-btn media-modal-btn--highlight"
              title="Open raw file in new tab"
              aria-label="Open raw file in new tab"
            >
              <ExternalLink size={16} />
              <span className="media-modal-btn-text">Open Tab</span>
            </a>

            {/* Direct Download */}
            <a
              href={url}
              download={getFileBasename(url) || "document"}
              className="media-modal-btn"
              title="Download File"
              aria-label="Download File"
            >
              <Download size={16} />
              <span className="media-modal-btn-text">Download</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              className="media-modal-btn media-modal-btn--close"
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Main Viewport */}
        <div className="media-modal-viewport">
          {loading && !hasError && (
            <div className="media-modal-loading">
              <div className="media-modal-spinner" />
              <span>Loading preview...</span>
            </div>
          )}

          {hasError ? (
            <div className="media-modal-fallback">
              <FileText size={48} className="media-modal-fallback-icon" />
              <h4>Unable to preview file inline</h4>
              <p>
                The document or image could not be loaded into the inline viewer.
                You can still view it directly or download it.
              </p>
              <div className="media-modal-fallback-actions">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="media-modal-fallback-btn"
                >
                  <ExternalLink size={16} /> Open in Browser
                </a>
                <a
                  href={url}
                  download
                  className="media-modal-fallback-btn media-modal-fallback-btn--secondary"
                >
                  <Download size={16} /> Download File
                </a>
              </div>
            </div>
          ) : fileIsPdf ? (
            /* PDF Document Viewer */
            <div className="media-modal-pdf-wrapper">
              <iframe
                src={`${url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                title={title}
                className="media-modal-pdf-frame"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setHasError(true);
                }}
              />
            </div>
          ) : fileIsImage ? (
            /* Image Lightbox Viewport */
            <div className="media-modal-image-wrapper">
              <img
                src={url}
                alt={title}
                className="media-modal-image"
                style={{
                  transform: `scale(${zoom})`,
                  transition: "transform 0.15s ease-out",
                }}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setHasError(true);
                }}
                draggable={false}
              />
            </div>
          ) : (
            /* Generic File or External Link */
            <div className="media-modal-fallback">
              <File size={48} className="media-modal-fallback-icon" />
              <h4>{title}</h4>
              <p>This file format is best viewed externally.</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="media-modal-fallback-btn"
              >
                <ExternalLink size={16} /> Open File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
