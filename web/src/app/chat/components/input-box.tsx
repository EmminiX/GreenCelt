// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Detective } from "~/components/deer-flow/icons/detective";
import { Tooltip } from "~/components/deer-flow/tooltip";
import { Button } from "~/components/ui/button";
import type { Option } from "~/core/messages";
import {
  setEnableBackgroundInvestigation,
  useSettingsStore,
} from "~/core/store";
import { cn } from "~/lib/utils";

export function InputBox({
  className,
  size,
  responding,
  feedback,
  onSend,
  onCancel,
  onRemoveFeedback,
}: {
  className?: string;
  size?: "large" | "normal";
  responding?: boolean;
  feedback?: { option: Option } | null;
  onSend?: (message: string, options?: { interruptFeedback?: string }) => void;
  onCancel?: () => void;
  onRemoveFeedback?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [imeStatus, setImeStatus] = useState<"active" | "inactive">("inactive");
  const [indent, setIndent] = useState(0);
  const backgroundInvestigation = useSettingsStore(
    (state) => state.general.enableBackgroundInvestigation,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback) {
      setMessage("");

      setTimeout(() => {
        if (feedbackRef.current) {
          setIndent(feedbackRef.current.offsetWidth);
        }
      }, 200);
    }
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, [feedback]);

  const handleSendMessage = useCallback(() => {
    if (responding) {
      onCancel?.();
    } else {
      if (message.trim() === "") {
        return;
      }
      if (onSend) {
        onSend(message, {
          interruptFeedback: feedback?.option.value,
        });
        setMessage("");
        onRemoveFeedback?.();
      }
    }
  }, [responding, onCancel, message, onSend, feedback, onRemoveFeedback]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (responding) {
        return;
      }
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.metaKey &&
        !event.ctrlKey &&
        imeStatus === "inactive"
      ) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [responding, imeStatus, handleSendMessage],
  );

  return (
    <div className={cn("bg-card relative rounded-[24px] border shadow-lg w-full", className)}>
      <div className="w-full">
        <AnimatePresence>
          {feedback && (
            <motion.div
              ref={feedbackRef}
              className="bg-background border-brand absolute top-0 left-0 mt-3 ml-2 flex items-center justify-center gap-1 rounded-2xl border px-2 py-0.5 max-w-[calc(100%-60px)] sm:max-w-none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="text-brand flex h-full w-full items-center justify-center text-sm opacity-90 truncate">
                {feedback.option.text}
              </div>
              <X
                className="cursor-pointer opacity-60 flex-shrink-0"
                size={16}
                onClick={onRemoveFeedback}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <textarea
          ref={textareaRef}
          className={cn(
            "m-0 w-full resize-none border-none px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg",
            size === "large" ? "min-h-32" : "min-h-4",
          )}
          style={{ textIndent: feedback ? `${indent}px` : 0 }}
          placeholder={
            feedback
              ? `Describe how you ${feedback.option.text.toLocaleLowerCase()}?`
              : "What can I do for you?"
          }
          value={message}
          onCompositionStart={() => setImeStatus("active")}
          onCompositionEnd={() => setImeStatus("inactive")}
          onKeyDown={handleKeyDown}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center px-2 sm:px-4 py-2 gap-2 sm:gap-0">
        <div className="flex grow w-full sm:w-auto">
          <Tooltip
            className="max-w-60"
            title={
              <div>
                <h3 className="mb-2 font-bold">
                  Investigation Mode: {backgroundInvestigation ? "On" : "Off"}
                </h3>
                <p>
                  When enabled, GreenCelt will perform a quick search before
                  planning. This is useful for researches related to ongoing
                  events and news.
                </p>
              </div>
            }
          >
            <Button
              className={cn(
                "rounded-2xl text-sm sm:text-base w-full sm:w-auto",
                backgroundInvestigation && "!border-brand !text-brand",
              )}
              variant="outline"
              size="lg"
              onClick={() =>
                setEnableBackgroundInvestigation(!backgroundInvestigation)
              }
            >
              <Detective /> <span className="ml-1">Investigation</span>
            </Button>
          </Tooltip>
        </div>
        <div className="flex shrink-0 items-center gap-2 w-full sm:w-auto justify-end">
          <Tooltip title={responding ? "Stop" : "Send"}>
            <Button
              variant="outline"
              size="icon"
              className={cn("h-10 w-10 rounded-full")}
              onClick={handleSendMessage}
            >
              {responding ? (
                <div className="flex h-10 w-10 items-center justify-center">
                  <div className="bg-foreground h-4 w-4 rounded-sm opacity-70" />
                </div>
              ) : (
                <ArrowUp />
              )}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
