import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Luna — Cycle Tracker",
  description: "Track your menstrual cycle with care and intelligence",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Luna",
  },
};

export const viewport: Viewport = {
  themeColor: "#C4607A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
