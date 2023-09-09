import "./globals.css";
import FooterBar from "@/components/page/FooterBar";
import NavBar from "@/components/page/NavBar";
import { font } from "@/styles/fonts";
import type { Metadata } from "next";

const title = "scavcase.watch";
const description = "Track and share scav case values in Escape from Tarkov";

export const metadata: Metadata = {
  title: title,
  description: description,
  icons: "icon?v2",
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: ["https://www.scavcase.watch/og?v4"],
  },
  openGraph: {
    type: "website",
    title: title,
    description: description,
    siteName: title,
    images: [
      {
        url: "https://www.scavcase.watch/og?v4",
        width: 1200,
        height: 630,
      },
    ],
  },
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
