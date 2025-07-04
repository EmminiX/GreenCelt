// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { motion } from "framer-motion";
import { FastForward, Play } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { RainbowText } from "~/components/deer-flow/rainbow-text";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { fastForwardReplay } from "~/core/api";
import { useReplayMetadata } from "~/core/api/hooks";
import type { Option } from "~/core/messages";
import { useReplay } from "~/core/replay";
import { sendMessage, useMessageIds, useStore } from "~/core/store";
import { env } from "~/env";
import { cn } from "~/lib/utils";

import { ConversationStarter } from "./conversation-starter";
import { InputBox } from "./input-box";
import { MessageListView } from "./message-list-view";
import { Welcome } from "./welcome";

export function MessagesBlock({ className }: { className?: string }) {
  const messageIds = useMessageIds();
  const messageCount = messageIds.length;
  const responding = useStore((state) => state.responding);
  const { isReplay } = useReplay();
  const { title: replayTitle, hasError: replayHasError } = useReplayMetadata();
  const [replayStarted, setReplayStarted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [feedback, setFeedback] = useState<{ option: Option } | null>(null);
  const handleSend = useCallback(
    async (message: string, options?: { interruptFeedback?: string }) => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      try {
        await sendMessage(
          message,
          {
            interruptFeedback:
              options?.interruptFeedback ?? feedback?.option.value,
          },
          {
            abortSignal: abortController.signal,
          },
        );
      } catch {}
    },
    [feedback],
  );
  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);
  const handleFeedback = useCallback(
    (feedback: { option: Option }) => {
      setFeedback(feedback);
    },
    [setFeedback],
  );
  const handleRemoveFeedback = useCallback(() => {
    setFeedback(null);
  }, [setFeedback]);
  const handleStartReplay = useCallback(() => {
    setReplayStarted(true);
    void sendMessage();
  }, [setReplayStarted]);
  const [fastForwarding, setFastForwarding] = useState(false);
  const handleFastForwardReplay = useCallback(() => {
    setFastForwarding(!fastForwarding);
    fastForwardReplay(!fastForwarding);
  }, [fastForwarding]);
  return (
    <div className={cn("flex h-full flex-col relative items-center", className)}>
      <MessageListView
        className="flex flex-grow overflow-y-auto pb-32 sm:pb-40 w-full max-w-[768px] mx-auto"
        onFeedback={handleFeedback}
        onSendMessage={handleSend}
      />
      {!isReplay ? (
        <div className="fixed bottom-0 left-0 right-0 flex h-auto sm:h-42 shrink-0 pb-2 sm:pb-4 px-2 sm:px-4 z-50 bg-background justify-center">
          <div className="w-full max-w-[768px] relative">
            {!responding && messageCount === 0 && (
              <ConversationStarter
                className="absolute top-[-280px] sm:top-[-320px] md:top-[-218px] left-0 w-full sm:w-auto mx-auto"
                onSend={handleSend}
              />
            )}
            <InputBox
              className="h-full w-full"
              responding={responding}
              feedback={feedback}
              onSend={handleSend}
              onCancel={handleCancel}
              onRemoveFeedback={handleRemoveFeedback}
            />
          </div>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "fixed bottom-[calc(50vh+80px)] left-0 transition-all duration-500 ease-out",
              replayStarted && "pointer-events-none scale-150 opacity-0",
            )}
          >
            <Welcome />
          </div>
          <motion.div
            className="mb-4 h-fit w-full max-w-[768px] mx-auto items-center justify-center"
            initial={{ opacity: 0, y: "20vh" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className={cn(
                "w-full transition-all duration-300",
                !replayStarted && "translate-y-[-40vh]",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <CardHeader>
                    <CardTitle>
                      <RainbowText animated={responding}>
                        {responding ? "Replaying" : `${replayTitle}`}
                      </RainbowText>
                    </CardTitle>
                    <CardDescription>
                      <RainbowText animated={responding}>
                        {responding
                          ? "DeerFlow is now replaying the conversation..."
                          : replayStarted
                            ? "The replay has been stopped."
                            : `You're now in DeerFlow's replay mode. Click the "Play" button on the right to start.`}
                      </RainbowText>
                    </CardDescription>
                  </CardHeader>
                </div>
                {!replayHasError && (
                  <div className="pr-4">
                    {responding && (
                      <Button
                        className={cn(fastForwarding && "animate-pulse")}
                        variant={fastForwarding ? "default" : "outline"}
                        onClick={handleFastForwardReplay}
                      >
                        <FastForward size={16} />
                        Fast Forward
                      </Button>
                    )}
                    {!replayStarted && (
                      <Button className="w-24" onClick={handleStartReplay}>
                        <Play size={16} />
                        Play
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
            {!replayStarted && env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && (
              <div className="text-muted-foreground w-full text-center text-xs">
                * This site is for demo purposes only. If you want to try your
                own question, please{" "}
                <a
                  className="underline"
                  href="https://github.com/EmminiX/GreenCelt/tree/main"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  click here
                </a>{" "}
                to clone it locally and run it.
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
