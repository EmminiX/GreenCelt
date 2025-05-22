// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

'use client';

import { useEffect } from 'react';

import { initializeErrorLogging } from '~/core/error-logging';

/**
 * Client component that initializes the error logging system
 * This is separated from the layout to avoid SSR issues with window-specific APIs
 */
export function ErrorLoggerInitializer() {
  useEffect(() => {
    // Initialize error logging on client-side only
    initializeErrorLogging();
    console.log('Error logging system initialized');
  }, []);

  // This component doesn't render anything
  return null;
}
