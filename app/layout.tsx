import type { Metadata } from "next";
import { Pixelify_Sans, Ubuntu_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
});

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = getSiteUrl();
const ogImageUrl = new URL("/og-image.png", siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  title: "Nap | The Only CLI You Will Ever Need",
  description: "Nap CLI is an agentic interface that understands, plans, executes, and iterates directly against your codebase terminally.",
  keywords: [
    "napster",
    "nap cli",
    "cli tool",
    "agentic interface",
    "codebase management",
    "terminal interface",
    "code execution",
    "iterative development",
    "nap code",
    "nap agent",
    "nap terminal",
    "nap coding assistant",
    "nap automation",
    "nap development tool",
    "nap code execution",
    "nap code iteration",
    "nap code planning",
    "nap code understanding",
    "nap code execution",
    "nap code iteration",
    "nap code planning",
    "nap code understanding",
  ],
  openGraph: {
    title: "Nap | The Only CLI You Will Ever Need",
    description: "Nap CLI is an agentic interface that understands, plans, executes, and iterates directly against your codebase terminally.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1011,
        height: 674,
        alt: "Nap Code Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nap | The Only CLI You Will Ever Need",
    description: "Nap CLI is an agentic interface that understands, plans, executes, and iterates directly against your codebase terminally.",
    images: [ogImageUrl],
  },
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" className={`${pixelifySans.variable} ${ubuntuMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
