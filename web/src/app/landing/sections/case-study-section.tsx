// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { 
  Wind, 
  FileText, 
  Leaf, 
  Flower, 
  Mountain, 
  Home as HomeIcon, 
  GanttChart, 
  BarChart 
} from "lucide-react";

import { BentoCard } from "~/components/magicui/bento-grid";

import { SectionHeader } from "../components/section-header";

const caseStudies = [
  {
    id: "eiffel-tower-vs-tallest-building",
    icon: Wind,
    title: "Irish Wind Energy Potential",
    description:
      "The analysis compares Ireland's offshore wind capacity to current utilization and maps optimal locations for future development based on wind patterns and environmental impact assessments.",
    prompt: "Analyze Ireland's offshore wind energy potential and compare it to current utilization. What are the optimal locations for future development based on wind patterns and environmental impact assessments?"
  },
  {
    id: "github-top-trending-repo",
    icon: FileText,
    title: "What are Ireland's top environmental policies?",
    description:
      "The research evaluates Ireland's most impactful climate policies and compares them to EU benchmarks using comprehensive data analysis.",
    prompt: "What are Ireland's most impactful climate policies? Compare them to EU benchmarks using comprehensive data analysis."
  },
  {
    id: "nanjing-traditional-dishes",
    icon: Leaf,
    title: "Explore Ireland's biodiversity hotspots",
    description:
      "The study vividly showcases Ireland's crucial biodiversity areas through rich content and imagery, highlighting their ecological significance and conservation status.",
    prompt: "Explore Ireland's crucial biodiversity areas. What is their ecological significance and current conservation status?"
  },
  {
    id: "rental-apartment-decoration",
    icon: Flower,
    title: "How to create a sustainable Irish garden?",
    description:
      "The study provides readers with practical and straightforward methods for developing native plant gardens in Irish climate conditions, accompanied by seasonal planting guides.",
    prompt: "How can I create a sustainable Irish garden? Provide practical methods for developing native plant gardens in Irish climate conditions, including seasonal planting guides."
  },
  {
    id: "review-of-the-professional",
    icon: Mountain,
    title: "The impact of peatland restoration in Ireland'",
    description:
      "The research provides a comprehensive analysis of Irish peatland restoration projects, including their carbon sequestration potential, biodiversity benefits, and implementation challenges.",
    prompt: "Analyze the impact of peatland restoration in Ireland. What is the carbon sequestration potential, biodiversity benefits, and what implementation challenges exist?"
  },
  {
    id: "china-food-delivery",
    icon: HomeIcon,
    title: "How effective are community energy schemes in rural Ireland?",
    description:
      "The research analyzes the growing adoption of community-owned renewable energy projects in rural Irish communities, highlighting their economic benefits, implementation models, and policy support.",
    prompt: "Evaluate the effectiveness of community energy schemes in rural Ireland. What economic benefits do they provide, what implementation models exist, and what policy support is available?"
  },
  {
    id: "ultra-processed-foods",
    icon: GanttChart,
    title: "Are Irish organic farming practices sustainable?",
    description:
      "The research examines the environmental impact of Irish organic farming methods, comparing carbon footprints, biodiversity outcomes, and economic viability to conventional agriculture.",
    prompt: "Are Irish organic farming practices sustainable? Compare their environmental impact, carbon footprint, biodiversity outcomes, and economic viability to conventional agriculture."
  },
  {
    id: "ai-twin-insurance",
    icon: BarChart,
    title: "Analyze Ireland's progress toward 2030 climate goals",
    description:
      "The research explores Ireland's climate action plan implementation, highlighting achievements, challenges, policy effectiveness, and recommendations for accelerating progress.",
    prompt: "Analyze Ireland's progress toward 2030 climate goals. What has been achieved so far, what challenges remain, how effective are current policies, and what recommendations can accelerate progress?"
  },
];

export function CaseStudySection() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center">
      <SectionHeader
        anchor="case-studies"
        title="Case Studies"
        description="Click on any case study to start a new investigation on the topic."
      />
      <div className="grid w-full max-w-[90%] sm:max-w-[95%] md:max-w-[90%] lg:max-w-[85%] grid-cols-1 gap-6 px-2 sm:px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {caseStudies.map((caseStudy) => (
          <div key={caseStudy.title} className="w-full">
            <BentoCard
              {...{
                Icon: caseStudy.icon,
                name: caseStudy.title,
                description: caseStudy.description,
                href: `/chat?prompt=${encodeURIComponent(caseStudy.prompt)}`,
                cta: "Start investigation",
                className: "w-full h-full min-h-[280px]",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
