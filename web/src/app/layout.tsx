// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// Modifications and enhancements by Emmi C (GreenCeltAI)
// SPDX-License-Identifier: MIT

import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";

import { ThemeProviderWrapper } from "~/components/deer-flow/theme-provider-wrapper";
import { ErrorLoggerInitializer } from "~/components/error-logger-initializer";
import { env } from "~/env";

import { Toaster } from "../components/deer-flow/toaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "☘️ GreenCeltAI - Deep Exploration and Efficient Research | AI-Powered Research Tools",
  description:
    "Transform your research with GreenCeltAI, an advanced tool that combines language models with specialized tools for comprehensive research tasks and deep information analysis.",
  keywords: "AI research, language models, deep exploration, efficient research, GreenCeltAI, research tools, AI assistant, information analysis",
  authors: [{ name: "Emmi C." }],
  creator: "Emmi C.",
  publisher: "GreenCeltAI",
  applicationName: "GreenCeltAI",
  icons: [
    { rel: "icon", url: "/GreenCelt/favicon.ico", sizes: "any" },
    { rel: "apple-touch-icon", url: "/GreenCelt/favicon.ico" },
  ],
  robots: "index, follow, max-image-preview:large",
  alternates: {
    canonical: "https://greencelt.emmi.zone",
  },
  openGraph: {
    type: "website",
    url: "https://greencelt.emmi.zone",
    title: "GreenCeltAI - Deep Exploration and Efficient Research",
    description: "Transform your research with GreenCeltAI, an advanced tool that combines language models with specialized tools for comprehensive research tasks and deep information analysis.",
    siteName: "GreenCeltAI",
    images: [
      {
        url: "https://greencelt.emmi.zone/GreenCelt/favicon.ico",
        width: 256,
        height: 256,
        alt: "GreenCeltAI Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@deep_endX",
    creator: "@deep_endX",
    title: "GreenCeltAI - AI-Powered Research Tools",
    description: "Transform your research with GreenCeltAI, an advanced tool that combines language models with specialized tools for comprehensive research tasks and deep information analysis.",
    images: ["https://greencelt.emmi.zone/GreenCelt/favicon.ico"],
  },
  // This helps prevent browser from requesting favicons from external domains
  other: {
    "msapplication-TileImage": "/GreenCelt/favicon.ico",
    "msapplication-config": "none",
    "theme-color": "#ffffff",
    "language": "English"
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
        {/* Character encoding for proper text rendering */}
        <meta charSet="UTF-8" />
        
        {/* Direct favicon link - forcing browser to use this specific favicon */}
        <link rel="icon" href="/GreenCelt/favicon.ico" />
        <link rel="shortcut icon" href="/GreenCelt/favicon.ico" />
        
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
        
        {/* Schema.org structured data */}
        <Script id="schema-org-data" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://greencelt.emmi.zone/#website",
                  "url": "https://greencelt.emmi.zone/",
                  "name": "GreenCeltAI - Deep Exploration and Efficient Research",
                  "description": "An advanced AI tool that combines language models with specialized tools for comprehensive research tasks and deep information analysis.",
                  "publisher": {
                    "@id": "https://greencelt.emmi.zone/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://greencelt.emmi.zone/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  },
                  "inLanguage": "en-US",
                  "copyrightYear": "2025"
                },
                {
                  "@type": "Organization",
                  "@id": "https://greencelt.emmi.zone/#organization",
                  "name": "GreenCeltAI",
                  "url": "https://greencelt.emmi.zone/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://greencelt.emmi.zone/GreenCelt/favicon.ico",
                    "width": 256,
                    "height": 256,
                    "caption": "GreenCeltAI Logo"
                  },
                  "description": "Provider of advanced AI research tools that combine language models with specialized tools for comprehensive information analysis.",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "contactType": "customer service",
                    "email": "contact@emmi.zone"
                  },
                  "sameAs": [
                    "https://github.com/EmminiX",
                    "https://x.com/deep_endX"
                  ],
                  "founder": {
                    "@type": "Person",
                    "name": "Emmi C."
                  },
                  "knowsAbout": [
                    "AI Research",
                    "Language Models",
                    "Research Tools",
                    "Information Analysis",
                    "Knowledge Management"
                  ],
                  "makesOffer": [
                    {
                      "@type": "Offer",
                      "name": "AI Research Tools",
                      "description": "Advanced AI-powered tools for efficient and comprehensive research."
                    },
                    {
                      "@type": "Offer",
                      "name": "Knowledge Analysis",
                      "description": "Deep exploration and analysis of complex information sources."
                    }
                  ]
                },
                {
                  "@type": "WebPage",
                  "@id": "https://greencelt.emmi.zone/#webpage",
                  "url": "https://greencelt.emmi.zone/",
                  "name": "GreenCeltAI - Deep Exploration and Efficient Research | AI-Powered Research Tools",
                  "description": "Transform your research with GreenCeltAI, an advanced tool that combines language models with specialized tools for comprehensive research tasks and deep information analysis.",
                  "isPartOf": {
                    "@id": "https://greencelt.emmi.zone/#website"
                  },
                  "about": {
                    "@id": "https://greencelt.emmi.zone/#organization"
                  },
                  "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://greencelt.emmi.zone/GreenCelt/favicon.ico",
                    "width": 256,
                    "height": 256
                  },
                  "datePublished": "2023-06-01T10:00:00+00:00",
                  "dateModified": "2025-03-20T10:00:00+00:00",
                  "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://greencelt.emmi.zone/"
                      }
                    ]
                  }
                },
                {
                  "@type": "Service",
                  "@id": "https://greencelt.emmi.zone/#service-research",
                  "name": "AI-Powered Research Tools",
                  "description": "Advanced research tools combining language models with specialized tools for comprehensive information analysis.",
                  "provider": {
                    "@id": "https://greencelt.emmi.zone/#organization"
                  },
                  "serviceType": "AI Research",
                  "url": "https://greencelt.emmi.zone/"
                }
              ]
            }
          `}
        </Script>
        
        {/* Plausible Analytics */}
        <Script
          defer
          data-domain="greencelt.emmi.zone"
          src="https://plausible.emmi.zone/js/script.js"
        />
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
