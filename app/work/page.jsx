"use client";

import React from "react";
import WorkHeader from "../../components/WorkHeader";
import TechnicalArchive, { FrameWidthDimension } from "../../components/TechnicalArchive";
import DigitalGallery from "../../components/DigitalGallery";
import WorkCTA from "../../components/WorkCTA";
import { PROJECTS } from "../../lib/projects";

const technical = PROJECTS.filter((p) => !p.category.includes("Digital"));
const digital = PROJECTS.filter((p) => p.category.includes("Digital"));

export default function Work() {
  return (
    <div className="group/layout relative isolate min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <WorkHeader />

      <main className="max-w-[100vw] overflow-x-clip px-2">
        <div className="mx-auto md:max-w-3xl">
          <FrameWidthDimension />

          <TechnicalArchive projects={technical} />

          <div className="stripe-divider h-8 w-full border-x border-[var(--line)]" />

          <DigitalGallery projects={digital} />

          <div className="stripe-divider h-8 w-full border-x border-[var(--line)]" />

          <WorkCTA />

          <div className="stripe-divider h-12 w-full border-x border-[var(--line)]" />
        </div>
      </main>
    </div>
  );
}
