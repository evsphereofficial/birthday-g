import type { Metadata } from "next";
import { Fraunces, Great_Vibes, Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Birthday Gianna Ztar Fang ✦ October 1",
  description:
    "A creamy pink birthday website made with a lot of love, glitter and animation for Gianna Ztar Fang. Happy 1st of October!",
  openGraph: {
    title: "Happy Birthday Gianna Ztar Fang ✦",
    description: "A little corner of the internet built just for your day.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${fraunces.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
