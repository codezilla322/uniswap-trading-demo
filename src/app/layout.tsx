import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VolumeFi Demo",
  description: "VolumeFi home assessment project created by Brian",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  );
}
