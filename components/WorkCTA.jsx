"use client";

import React from "react";
import Link from "next/link";
import Reveal from "./Reveal";

export default function WorkCTA() {
  return (
    <section className="work-cta">
      <div className="work-cta-inner">
        <Reveal>
          <div className="work-cta-eyebrow">HAVE A PROJECT IN MIND?</div>
        </Reveal>

        <Reveal delay={150}>
          <div className="work-cta-main">
            <h2 className="work-cta-heading">Let&apos;s build something useful.</h2>
            <Link href="/#contact" className="work-cta-button">
              Hire Me →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
