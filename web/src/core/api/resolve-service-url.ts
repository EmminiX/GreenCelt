// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { env } from "~/env";

export function resolveServiceURL(path: string) {
  let BASE_URL = env.NEXT_PUBLIC_API_URL ?? "http://localhost:8888/api/";
  
  // When running in browser, change backend:8888 to localhost:8888
  if (typeof window !== 'undefined' && BASE_URL.includes('backend:8888')) {
    BASE_URL = BASE_URL.replace('backend:8888', 'localhost:8888');
  }

  if (!BASE_URL.endsWith("/")) {
    BASE_URL += "/";
  }
  return new URL(path, BASE_URL).toString();
}
