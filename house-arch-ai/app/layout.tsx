import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeForge AI | 3D House Design Platform",
  description:
    "A futuristic 3D interactive house design and visualization platform for homeowners, builders, architects, and designers."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}