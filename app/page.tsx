import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { getCountryList, getAvailableCountryCodes } from "../lib/countries";
import { ISO_NUMERIC_TO_ALPHA2 } from "../lib/isoNumericMap";
import WorldMapSelector from "./components/WorldMapSelector";
import CountryGrid from "./components/CountryGrid";
import HeroSection from "./components/HeroSection";

export default function HomePage() {
  const countries = getCountryList();
  const availableCodes = getAvailableCountryCodes();

  // ISO Sayısal Kod -> Türkçe Ülke Adı eşleştirmesini oluştur
  const numericToNameTr: Record<string, string> = {};
  
  Object.entries(ISO_NUMERIC_TO_ALPHA2).forEach(([numeric, alpha2]) => {
    const country = countries.find(
      (c) => c.code.toLowerCase() === alpha2.toLowerCase()
    );
    if (country) {
      numericToNameTr[numeric] = country.name_tr;
    }
  });

  return (
    <div className="bg-atlas-bg min-h-screen pb-20">
      {/* Hero Bölümü */}
      <HeroSection
        stats={{
          totalCountries: countries.length,
          readyCountries: availableCodes.length,
        }}
      />

      {/* Ana İçerik Konteyneri */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        
        {/* İnteraktif Harita Bölümü */}
        <section className="space-y-6">
          <div className="text-center md:text-left">
            <h2 className="atlas-section-title text-2xl md:text-3xl">
              Dünya Haritasında Keşfet
            </h2>
            <div className="atlas-divider" />
            <p className="text-sm text-atlas-text-muted max-w-2xl -mt-2">
              Bir ülkeye tıklayarak tarihini, ekonomisini, siyasetini, uluslararası ilişkilerini ve bilimsel gelişmişliğini detaylı olarak inceleyin.
            </p>
          </div>

          <div className="mt-6">
            <WorldMapSelector
              availableCodes={availableCodes}
              numericToAlpha2={ISO_NUMERIC_TO_ALPHA2}
              numericToNameTr={numericToNameTr}
            />
          </div>
        </section>

        {/* Ülke Listesi/Izgarası Bölümü */}
        <section className="mt-24 space-y-6">
          <div className="text-center md:text-left">
            <h2 className="atlas-section-title text-2xl md:text-3xl">
              Tüm Ülkeler
            </h2>
            <div className="atlas-divider" />
            <p className="text-sm text-atlas-text-muted max-w-2xl -mt-2">
              190&apos;dan fazla ülke arasında arama yapın, coğrafi bölgelere göre filtreleyin ve ansiklopedik verilere hızlıca ulaşın.
            </p>
          </div>

          <div className="mt-6">
            <CountryGrid countries={countries} availableCodes={availableCodes} />
          </div>
        </section>

        {/* Yapay Zeka Soru-Cevap Tanıtım Banner'ı */}
        <section className="mt-24">
          <div className="atlas-card relative overflow-hidden rounded-2xl border border-atlas-border bg-gradient-to-r from-atlas-card to-atlas-bg-alt p-8 md:p-12 shadow-atlas-glow/10 flex flex-col md:flex-row items-center justify-between gap-8 group">
            {/* Arka Plan Işıması */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-atlas-gold/10 blur-3xl group-hover:bg-atlas-gold/20 transition-all duration-500" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-atlas-teal/5 blur-3xl" />

            <div className="space-y-4 max-w-2xl text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-atlas-gold/10 px-3 py-1 text-xs font-semibold text-atlas-gold border border-atlas-gold/20">
                <Sparkles className="h-3.5 w-3.5" />
                Yapay Zeka Destekli Soru-Cevap
              </div>
              <h3 className="font-atlas-serif text-2xl md:text-3xl font-bold text-atlas-text">
                Merak Ettiğiniz Bir Şey mi Var?
              </h3>
              <p className="text-sm text-atlas-text-muted leading-relaxed">
                Herhangi bir ülke hakkında istediğiniz soruyu sorun; yapay zeka destekli asistanımız, tarihsel olaylardan ekonomik göstergelere kadar her konuda detaylı, tarafsız ve anlaşılır bir şekilde yanıtlasın.
              </p>
            </div>

            <div className="relative z-10 flex-shrink-0">
              <Link
                href="/sor"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-atlas-gold text-atlas-bg font-semibold text-sm hover:bg-atlas-gold-light hover:shadow-atlas-glow transition-all duration-300 group/btn"
              >
                <Sparkles className="h-4 w-4" />
                Hemen Soru Sor
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}