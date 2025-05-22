// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { Bird, Microscope, Usb, User, Lightbulb } from "lucide-react";

import { BentoCard, BentoGrid } from "~/components/magicui/bento-grid";
import { cn } from "~/lib/utils";

import { SectionHeader } from "../components/section-header";

const features = [
  {
    Icon: Microscope,
    name: "Dive Deeper and Reach Wider",
    description:
      "Unlock deeper insights with advanced tools. Our powerful search + crawling and Python tools gathers comprehensive data, delivering in-depth reports to enhance your study.",
    href: "https://github.com/EmminiX/GreenCelt/tree/main",
    cta: "Learn more",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: User,
    name: "Human-in-the-loop",
    description:
      "Refine your research plan, or adjust focus areas all through simple natural language.",
    href: "https://cloud.google.com/discover/human-in-the-loop",
    cta: "Learn more",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Bird,
    name: "Lang Stack",
    description:
      "Build with confidence using the LangChain and LangGraph frameworks.",
    href: "https://www.langchain.com/",
    cta: "Learn more",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Usb,
    name: "MCP Integrations",
    description:
      "Supercharge your research workflow and expand your toolkit with seamless MCP integrations.",
    href: "https://modelcontextprotocol.io/sdk/java/mcp-server",
    cta: "Learn more",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Lightbulb,
    name: "PromptSage Integration",
    description:
      "Enhance your environmental research with advanced prompt engineering. PromptSage optimizes AI interactions for deeper insights into Irish sustainability topics and policy analysis.",
    href: "https://drive.google.com/file/d/1GVpBhezVZKsRFqfFYQU8MJPB664_dq7E/view?usp=sharing",
    cta: "Learn more",
    background: (
      <img alt="background" className="absolute -top-20 -right-20 opacity-60" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
];

export function CoreFeatureSection() {
  return (
    <section className="relative flex w-full flex-col content-around items-center justify-center">
      <SectionHeader
        anchor="core-features"
        title="Core Features"
        description="Find out what makes GreenCeltAI effective."
      />
      <BentoGrid className="w-full max-w-[90%] sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] px-2 sm:px-4 gap-6 lg:grid-cols-2 lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard 
            key={feature.name} 
            {...feature} 
            className={cn(feature.className, "min-h-[280px]")}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
