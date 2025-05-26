// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import Link from "next/link";

import { FlickeringGrid } from "~/components/magicui/flickering-grid";

import { SiteHeader } from "./chat/components/site-header";
import { Jumbotron } from "./landing/components/jumbotron";
import { Ray } from "./landing/components/ray";
import { CaseStudySection } from "./landing/sections/case-study-section";
import { CoreFeatureSection } from "./landing/sections/core-features-section";
import { MultiAgentSection } from "./landing/sections/multi-agent-section";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen landing-page">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#003399] via-[#003399] to-[#003399]" />
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <FlickeringGrid
          id="main-page-bg"
          className="w-full h-full"
          squareSize={4}
          gridGap={4}
          color="#FFFFFF"
          maxOpacity={0.15}
          flickerChance={0.12}
        />
      </div>
      <SiteHeader />
      <main className="container relative z-10 flex flex-col items-center justify-center gap-56 mt-16">
        <Jumbotron />
        <CaseStudySection />
        <MultiAgentSection />
        <CoreFeatureSection />
      </main>
      <Footer />
      <Ray />
    </div>
  );
}

function Footer() {
  return (
    <footer className="container relative mt-32 flex flex-col items-center justify-center">
      <hr className="from-border/0 via-border/70 to-border/0 m-0 h-px w-full border-none bg-gradient-to-r" />
      <div className="text-muted-foreground container flex h-20 flex-col items-center justify-center text-sm">
        <p className="text-center font-serif text-lg md:text-xl">
          &quot;Originated from Open Source, give back to Open Source.&quot;
        </p>
      </div>
      <div className="text-muted-foreground container mb-8 flex flex-col items-center justify-center text-xs">
          <p>Built on <Link href="https://github.com/bytedance/deer-flow" target="_blank" className="underline hover:text-white">DeerFlow</Link> with custom prompt engineering</p>
          <p>Licensed under MIT License © 2025 <Link href="https://emmi.zone" target="_blank" className="underline hover:text-white">Emmi C</Link></p>
      </div>
    </footer>
  );
}
