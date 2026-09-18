import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "VoiceCraft — AI Text-to-Speech | Natural Voice Generator",
  description:
    "Generate natural-sounding speech from text using 400+ premium AI voices. Supports English, Vietnamese, Japanese, and 50+ languages. Free, no API key required.",
  keywords: [
    "text to speech",
    "TTS",
    "AI voice",
    "voice generator",
    "speech synthesis",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        style={{
          fontFamily: "'Inter', sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </body>
    </html>
  );
}
