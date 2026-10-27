"use client";

import React from "react";
import WorkHeader from "../../components/WorkHeader";
import TechnicalArchive from "../../components/TechnicalArchive";
import DigitalGallery from "../../components/DigitalGallery";
import WorkCTA from "../../components/WorkCTA";
import { PROJECTS } from "../../lib/projects";

const technical = PROJECTS.filter((p) => !p.category.includes("Digital"));
const digital = PROJECTS.filter((p) => p.category.includes("Digital"));

export default function Work() {
  return (
    <main style={{ position: "relative" }}>
      <WorkHeader />

      <TechnicalArchive projects={technical} />

      <DigitalGallery projects={digital} />

      <WorkCTA />
    </main>
  );
}
