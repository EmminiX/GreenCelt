// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
