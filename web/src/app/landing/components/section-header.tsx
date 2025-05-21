// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import React from "react";

export function SectionHeader({
  anchor,
  title,
  description,
}: {
  anchor?: string;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <>
      {anchor && <a id={anchor} className="absolute -top-20" />}
      <div className="mb-12 flex flex-col items-center justify-center gap-2">
        <h2 className="mb-4 text-center text-5xl font-bold text-white [text-shadow:0_0_8px_rgba(0,0,0,0.5)]">
          {title}
        </h2>
        <p className="text-center text-xl text-white [text-shadow:0_0_8px_rgba(0,0,0,0.5)]">
          {description}
        </p>
      </div>
    </>
  );
}
