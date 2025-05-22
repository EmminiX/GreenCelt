// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import { memo, useCallback, useEffect, useState } from "react";

import { cn } from "~/lib/utils";

import { Tooltip } from "./tooltip";

// Validates if a URL is properly formatted
function isValidURL(url: string | Blob): boolean {
  // Handle Blob URLs directly
  if (url instanceof Blob) {
    return true; // Blobs are valid for image sources
  }
  
  // Handle string URLs
  if (typeof url !== 'string') return false;
  if (!url || url.trim() === "" || url === "https://") return false;
  
  try {
    // Create URL object to check if URL is valid
    new URL(url);
    return true;
  } catch (e) {
    // If URL creation fails, it's not a valid URL
    return false;
  }
}

function Image({
  className,
  imageClassName,
  imageTransition,
  src,
  alt,
  fallback = null,
}: {
  className?: string;
  imageClassName?: string;
  imageTransition?: boolean;
  src: string | Blob;
  alt: string;
  fallback?: React.ReactNode;
}) {
  const [, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Reset states and validate URL
    if (!isValidURL(src)) {
      setIsError(true);
      setIsLoading(false);
    } else {
      setIsError(false);
      setIsLoading(true);
    }
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsError(false);
    setIsLoading(false);
  }, []);
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      e.currentTarget.style.display = "none";
      // Suppress console warnings to clean up console
      // console.warn(`Markdown: Image "${e.currentTarget.src}" failed to load`);
      setIsError(true);
    },
    [],
  );
  return (
    <span className={cn("block w-fit overflow-hidden", className)}>
      {isError || !src || !isValidURL(src) ? (
        fallback || <span className="text-xs text-gray-400">[Image unavailable]</span>
      ) : (
        <Tooltip title={alt ?? "No caption"}>
          <img
            className={cn(
              "size-full object-cover",
              imageTransition && "transition-all duration-200 ease-out",
              imageClassName,
            )}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
          />
        </Tooltip>
      )}
    </span>
  );
}

export default memo(Image);
