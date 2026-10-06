import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// One family, used across weights and widths: Archivo carries display and
// body alike. The variable width axis lets headings run slightly expanded.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Mono is reserved for data: chart labels, figure captions, live readouts.
const mono = JetBrains_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stable Auto — Predict ROI for EV Charging",
  description:
    "Predict ROI for your next EV charging station with Stable Auto. Stable uses 70+ variables to forecast utilization, energy costs, and potential revenue.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e7efec",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-mist font-body text-ink">
        {/* Scroll reveals are JS-driven; without JS everything shows as-is. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
