// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { LoadingAnimation } from "~/components/deer-flow/loading-animation";
import { Markdown } from "~/components/deer-flow/markdown";
import { RainbowText } from "~/components/deer-flow/rainbow-text";
import { RollingText } from "~/components/deer-flow/rolling-text";
import {
  ScrollContainer,
  type ScrollContainerRef,
} from "~/components/deer-flow/scroll-container";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Message, Option } from "~/core/messages";
import {
  closeResearch,
  openResearch,
  useLastFeedbackMessageId,
  useLastInterruptMessage,
  useMessage,
  useMessageIds,
  useResearchMessage,
  useStore,
} from "~/core/store";
import { parseJSON } from "~/core/utils";
import { cn } from "~/lib/utils";

export function MessageListView({
  className,
  onFeedback,
  onSendMessage,
}: {
  className?: string;
  onFeedback?: (feedback: { option: Option }) => void;
  onSendMessage?: (
    message: string,
    options?: { interruptFeedback?: string },
  ) => void;
}) {
  const scrollContainerRef = useRef<ScrollContainerRef>(null);
  const messageIds = useMessageIds();
  const interruptMessage = useLastInterruptMessage();
  const waitingForFeedbackMessageId = useLastFeedbackMessageId();
  const responding = useStore((state) => state.responding);
  const noOngoingResearch = useStore(
    (state) => state.ongoingResearchId === null,
  );
  const ongoingResearchIsOpen = useStore(
    (state) => state.ongoingResearchId === state.openResearchId,
  );

  const handleToggleResearch = useCallback(() => {
    // Fix the issue where auto-scrolling to the bottom
    // occasionally fails when toggling research.
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollToBottom();
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <ScrollContainer
      className={cn("flex h-full w-full flex-col overflow-hidden items-center", className)}
      scrollShadowColor="var(--app-background)"
      autoScrollToBottom
      ref={scrollContainerRef}
    >
      <ul className="flex flex-col w-full max-w-[700px] px-1 sm:px-0 pb-4 mx-auto">
        {messageIds.map((messageId) => (
          <MessageListItem
            key={messageId}
            messageId={messageId}
            waitForFeedback={waitingForFeedbackMessageId === messageId}
            interruptMessage={interruptMessage}
            onFeedback={onFeedback}
            onSendMessage={onSendMessage}
            onToggleResearch={handleToggleResearch}
          />
        ))}
        <div className="flex h-8 w-full shrink-0"></div>
      </ul>
      {responding && (noOngoingResearch || !ongoingResearchIsOpen) && (
        <LoadingAnimation className="ml-2 sm:ml-4 mb-4" />
      )}
    </ScrollContainer>
  );
}

function MessageListItem({
  className,
  messageId,
  waitForFeedback,
  interruptMessage,
  onFeedback,
  onSendMessage,
  onToggleResearch,
}: {
  className?: string;
  messageId: string;
  waitForFeedback?: boolean;
  onFeedback?: (feedback: { option: Option }) => void;
  interruptMessage?: Message | null;
  onSendMessage?: (
    message: string,
    options?: { interruptFeedback?: string },
  ) => void;
  onToggleResearch?: () => void;
}) {
  const message = useMessage(messageId);
  const researchIds = useStore((state) => state.researchIds);
  const startOfResearch = useMemo(() => {
    return researchIds.includes(messageId);
  }, [researchIds, messageId]);
  if (message) {
    if (
      message.role === "user" ||
      message.agent === "coordinator" ||
      message.agent === "planner" ||
      startOfResearch
    ) {
      let content: React.ReactNode;
      if (message.agent === "planner") {
        content = (
          <div className="w-full px-4 flex justify-center">
            <div className="w-full max-w-[700px]">
              <PlanCard
                message={message}
                waitForFeedback={waitForFeedback}
                interruptMessage={interruptMessage}
                onFeedback={onFeedback}
                onSendMessage={onSendMessage}
              />
            </div>
          </div>
        );
      } else if (startOfResearch) {
        content = (
          <div className="w-full px-4 flex justify-center">
            <div className="w-full max-w-[700px]">
              <ResearchCard
                researchId={message.id}
                onToggleResearch={onToggleResearch}
              />
            </div>
          </div>
        );
      } else {
        content = message.content ? (
          <div
            className={cn(
              "flex w-full px-2 sm:px-4 justify-center",
              className,
            )}
          >
            <div className={cn(
              "flex w-full max-w-[700px]",
              message.role === "user" ? "justify-end" : "justify-start",
            )}>
              <MessageBubble message={message}>
                <div className="flex w-full flex-col max-w-full overflow-hidden">
                  <Markdown>{message?.content}</Markdown>
                </div>
              </MessageBubble>
            </div>
          </div>
        ) : null;
      }
      if (content) {
        return (
          <motion.li
            className="mt-10"
            key={messageId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ transition: "all 0.2s ease-out" }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          >
            {content}
          </motion.li>
        );
      }
    }
    return null;
  }
}

function MessageBubble({
  className,
  message,
  children,
}: {
  className?: string;
  message: Message;
  children: React.ReactNode;
}) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "flex max-w-[90%] sm:max-w-[80%] flex-col rounded-2xl px-3 sm:px-4 py-2 sm:py-3",
        isUser
          ? "bg-brand text-brand-foreground"
          : "bg-card text-card-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

function ResearchCard({
  className,
  researchId,
  onToggleResearch,
}: {
  className?: string;
  researchId: string;
  onToggleResearch?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reportId = useStore((state) => state.researchReportIds.get(researchId));
  const hasReport = reportId !== undefined;
  const reportGenerating = useStore(
    (state) => hasReport && state.messages.get(reportId)!.isStreaming,
  );
  const openResearchId = useStore((state) => state.openResearchId);
  const state = useMemo(() => {
    if (hasReport) {
      return reportGenerating ? "Generating report..." : "Report generated";
    }
    return "Researching...";
  }, [hasReport, reportGenerating]);
  const msg = useResearchMessage(researchId);
  const title = useMemo(() => {
    if (msg) {
      return parseJSON(msg.content ?? "", { title: "" }).title;
    }
    return undefined;
  }, [msg]);
  
  // Scroll the card into view when it appears
  useEffect(() => {
    if (cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, []);
  
  const handleOpen = useCallback(() => {
    if (openResearchId === researchId) {
      closeResearch();
    } else {
      openResearch(researchId);
    }
    onToggleResearch?.();
  }, [openResearchId, researchId, onToggleResearch]);
  return (
    <Card ref={cardRef} className={cn("w-full", className)}>
      <CardHeader className="px-3 sm:px-6 py-2 sm:py-4">
        <CardTitle className="text-base sm:text-lg">
          <RainbowText animated={state !== "Report generated"}>
            {title !== undefined && title !== "" ? title : "Deep Research"}
          </RainbowText>
        </CardTitle>
      </CardHeader>
      <CardFooter className="px-3 sm:px-6 py-2 sm:py-4">
        <div className="flex w-full items-center flex-wrap sm:flex-nowrap gap-2">
          <RollingText className="text-muted-foreground flex-grow text-xs sm:text-sm">
            {state}
          </RollingText>
          <Button
            variant={!openResearchId ? "default" : "outline"}
            onClick={handleOpen}
            className="text-sm sm:text-base"
            size="sm"
          >
            {researchId !== openResearchId ? "Open" : "Close"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

const GREETINGS = ["Cool", "Sounds great", "Looks good", "Great", "Awesome"];
function PlanCard({
  className,
  message,
  interruptMessage,
  onFeedback,
  waitForFeedback,
  onSendMessage,
}: {
  className?: string;
  message: Message;
  interruptMessage?: Message | null;
  onFeedback?: (feedback: { option: Option }) => void;
  onSendMessage?: (
    message: string,
    options?: { interruptFeedback?: string },
  ) => void;
  waitForFeedback?: boolean;
}) {
  const plan = useMemo<{
    title?: string;
    thought?: string;
    steps?: { title?: string; description?: string }[];
  }>(() => {
    return parseJSON(message.content ?? "", {});
  }, [message.content]);
  const handleAccept = useCallback(async () => {
    if (onSendMessage) {
      onSendMessage(
        `${GREETINGS[Math.floor(Math.random() * GREETINGS.length)]}! ${Math.random() > 0.5 ? "Let's get started." : "Let's start."}`,
        {
          interruptFeedback: "accepted",
        },
      );
    }
  }, [onSendMessage]);
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>
          <Markdown animated>
            {`### ${
              plan.title !== undefined && plan.title !== ""
                ? plan.title
                : "Deep Research"
            }`}
          </Markdown>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Markdown className="opacity-80" animated>
          {plan.thought}
        </Markdown>
        {plan.steps && (
          <ul className="my-2 flex list-decimal flex-col gap-3 sm:gap-4 border-l-[2px] pl-4 sm:pl-8">
            {plan.steps.map((step, i) => (
              <li key={`step-${i}`}>
                <h3 className="mb text-base sm:text-lg font-medium">
                  <Markdown animated>{step.title}</Markdown>
                </h3>
                <div className="text-muted-foreground text-xs sm:text-sm">
                  <Markdown animated>{step.description}</Markdown>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {!message.isStreaming && interruptMessage?.options?.length && (
          <motion.div
            className="flex flex-wrap gap-2 w-full sm:w-auto justify-end"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {interruptMessage?.options.map((option) => (
              <Button
                key={option.value}
                variant={option.value === "accepted" ? "default" : "outline"}
                disabled={!waitForFeedback}
                className="text-sm sm:text-base"
                onClick={() => {
                  if (option.value === "accepted") {
                    void handleAccept();
                  } else {
                    onFeedback?.({
                      option,
                    });
                  }
                }}
              >
                {option.text}
              </Button>
            ))}
          </motion.div>
        )}
      </CardFooter>
    </Card>
  );
}
