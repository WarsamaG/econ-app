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
  title: "Zakify – UK Uni Revision Helper",
  description:
    "Zakify helps UK university students generate concise, comprehensive revision notes in seconds.",
  applicationName: "Zakify",
  keywords: [
    "revision",
    "study",
    "notes",
    "UK",
    "university",
    "exam",
  ],
  authors: [{ name: "Zakify" }],
  metadataBase: new URL("https://zakify.app"),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Zakify – UK Uni Revision Helper",
    description:
      "Generate clear revision notes with key concepts, questions, tips and more.",
    url: "https://zakify.app",
    siteName: "Zakify",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Zakify – UK Uni Revision Helper",
    description:
      "Generate clear revision notes with key concepts, questions, tips and more.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e0b40",
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
          {children}
        </div>
      </body>
    </html>
  );
}
