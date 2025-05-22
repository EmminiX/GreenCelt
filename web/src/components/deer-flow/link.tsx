import { useMemo } from "react";
import { useStore, useToolCalls } from "~/core/store";
import { Tooltip } from "./tooltip";
import { WarningFilled } from "@ant-design/icons";

// Validates and sanitizes URLs
function sanitizeUrl(url: string | undefined): string | null {
  if (!url || url.trim() === "") return null;
  
  // Handle special cases that cause browser errors
  if (url === "https://") return null;
  
  try {
    // Try to parse as a proper URL
    new URL(url);
    return url;
  } catch (e) {
    // Check if it might be a relative URL or a URL without protocol
    if (url.startsWith("/")) {
      // It's a relative URL, leave it as is
      return url;
    } else if (!url.includes("://") && !url.startsWith(":")) {
      // Likely a domain without protocol, add https://
      try {
        new URL(`https://${url}`);
        return `https://${url}`;
      } catch {
        return null;
      }
    }
    // URL is invalid
    return null;
  }
}

export const Link = ({
  href,
  children,
  checkLinkCredibility = false,
}: {
  href: string | undefined;
  children: React.ReactNode;
  checkLinkCredibility: boolean;
}) => {
  const toolCalls = useToolCalls();
  const responding = useStore((state) => state.responding);

  const credibleLinks = useMemo(() => {
    const links = new Set<string>();
    if (!checkLinkCredibility) return links;

    (toolCalls || []).forEach((call) => {
      if (call && call.name === "web_search" && call.result) {
        const result = JSON.parse(call.result) as Array<{ url: string }>;
        result.forEach((r) => {
          links.add(r.url);
        });
      }
    });
    return links;
  }, [toolCalls]);

  // Sanitize URL before rendering
  const sanitizedHref = useMemo(() => {
    return sanitizeUrl(href);
  }, [href]);

  const isCredible = useMemo(() => {
    return checkLinkCredibility && sanitizedHref && !responding
      ? credibleLinks.has(sanitizedHref)
      : true;
  }, [credibleLinks, sanitizedHref, responding, checkLinkCredibility]);

  // Don't render as a link if URL is invalid
  if (!sanitizedHref) {
    return <span>{children}</span>;
  }

  return (
    <span className="flex items-center gap-1.5">
      <a href={sanitizedHref} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
      {!isCredible && (
        <Tooltip
          title="This link might be a hallucination from AI model and may not be reliable."
          delayDuration={300}
        >
          <WarningFilled className="text-sx transition-colors hover:!text-yellow-500" />
        </Tooltip>
      )}
    </span>
  );
};
