// "use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "./providers";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

import { ColorModeScript } from "@chakra-ui/react";
import theme from "../util/theme";
export const metadata: Metadata = {
  title: "Coding Playground",
  description: "A coding playground for developers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-inter">

        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
