import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  title: "Dünya Ansiklopedisi — Küresel Ülke Rehberi",
  description: "190'dan fazla ülkenin tarihi, ekonomisi, siyaseti, uluslararası ilişkileri ve bilimsel gelişmişliğini keşfedin. Yapay zeka destekli soru-cevap özelliğiyle merak ettiğiniz her şeyi öğrenin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="bg-atlas-bg text-atlas-text font-atlas-sans min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-grow">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}