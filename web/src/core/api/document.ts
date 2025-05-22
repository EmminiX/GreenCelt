// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { resolveServiceURL } from "./resolve-service-url";

/**
 * Generate a PDF document from the provided content
 * @param content The markdown content to convert to PDF
 * @returns A URL to the generated PDF blob
 */
export async function generatePDF(content: string) {
  try {
    console.log("Starting PDF API request");
    
    // Create an AbortController with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error("PDF generation request timed out after 30 seconds");
    }, 30000);
    
    const response = await fetch(resolveServiceURL("document/generate-pdf"), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
      signal: controller.signal,
    });
    
    // Clear the timeout since we got a response
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Failed to get error details");
      console.error(`PDF generation HTTP error: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }
    
    console.log("PDF API response received, processing data");
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    const documentUrl = URL.createObjectURL(blob);
    
    console.log("PDF blob created successfully");
    return documentUrl;
  } catch (error) {
    console.error("PDF generation failed:", error);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("PDF generation timed out. Please try again.");
    }
    throw error;
  }
}

/**
 * Generate a Markdown document from the provided content
 * @param content The markdown content to prepare for download
 * @returns A URL to the generated markdown blob
 */
export async function generateMarkdown(content: string) {
  try {
    console.log("Starting Markdown API request");
    
    // Create an AbortController with a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error("Markdown generation request timed out after 30 seconds");
    }, 30000);
    
    const response = await fetch(resolveServiceURL("document/generate-md"), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
      signal: controller.signal,
    });
    
    // Clear the timeout since we got a response
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => "Failed to get error details");
      console.error(`Markdown generation HTTP error: ${response.status}`, errorText);
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
    }
    
    console.log("Markdown API response received, processing data");
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "text/markdown" });
    const documentUrl = URL.createObjectURL(blob);
    
    console.log("Markdown blob created successfully");
    return documentUrl;
  } catch (error) {
    console.error("Markdown generation failed:", error);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Markdown generation timed out. Please try again.");
    }
    throw error;
  }
}

/**
 * Helper function to trigger a file download from a blob URL
 * @param url The blob URL to download
 * @param filename The filename to use for the download
 */
export function downloadFromUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
