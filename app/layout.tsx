import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AttributeOS - Lead Attribution Tracking",
  description: "Prove which marketing dollars produce revenue with mathematical certainty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
