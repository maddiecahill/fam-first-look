import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAM First Look | FIRST AND MAIN Real Estate",
  description: "See what's next, first. Explore public First Look homes with FIRST AND MAIN Real Estate.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
