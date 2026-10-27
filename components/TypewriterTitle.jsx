"use client";

import React, { useEffect, useState } from "react";

export default function TypewriterTitle({ text, className = "", ...props }) {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`section-title fade-in-title ${visible ? "is-visible" : ""} ${className}`}
      {...props}
    >
      <span style={{ whiteSpace: "pre-line" }}>{text}</span>
    </div>
  );
}
