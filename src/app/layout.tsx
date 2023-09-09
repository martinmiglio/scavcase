import "./globals.css";
import FooterBar from "@/components/page/FooterBar";
import NavBar from "@/components/page/NavBar";
import { font } from "@/styles/fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "scavcase",
  description: "Track scav cases in Escape from Tarkov",
  icons: `icon?v2`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background text-text">
      <body className={font.className}>
        <div className="mx-auto flex h-screen w-full max-w-screen-md flex-col justify-between px-4">
          <div className="flex flex-col gap-1">
            <NavBar title={metadata.title?.toString() ?? ""} />
            {children}
          </div>
          <FooterBar />
        </div>
      </body>
    </html>
  );
}
