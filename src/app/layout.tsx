import authOptions from "./api/auth/[...nextauth]/authOptions";
import "./globals.css";
import AuthSessionProvider from "@/components/auth/AuthSessionProvider";
import FooterBar from "@/components/page/FooterBar";
import NavBar from "@/components/page/NavBar";
import { font } from "@/styles/fonts";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";

const title = "scavcase.watch";
const description = "Track and share scav case values in Escape from Tarkov";

export const metadata: Metadata = {
  title: title,
  description: description,
  icons: "https://www.scavcase.watch/icon?v3",
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
