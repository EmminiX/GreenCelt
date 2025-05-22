// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { type StreamEvent } from "./StreamEvent";

const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 1000;

export async function* fetchStream(
  url: string,
  init: RequestInit,
): AsyncIterable<StreamEvent> {
  // Use a custom timeout that's longer than the default
  const timeoutMs = 30000; // 30 seconds
  
  let reconnectAttempt = 0;
  
  while (reconnectAttempt <= MAX_RECONNECT_ATTEMPTS) {
    // Create a new abort controller for this attempt
    const controller = new AbortController();
    
    // Set a timeout for this attempt
    const timeoutId = setTimeout(() => {
      controller.abort('Timeout exceeded');
    }, timeoutMs);
    
    // Combine with the user's abort signal if provided
    if (init.signal) {
      init.signal.addEventListener('abort', () => controller.abort());
    }
    
    try {
      console.log(`Attempt ${reconnectAttempt + 1}/${MAX_RECONNECT_ATTEMPTS + 1}: Starting SSE connection to:`, url);
      
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Accept": "text/event-stream",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no" // Prevent NGINX buffering
        },
        credentials: "same-origin", // Include cookies if same origin
        keepalive: true,            // Keep connection alive
        signal: controller.signal,  // Use our controller
        ...init,
      };
      
      // Add a cache-busting parameter to the URL
      const urlWithCacheBust = new URL(url, window.location.origin);
      urlWithCacheBust.searchParams.append('_', Date.now().toString());
      
      const response = await fetch(urlWithCacheBust.toString(), fetchOptions);
      
      // Check for HTTP errors
      if (!response.ok) {
        const errorMessage = `HTTP error: ${response.status} ${response.statusText}`;
        console.error(errorMessage);
        
        if (isRetryableStatusCode(response.status) && reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempt++;
          console.log(`Will retry in ${RECONNECT_DELAY_MS}ms...`);
          await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY_MS));
          continue;
        }
        
        throw new Error(errorMessage);
      }
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      console.log("SSE connection established successfully");
      
      // Make sure we have a readable body
      if (!response.body) {
        throw new Error("Response body is not readable");
      }
      
      // Reset reconnect attempt counter on successful connection
      reconnectAttempt = 0;
      
      // Create reader for the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let eventCount = 0;
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            // Handle any remaining data in the buffer
            if (buffer.trim().length > 0) {
              const event = parseSSEMessage(buffer);
              if (event) {
                eventCount++;
                yield event;
              }
            }
            console.log(`Stream completed normally after ${eventCount} events`);
            return;
          }
          
          // Decode and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Find and process all complete events (separated by double newlines)
          const events = extractSSEEvents(buffer);
          buffer = events.remainder;
          
          // Yield each parsed event
          for (const event of events.messages) {
            const parsed = parseSSEMessage(event);
            if (parsed) {
              eventCount++;
              yield parsed;
            }
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`SSE stream error after ${eventCount} events:`, errorMessage);
        
        // Add debugging info
        console.error("Error details:", {
          url: urlWithCacheBust.toString(),
          errorType: error instanceof Error ? error.name : typeof error,
          errorStack: error instanceof Error ? error.stack : "No stack trace",
          bufferSize: buffer.length,
          lastBufferPart: buffer.length > 0 ? buffer.slice(-Math.min(buffer.length, 100)) : "",
        });
        
        // Try to process any remaining data in the buffer
        if (buffer.trim().length > 0) {
          try {
            const event = parseSSEMessage(buffer);
            if (event) {
              eventCount++;
              yield event;
            }
          } catch (e) {
            console.warn("Failed to parse remaining buffer:", e);
          }
        }
        
        // Check if we should retry
        const isNetworkError = isRetryableError(error);
        if (isNetworkError && reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempt++;
          const backoffMs = RECONNECT_DELAY_MS * Math.pow(1.5, reconnectAttempt - 1);
          console.log(`Network error detected. Reconnection attempt ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS} in ${backoffMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        
        throw error;
      } finally {
        // Always release the reader lock and clear the timeout
        reader.releaseLock();
        clearTimeout(timeoutId);
        console.log(`SSE connection resources released after ${eventCount} events`);
      }
    } catch (error) {
      // Clear the timeout to avoid memory leaks
      clearTimeout(timeoutId);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Connection error:`, errorMessage);
      
      const isNetworkError = isRetryableError(error);
      if (isNetworkError && reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempt++;
        const backoffMs = RECONNECT_DELAY_MS * Math.pow(1.5, reconnectAttempt - 1);
        console.log(`Network error during connection. Reconnection attempt ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS} in ${backoffMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }
      
      throw error;
    }
  }
  
  throw new Error(`Failed to establish SSE connection after ${MAX_RECONNECT_ATTEMPTS} attempts`);
}

/**
 * Extract SSE events from a buffer string
 */
function extractSSEEvents(buffer: string): { messages: string[], remainder: string } {
  const delimiter = "\n\n";
  const parts = buffer.split(delimiter);
  
  // The last part might be incomplete, so keep it in the buffer
  const remainder = parts.pop() ?? "";
  
  // Return all complete messages and the remainder
  return {
    messages: parts.filter(part => part.trim().length > 0),
    remainder,
  };
}

/**
 * Parse an SSE message into a StreamEvent
 */
function parseSSEMessage(message: string): StreamEvent | undefined {
  // Default event type is 'message'
  let eventType = "message";
  let data: string | null = null;
  
  // Split into lines and process each one
  const lines = message.split("\n");
  
  for (const line of lines) {
    if (!line) continue; // Skip empty lines
    
    // Check for multi-line data (lines starting with space or tab)
    if ((line.startsWith(" ") || line.startsWith("\t")) && data !== null) {
      // This is a continuation of the previous data line
      data += "\n" + line.substring(1);
      continue;
    }
    
    // Parse field: value format
    const colonIndex = line.indexOf(": ");
    if (colonIndex === -1) continue;
    
    const field = line.slice(0, colonIndex);
    const value = line.slice(colonIndex + 2);
    
    if (field === "event") {
      eventType = value;
    } else if (field === "data") {
      // Initialize data or append with newline for multiple data fields
      if (data === null) {
        data = value;
      } else {
        data += "\n" + value;
      }
    }
  }
  
  // Only return event if we have data (except for special events)
  if (data === null && eventType === "message") {
    return undefined;
  }
  
  return {
    event: eventType,
    data: data ?? "",
  } as StreamEvent;
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return true;
  
  // Abort errors are not retryable
  if (error.name === "AbortError") return false;
  
  const message = error.message.toLowerCase();
  
  // Check for network-related errors
  return (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("failed") ||
    message.includes("chunked") ||
    message.includes("abort") ||
    message.includes("timeout") ||
    message.includes("connection") ||
    error instanceof TypeError
  );
}

/**
 * Check if HTTP status code is retryable
 */
function isRetryableStatusCode(statusCode: number): boolean {
  // Retry server errors and specific client errors
  return (
    statusCode >= 500 || // Server errors
    statusCode === 408 || // Request Timeout
    statusCode === 429 || // Too Many Requests
    statusCode === 425    // Too Early
  );
}
