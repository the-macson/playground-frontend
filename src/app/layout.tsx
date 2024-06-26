// "use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
const inter = Inter({ subsets: ["latin"] });
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
    <html lang="en">
      <body className={inter.className}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
