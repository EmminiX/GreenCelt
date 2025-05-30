// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";

import { cn } from "~/lib/utils";

export function Welcome({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("flex flex-col items-center max-w-full", className)}
      style={{ transition: "all 0.2s ease-out" }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h3 className="mb-2 text-center text-xl sm:text-2xl md:text-3xl font-medium">
        👋 Hello, there!
      </h3>
      <div className="text-muted-foreground px-2 sm:px-4 text-center text-sm sm:text-base md:text-lg max-w-[700px] mx-auto">
        Welcome to{" "}
        <a
          href="https://github.com/EmminiX/GreenCelt/tree/main"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          ☘️ GreenCeltAI
        </a>
        , a specialized environmental assistant built on cutting-edge language models, helping you research Irish sustainability initiatives, explore environmental policies, and implement green solutions.
      </div>
    </motion.div>
  );
}
