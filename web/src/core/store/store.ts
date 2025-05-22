// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { nanoid } from "nanoid";
import { toast } from "sonner";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { chatStream } from "../api";
import type { Message } from "../messages";
import { mergeMessage } from "../messages";

import { getChatStreamSettings } from "./settings-store";

const THREAD_ID = nanoid();

export const useStore = create<{
  responding: boolean;
  threadId: string | undefined;
  messageIds: string[];
  messages: Map<string, Message>;
  researchIds: string[];
  researchPlanIds: Map<string, string>;
  researchReportIds: Map<string, string>;
  researchActivityIds: Map<string, string[]>;
  ongoingResearchId: string | null;
  openResearchId: string | null;

  appendMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  updateMessages: (messages: Message[]) => void;
  openResearch: (researchId: string | null) => void;
  closeResearch: () => void;
  setOngoingResearch: (researchId: string | null) => void;
}>((set) => ({
  responding: false,
  threadId: THREAD_ID,
  messageIds: [],
  messages: new Map<string, Message>(),
  researchIds: [],
  researchPlanIds: new Map<string, string>(),
  researchReportIds: new Map<string, string>(),
  researchActivityIds: new Map<string, string[]>(),
  ongoingResearchId: null,
  openResearchId: null,

  appendMessage(message: Message) {
    set((state) => ({
      messageIds: [...state.messageIds, message.id],
      messages: new Map(state.messages).set(message.id, message),
    }));
  },
  updateMessage(message: Message) {
    set((state) => ({
      messages: new Map(state.messages).set(message.id, message),
    }));
  },
  updateMessages(messages: Message[]) {
    set((state) => {
      const newMessages = new Map(state.messages);
      messages.forEach((m) => newMessages.set(m.id, m));
      return { messages: newMessages };
    });
  },
  openResearch(researchId: string | null) {
    set({ openResearchId: researchId });
  },
  closeResearch() {
    set({ openResearchId: null });
  },
  setOngoingResearch(researchId: string | null) {
    set({ ongoingResearchId: researchId });
  },
}));

export async function sendMessage(
  content?: string,
  {
    interruptFeedback,
  }: {
    interruptFeedback?: string;
  } = {},
  options: { abortSignal?: AbortSignal } = {},
) {
  if (content != null) {
    appendMessage({
      id: nanoid(),
      threadId: THREAD_ID,
      role: "user",
      content: content,
      contentChunks: [content],
    });
  }

  const settings = getChatStreamSettings();
  let stream;
  let connectionAttempts = 0;
  const MAX_CONNECTION_ATTEMPTS = 3;
  
  setResponding(true);
  let messageId: string | undefined;
  
  try {
    while (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      try {
        stream = chatStream(
          content ?? "[REPLAY]",
          {
            thread_id: THREAD_ID,
            interrupt_feedback: interruptFeedback,
            auto_accepted_plan: settings.autoAcceptedPlan,
            enable_background_investigation:
              settings.enableBackgroundInvestigation ?? true,
            max_plan_iterations: settings.maxPlanIterations,
            max_step_num: settings.maxStepNum,
            max_search_results: settings.maxSearchResults,
            mcp_settings: settings.mcpSettings,
          },
          options,
        );
        
        for await (const event of stream) {
          const { type, data } = event;
          messageId = data.id;
          let message: Message | undefined;
          if (type === "tool_call_result") {
            message = findMessageByToolCallId(data.tool_call_id);
          } else if (!existsMessage(messageId)) {
            message = {
              id: messageId,
              threadId: data.thread_id,
              agent: data.agent,
              role: data.role,
              content: "",
              contentChunks: [],
              isStreaming: true,
              interruptFeedback,
            };
            appendMessage(message);
          }
          message ??= getMessage(messageId);
          if (message) {
            message = mergeMessage(message, event);
            updateMessage(message);
          }
        }
        
        // If we get here, the stream completed successfully
        break;
      } catch (error) {
        connectionAttempts++;
        
        // If it's our last attempt or not a network error, propagate the error
        if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS || 
            !(error instanceof TypeError && error.message.includes("network"))) {
          throw error;
        }
        
        // Otherwise, wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Retrying connection attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS}...`);
      }
    }
  } catch (error) {
    console.error("Chat stream error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Log additional details for debugging
    console.error("Chat stream error details:", {
      errorType: error instanceof Error ? error.name : typeof error,
      messageId,
      threadId: THREAD_ID,
      errorStack: error instanceof Error ? error.stack : "No stack trace"
    });
    
    // Create a user-friendly error message based on the error type
    let userErrorMessage;
    if (error instanceof TypeError && errorMessage.includes("network")) {
      userErrorMessage = "Network connection error. Please check your internet connection and try again.";
    } else if (errorMessage.includes("abort")) {
      userErrorMessage = "Request was cancelled.";
    } else if (errorMessage.includes("timeout")) {
      userErrorMessage = "Request timed out. Please try again later.";
    } else {
      userErrorMessage = `Error: ${errorMessage}. Please try again.`;
    }
    
    toast(userErrorMessage, {
      duration: 5000,
      action: {
        label: "Retry",
        onClick: () => {
          void sendMessage(content, { interruptFeedback }, options);
        },
      },
    });
    
    // Update message status
    if (messageId != null) {
      const message = getMessage(messageId);
      if (message?.isStreaming) {
        message.isStreaming = false;
        // Mark the message with the error information
        message.error = userErrorMessage;
        useStore.getState().updateMessage(message);
      }
    }
    useStore.getState().setOngoingResearch(null);
  } finally {
    setResponding(false);
  }
}

