// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";

import { ThemeProviderWrapper } from "~/components/deer-flow/theme-provider-wrapper";
import { ErrorLoggerInitializer } from "~/components/error-logger-initializer";
import { env } from "~/env";

import { Toaster } from "../components/deer-flow/toaster";

export const metadata: Metadata = {
  title: "☘️ GreenCeltAI",
  description:
    "Deep Exploration and Efficient Research, an AI tool that combines language models with specialized tools for research tasks.",
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    { rel: "apple-touch-icon", url: "/favicon.ico" },
  ],
  // This helps prevent browser from requesting favicons from external domains
  other: {
    "msapplication-TileImage": "/favicon.ico",
    "msapplication-config": "none"
  }
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <head>
        {/* Define isSpace function globally to fix markdown-it issues with Next.js + Turbopack
          https://github.com/markdown-it/markdown-it/issues/1082#issuecomment-2749656365 */}
        <Script id="markdown-it-fix" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined' && typeof window.isSpace === 'undefined') {
              window.isSpace = function(code) {
                return code === 0x20 || code === 0x09 || code === 0x0A || code === 0x0B || code === 0x0C || code === 0x0D;
              };
            }
          `}
        </Script>
        {/* This script prevents browsers from requesting favicons from external domains */}
        <Script id="favicon-handler" strategy="beforeInteractive">
          {`
            (function() {
              // Override the default favicon request behavior
              var originalCreateElement = document.createElement;
              document.createElement = function(tagName) {
                var element = originalCreateElement.call(document, tagName);
                if (tagName.toLowerCase() === 'link' && element.rel && element.rel.toLowerCase() === 'icon') {
                  // Add a hook to prevent setting href to external domains
                  var originalSetAttribute = element.setAttribute;
                  element.setAttribute = function(name, value) {
                    if (name.toLowerCase() === 'href') {
                      try {
                        var url = new URL(value, window.location.origin);
                        if (url.origin !== window.location.origin) {
                          console.log('Blocked external favicon request to: ' + value);
                          return element;
                        }
                      } catch (e) {}
                    }
                    return originalSetAttribute.call(this, name, value);
                  };
                }
                return element;
              };
            })();
          `}
        </Script>
      </head>
      <body className="bg-app">
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        <Toaster />
        <ErrorLoggerInitializer />
        {
          // NO USER BEHAVIOR TRACKING OR PRIVATE DATA COLLECTION BY DEFAULT
          //
          // When `NEXT_PUBLIC_STATIC_WEBSITE_ONLY` is `true`, the script will be injected
          // into the page only when `AMPLITUDE_API_KEY` is provided in `.env`
        }
        {env.NEXT_PUBLIC_STATIC_WEBSITE_ONLY && env.AMPLITUDE_API_KEY && (
          <>
            <Script src="https://cdn.amplitude.com/script/d2197dd1df3f2959f26295bb0e7e849f.js"></Script>
            <Script id="amplitude-init" strategy="lazyOnload">
              {`window.amplitude.init('${env.AMPLITUDE_API_KEY}', {"fetchRemoteConfig":true,"autocapture":true});`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
