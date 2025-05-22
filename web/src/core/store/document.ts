// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { nanoid } from "nanoid";
import { toast } from "sonner";

import { generatePDF, generateMarkdown, downloadFromUrl } from "../api/document";
import { parseJSON } from "../utils";

import { useStore } from "./store";

/**
 * Download a document as PDF from the research report content
 * @param researchId The ID of the research to download
 */
export async function downloadDocumentAsPDF(researchId: string) {
  // Check if we're currently in a chat response stream
  if (useStore.getState().responding) {
    console.warn("Cannot generate PDF while a chat response is in progress");
    toast("Please wait for the current response to complete before generating a PDF");
    return;
  }

  const planMessageId = useStore.getState().researchPlanIds.get(researchId);
  const reportMessageId = useStore.getState().researchReportIds.get(researchId);
  
  if (planMessageId && reportMessageId) {
    const planMessage = useStore.getState().messages.get(planMessageId)!;
    const title = parseJSON(planMessage.content, { title: "Untitled" }).title;
    const reportMessage = useStore.getState().messages.get(reportMessageId);
    
    if (reportMessage?.content) {
      console.log("Starting PDF generation for research:", researchId);
      
      // Add user message to the store
      const userMessageId = nanoid();
      useStore.getState().appendMessage({
        id: userMessageId,
        threadId: useStore.getState().threadId ?? nanoid(),
        role: "user" as const,
        content: "Please generate a PDF document for the above research.",
        contentChunks: [],
      });
      
      const documentMessageId = nanoid();
      const documentObject = { title, researchId, format: "pdf" };
      const documentMessage = {
        id: documentMessageId,
        threadId: useStore.getState().threadId ?? nanoid(),
        role: "assistant" as const,
        agent: "document" as const,
        content: JSON.stringify(documentObject),
        contentChunks: [],
        isStreaming: true,
      };
      
      useStore.getState().appendMessage(documentMessage);
      
      // Generating PDF...
      try {
        console.log("Making API request for PDF generation");
        const documentUrl = await generatePDF(reportMessage.content);
        console.log("PDF generated successfully, updating message");
        
        useStore.setState((state) => ({
          messages: new Map(useStore.getState().messages).set(documentMessageId, {
            ...state.messages.get(documentMessageId)!,
            content: JSON.stringify({ ...documentObject, documentUrl }),
            isStreaming: false,
          }),
        }));
        
        // Trigger download
        console.log("Initiating PDF download");
        downloadFromUrl(documentUrl, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      } catch (e) {
        console.error("PDF generation error:", e);
        useStore.setState((state) => ({
          messages: new Map(useStore.getState().messages).set(documentMessageId, {
            ...state.messages.get(documentMessageId)!,
            content: JSON.stringify({
              ...documentObject,
              error: e instanceof Error ? e.message : "Unknown error",
            }),
            isStreaming: false,
            error: e instanceof Error ? e.message : "Unknown error"
          }),
        }));
        
        toast("An error occurred while generating PDF. Please try again.");
      }
    }
  }
}

/**
 * Download a document as Markdown from the research report content
 * @param researchId The ID of the research to download
 */
export async function downloadDocumentAsMarkdown(researchId: string) {
  // Check if we're currently in a chat response stream
  if (useStore.getState().responding) {
    console.warn("Cannot generate Markdown while a chat response is in progress");
    toast("Please wait for the current response to complete before generating a Markdown document");
    return;
  }

  const planMessageId = useStore.getState().researchPlanIds.get(researchId);
  const reportMessageId = useStore.getState().researchReportIds.get(researchId);
  
  if (planMessageId && reportMessageId) {
    const planMessage = useStore.getState().messages.get(planMessageId)!;
    const title = parseJSON(planMessage.content, { title: "Untitled" }).title;
    const reportMessage = useStore.getState().messages.get(reportMessageId);
    
    if (reportMessage?.content) {
      console.log("Starting Markdown generation for research:", researchId);
      
      // Add user message to the store
      const userMessageId = nanoid();
      useStore.getState().appendMessage({
        id: userMessageId,
        threadId: useStore.getState().threadId ?? nanoid(),
        role: "user" as const,
        content: "Please generate a Markdown document for the above research.",
        contentChunks: [],
      });
      
      const documentMessageId = nanoid();
      const documentObject = { title, researchId, format: "markdown" };
      const documentMessage = {
        id: documentMessageId,
        threadId: useStore.getState().threadId ?? nanoid(),
        role: "assistant" as const,
        agent: "document" as const,
        content: JSON.stringify(documentObject),
        contentChunks: [],
        isStreaming: true,
      };
      
      useStore.getState().appendMessage(documentMessage);
      
      // Generating Markdown...
      try {
        console.log("Making API request for Markdown generation");
        const documentUrl = await generateMarkdown(reportMessage.content);
        console.log("Markdown generated successfully, updating message");
        
        useStore.setState((state) => ({
          messages: new Map(useStore.getState().messages).set(documentMessageId, {
            ...state.messages.get(documentMessageId)!,
            content: JSON.stringify({ ...documentObject, documentUrl }),
            isStreaming: false,
          }),
        }));
        
        // Trigger download
        console.log("Initiating Markdown download");
        downloadFromUrl(documentUrl, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`);
      } catch (e) {
        console.error("Markdown generation error:", e);
        useStore.setState((state) => ({
          messages: new Map(useStore.getState().messages).set(documentMessageId, {
            ...state.messages.get(documentMessageId)!,
            content: JSON.stringify({
              ...documentObject,
              error: e instanceof Error ? e.message : "Unknown error",
            }),
            isStreaming: false,
            error: e instanceof Error ? e.message : "Unknown error"
          }),
        }));
        
        toast("An error occurred while generating Markdown. Please try again.");
      }
    }
  }
}
