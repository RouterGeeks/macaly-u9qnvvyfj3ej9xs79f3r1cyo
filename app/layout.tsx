import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "WoSoLive - Live Women's Soccer Scores",
  description: "The ultimate live scores app for women's soccer. Get real-time updates, fixtures, and standings for all major women's football leagues worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className={`${montserrat.variable} font-sans`}>{children}</body>
    </html>
  );
}