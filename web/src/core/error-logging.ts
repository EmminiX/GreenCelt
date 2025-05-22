// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

/**
 * Initialize global error handling to catch and log unhandled errors and promise rejections
 */
export function initializeErrorLogging(): void {
  if (typeof window === 'undefined') {
    return; // Skip for server-side rendering
  }

  // Save the original console.error to use for our enhanced logging
  const originalConsoleError = console.error;

  // Enhanced console.error that includes timestamps and additional context
  console.error = (...args) => {
    const timestamp = new Date().toISOString();
    const errorDetails = {
      timestamp,
      location: window.location.href,
      args
    };
    
    // Log with original method but include our timestamp prefix
    originalConsoleError(`[${timestamp}] ERROR:`, ...args);
    
    // Optionally log to application storage or monitoring service
    try {
      const storedErrors = JSON.parse(localStorage.getItem('app_errors') ?? '[]');
      storedErrors.push(errorDetails);
      // Keep only the last 50 errors to avoid using too much localStorage
      if (storedErrors.length > 50) {
        storedErrors.shift();
      }
      localStorage.setItem('app_errors', JSON.stringify(storedErrors));
    } catch {
      // Silently fail if localStorage isn't available
    }
  };

  // Global error handler for uncaught exceptions
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  // Global handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });

  // Add specific handler for network related errors which are relevant to our SSE connections
  window.addEventListener('offline', () => {
    console.error('Network connection lost. This may affect streaming connections.');
  });

  // Log when connection is restored
  window.addEventListener('online', () => {
    console.log('Network connection restored.');
  });
}

/**
 * Get all stored error logs
 * @returns Array of error log entries
 */
export function getErrorLogs(): unknown[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    return JSON.parse(localStorage.getItem('app_errors') ?? '[]');
  } catch (e) {
    console.error('Failed to retrieve error logs:', e);
    return [];
  }
}

/**
 * Clear all stored error logs
 */
export function clearErrorLogs(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem('app_errors');
  } catch (e) {
    console.error('Failed to clear error logs:', e);
  }
}