function setResponding(value: boolean) {
  useStore.setState({ responding: value });
}

function existsMessage(id: string) {
  return useStore.getState().messageIds.includes(id);
}

function getMessage(id: string) {
  return useStore.getState().messages.get(id);
}

function findMessageByToolCallId(toolCallId: string) {
  return Array.from(useStore.getState().messages.values())
    .reverse()
    .find((message) => {
      if (message.toolCalls) {
        return message.toolCalls.some((toolCall) => toolCall.id === toolCallId);
      }
      return false;
    });
}

function appendMessage(message: Message) {
  if (
    message.agent === "coder" ||
    message.agent === "reporter" ||
    message.agent === "researcher"
  ) {
    if (!getOngoingResearchId()) {
      const id = message.id;
      appendResearch(id);
      openResearch(id);
    }
    appendResearchActivity(message);
  }
  useStore.getState().appendMessage(message);
}

function updateMessage(message: Message) {
  if (
    getOngoingResearchId() &&
    message.agent === "reporter" &&
    !message.isStreaming
  ) {
    useStore.getState().setOngoingResearch(null);
  }
  useStore.getState().updateMessage(message);
}

function getOngoingResearchId() {
  return useStore.getState().ongoingResearchId;
}

function appendResearch(researchId: string) {
  let planMessage: Message | undefined;
  const reversedMessageIds = [...useStore.getState().messageIds].reverse();
  for (const messageId of reversedMessageIds) {
    const message = getMessage(messageId);
    if (message?.agent === "planner") {
      planMessage = message;
      break;
    }
  }
  const messageIds = [researchId];
  messageIds.unshift(planMessage!.id);
  useStore.setState({
    ongoingResearchId: researchId,
    researchIds: [...useStore.getState().researchIds, researchId],
    researchPlanIds: new Map(useStore.getState().researchPlanIds).set(
      researchId,
      planMessage!.id,
    ),
    researchActivityIds: new Map(useStore.getState().researchActivityIds).set(
      researchId,
      messageIds,
    ),
  });
}

function appendResearchActivity(message: Message) {
  const researchId = getOngoingResearchId();
  if (researchId) {
    const researchActivityIds = useStore.getState().researchActivityIds;
    const current = researchActivityIds.get(researchId)!;
    if (!current.includes(message.id)) {
      useStore.setState({
        researchActivityIds: new Map(researchActivityIds).set(researchId, [
          ...current,
          message.id,
        ]),
      });
    }
    if (message.agent === "reporter") {
      useStore.setState({
        researchReportIds: new Map(useStore.getState().researchReportIds).set(
          researchId,
          message.id,
        ),
      });
    }
  }
}

export function openResearch(researchId: string | null) {
  useStore.getState().openResearch(researchId);
}

export function closeResearch() {
  useStore.getState().closeResearch();
}

export function useResearchMessage(researchId: string) {
  return useStore(
    useShallow((state) => {
      const messageId = state.researchPlanIds.get(researchId);
      return messageId ? state.messages.get(messageId) : undefined;
    }),
  );
}

export function useMessage(messageId: string | null | undefined) {
  return useStore(
    useShallow((state) =>
      messageId ? state.messages.get(messageId) : undefined,
    ),
  );
}

export function useMessageIds() {
  return useStore(useShallow((state) => state.messageIds));
}

export function useLastInterruptMessage() {
  return useStore(
    useShallow((state) => {
      if (state.messageIds.length >= 2) {
        const lastMessage = state.messages.get(
          state.messageIds[state.messageIds.length - 1]!,
        );
        return lastMessage?.finishReason === "interrupt" ? lastMessage : null;
      }
      return null;
    }),
  );
}

export function useLastFeedbackMessageId() {
  const waitingForFeedbackMessageId = useStore(
    useShallow((state) => {
      if (state.messageIds.length >= 2) {
        const lastMessage = state.messages.get(
          state.messageIds[state.messageIds.length - 1]!,
        );
        if (lastMessage && lastMessage.finishReason === "interrupt") {
          return state.messageIds[state.messageIds.length - 2];
        }
      }
      return null;
    }),
  );
  return waitingForFeedbackMessageId;
}

export function useToolCalls() {
  return useStore(
    useShallow((state) => {
      return state.messageIds
        ?.map((id) => getMessage(id)?.toolCalls)
        .filter((toolCalls) => toolCalls != null)
        .flat();
    }),
  );
}
