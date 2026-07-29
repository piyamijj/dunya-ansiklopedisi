import React from "react";
import { Metadata } from "next";
import { getCountryList, getAvailableCountryCodes } from "../../lib/countries";
import CountryGrid from "../components/CountryGrid";

export const metadata: Metadata = {
  title: "Tüm Ülkeler — Dünya Ansiklopedisi",
  description: "190'dan fazla ülkeyi bölgeye göre filtreleyin, arama yapın ve detaylı ansiklopedik içeriklerine ulaşın.",
};

export default function UlkelerPage() {
  const countries = getCountryList();
  const availableCodes = getAvailableCountryCodes();

  return (
    <div className="bg-atlas-bg min-h-screen pb-16">
      {/* Sayfa Başlığı Bölümü */}
      <div className="border-b border-atlas-border bg-atlas-bg-alt/30 py-12 md:py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 flex flex-col items-center">
          <h1 className="atlas-section-title text-3xl md:text-4xl">
            Tüm Ülkeler
          </h1>
          <div className="atlas-divider max-w-xs mx-auto" />
          <p className="text-sm md:text-base text-atlas-text-muted max-w-2xl leading-relaxed">
            190&apos;dan fazla ülke arasından dilediğinizi seçin, coğrafi bölgelere göre filtreleyin veya isimle arama yaparak detaylı ansiklopedik verilere hızlıca ulaşın.
          </p>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <CountryGrid countries={countries} availableCodes={availableCodes} />
      </div>
    </div>
  );
}