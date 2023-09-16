import authOptions from "./api/auth/[...nextauth]/authOptions";
import "./globals.css";
import AuthSessionProvider from "@/components/auth/AuthSessionProvider";
import FooterBar from "@/components/page/FooterBar";
import NavBar from "@/components/page/NavBar";
import { font } from "@/styles/fonts";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Script from "next/script";
import { z } from "zod";

const schema = z.object({
  ANALYTICS_ID: z.string().optional(),
  ANALYTICS_URL: z.string().optional(),
});
const env = schema.parse(process.env);

const title = "scavcase.watch";
const description = "Track and share scav case values in Escape from Tarkov";

export const metadata: Metadata = {
  title: title,
  description: description,
  metadataBase: new URL("https://www.scavcase.watch/"),
  icons: "/icon?v3",
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: ["/og?v4"],
  },
  openGraph: {
    type: "website",
    title: title,
    description: description,
    siteName: title,
    images: [
      {
        url: "/og?v4",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className="pattern-size-12 bg-background text-text pattern-checkered pattern-checkered-background2/100 pattern-checkered-scale-[5]"
    >
      <head>
        {env.ANALYTICS_URL && env.ANALYTICS_ID && (
          <Script
            async
            src={env.ANALYTICS_URL}
            data-website-id={env.ANALYTICS_ID}
            data-domains="scavcase.watch,www.scavcase.watch"
          />
        )}
      </head>
      <AuthSessionProvider session={session}>
        <body className={font.className}>
          <NavBar title={metadata.title?.toString() ?? ""} />
          <main className="mx-auto min-h-screen w-full max-w-screen-lg border-4 border-dark bg-background p-3 px-4">
            {children}
          </main>
          <FooterBar />
        </body>
      </AuthSessionProvider>
    </html>
  );
}
