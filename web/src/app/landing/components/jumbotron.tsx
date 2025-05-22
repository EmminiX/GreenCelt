// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { Brain } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { AuroraText } from "~/components/magicui/aurora-text";
import { FlickeringGrid } from "~/components/magicui/flickering-grid";
import { Button } from "~/components/ui/button";
import { env } from "~/env";

export function Jumbotron() {
  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center pb-15 overflow-hidden">
      {/* EU silhouette with flickering stars */}
      <FlickeringGrid
        id="deer-hero"
        className="absolute inset-0 z-1 translate-y-[2vh] mask-[url(/images/deer-hero.svg)] mask-size-[100vw] mask-center mask-no-repeat md:mask-size-[72vh]"
        squareSize={3}
        gridGap={6}
        color="#FFFFFF"
        maxOpacity={3}
        flickerChance={0.25}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        <h1 className="text-center text-4xl font-bold md:text-6xl">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Environmental Intelligence{" "}
          </span>
          <AuroraText 
            className="bg-gradient-to-r from-[#169B62] via-white to-[#FF883E] bg-clip-text text-transparent"
            colors={["#169B62", "#FFFFFF", "#FF883E"]}
          >for Ireland&apos;s Green Future</AuroraText>
        </h1>
        <div className="max-w-4xl p-2 text-center text-sm md:text-2xl">
          <p className="text-[#EAFFE0] font-medium tracking-wide leading-relaxed animate-pulse-slow" style={{
            textShadow: "0 0 2px rgba(0, 0, 0, 0.9), 0 0 5px rgba(0, 0, 0, 0.8)"
          }}>
            Meet GreenCeltAI, your specialized environmental assistant for Ireland. With deep expertise in sustainability, renewable energy, and Irish environmental policy, it delivers accurate insights, practical guidance, and comprehensive support for building a greener Ireland.
          </p>
        </div>
        <div className="flex gap-6">
          <Button className="hidden text-lg md:flex md:w-42" size="lg" asChild>
            <Link
              target={
                env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY ? "_blank" : undefined
              }
              href={
                env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY
                  ? "https://emmi.zone"
                  : "/chat"
              }
            >
              Get Started <ChevronRight />
            </Link>
          </Button>
          {!env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && (
            <Button
              className="w-42 text-lg"
              size="lg"
              variant="outline"
              asChild
            >
              <Link
                href="https://emmi.zone"
                target="_blank"
              >
                <Brain />
                More Projects
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="absolute bottom-8 flex flex-col items-center text-xs opacity-70">
        <p>* GREEN stands for Grassroots Research & Environmental Education for the Nation.</p>
      </div>
    </section>
  );
}
