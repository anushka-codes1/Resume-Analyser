import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://resume-analyser-rho-black.vercel.app"
  ),

  title: "AI Resume Analyzer | ATS Resume Scoring & Optimization",

  description:
    "AI-powered ATS Resume Analyzer built with Gemini and FastAPI.",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "AI Resume Analyzer | ATS Resume Scoring & Optimization",

    description:
      "Analyze resumes using AI. Get ATS compatibility scores, keyword insights, strengths, weaknesses, and optimization recommendations.",

    url: "https://resume-analyser-rho-black.vercel.app",

    siteName: "AI Resume Analyzer",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Resume Analyzer",
      },
    ],

    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
