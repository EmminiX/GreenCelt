"use client";

import { StarFilledIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NumberTicker } from "~/components/magicui/number-ticker";
import { Button } from "~/components/ui/button";
import { env } from "~/env";

export function SiteHeaderClient() {
  const [scrollClass, setScrollClass] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling down and past initial threshold
        setScrollClass("scroll-down");
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setScrollClass("scroll-up");
      } else if (currentScrollY <= 10) {
        // At the very top
        setScrollClass("");
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed-header ${scrollClass}`}>
      <div className="container flex h-15 items-center justify-between px-3">
        <div className="text-xl font-medium">
          <span className="mr-1 text-2xl">☘️</span>
          <span>GreenCeltAI</span>
        </div>
        <div className="relative flex items-center">
          <div
            className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-full opacity-60 blur-2xl"
            style={{
              background: "linear-gradient(90deg, #ff80b5 0%, #9089fc 100%)",
              filter: "blur(32px)",
            }}
          />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="group relative z-10"
          >
            <Link href="https://github.com/EmminiX/GreenCelt/tree/main" target="_blank">
              <GitHubLogoIcon className="size-4" />
              Star on GitHub
              {env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY &&
                env.GITHUB_OAUTH_TOKEN && <StarCounter />}
            </Link>
          </Button>
        </div>
      </div>
      <hr className="from-border/0 via-border/70 to-border/0 m-0 h-px w-full border-none bg-gradient-to-r" />
    </header>
  );
}

function StarCounter() {
  const [stars, setStars] = useState(1000);
  
  useEffect(() => {
    async function fetchStars() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/EmminiX/GreenCelt",
          {
            headers: env.GITHUB_OAUTH_TOKEN
              ? {
                  Authorization: `Bearer ${env.GITHUB_OAUTH_TOKEN}`,
                  "Content-Type": "application/json",
                }
              : {},
            cache: "force-cache",
          },
        );

        if (response.ok) {
          const data = await response.json();
          setStars(data.stargazers_count ?? 1000);
        }
      } catch (error) {
        console.error("Error fetching GitHub stars:", error);
      }
    }
    
    void fetchStars();
  }, []);
  
  return (
    <>
      <StarFilledIcon className="size-4 transition-colors duration-300 group-hover:text-yellow-500" />
      <NumberTicker className="font-mono tabular-nums" value={stars} />
    </>
  );
} 