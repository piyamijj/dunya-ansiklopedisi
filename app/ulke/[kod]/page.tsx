import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { getCountryByCode, getCountryData, getAvailableCountryCodes } from "../../../lib/countries";
import CountryHero from "../../components/country/CountryHero";
import HistoryTimeline from "../../components/country/HistoryTimeline";
import EconomyDashboard from "../../components/country/EconomyDashboard";
import RelationsSection from "../../components/country/RelationsSection";
import PoliticsTimeline from "../../components/country/PoliticsTimeline";
import ScienceScorecard from "../../components/country/ScienceScorecard";

interface PageProps {
  params: {
    kod: string;
  };
}

/**
 * Next.js generateStaticParams (SSG) - Sadece detaylı verisi hazır olan ülkeleri önceden derler.
 * Bu sayede build süresi kısalır ve boş sayfalar için gereksiz derleme yapılmaz.
 */
export async function generateStaticParams() {
  const codes = getAvailableCountryCodes();
  return codes.map((code) => ({
    kod: code.toLowerCase(),
  }));
}

/**
 * Dinamik sayfa başlığı ve meta açıklaması üretimi.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const country = getCountryByCode(params.kod);
  
  if (!country) {
    return {
      title: "Ülke Bulunamadı — Dünya Ansiklopedisi",
    };
  }

  return {
    title: `${country.name_tr} — Dünya Ansiklopedisi`,
    description: `${country.name_tr} (${country.name_en}) hakkında detaylı tarih, ekonomi, siyaset, uluslararası ilişkiler ve bilimsel gelişmişlik verilerini inceleyin. Başkent: ${country.capital_tr}, Bölge: ${country.region}.`,
  };
}

export default function CountryPage({ params }: PageProps) {
  const { kod } = params;
  
  // 1. Ülkenin master listede kayıtlı olup olmadığını kontrol et
  const countryMeta = getCountryByCode(kod);
  if (!countryMeta) {
    // Master listede yoksa tamamen geçersiz bir koddur, 404 döndür
    notFound();
  }

  // 2. Ülkeye ait detaylı ansiklopedik veriyi oku
  const data = getCountryData(kod);

  // 3. Eğer detaylı veri henüz üretilmemişse (null ise), "Yakında Gelecek" durumunu göster
  if (!data) {
    return (
      <div className="bg-atlas-bg min-h-[80vh] flex items-center justify-center py-16">
        <div className="mx-auto max-w-2xl px-4 text-center flex flex-col items-center space-y-8">
          {/* Bayrak Emojisi */}
          <span className="text-7xl md:text-8xl select-none filter drop-shadow-md animate-pulse">
            {countryMeta.flag_emoji}
          </span>

          {/* Başlıklar */}
          <div className="space-y-2">
            <h1 className="font-atlas-serif text-3xl md:text-4xl font-bold text-atlas-text">
              {countryMeta.name_tr}
            </h1>
            <p className="text-sm text-atlas-text-muted italic">
              ({countryMeta.name_en}) • Başkent: {countryMeta.capital_tr}
            </p>
          </div>

          {/* Bilgilendirme Kartı */}
          <div className="atlas-card p-6 md:p-8 border-dashed border-atlas-border bg-atlas-card/20 max-w-lg">
            <h2 className="text-sm font-bold text-atlas-gold uppercase tracking-wider mb-3">
              İçerik Hazırlanıyor
            </h2>
            <p className="text-xs md:text-sm text-atlas-text-muted leading-relaxed">
              Bu ülke için detaylı ansiklopedik içerik (tarih, ekonomi, siyaset, ilişkiler ve bilim) şu anda yapay zeka modellerimiz tarafından hazırlanıyor. Sürecimiz devam etmektedir.
            </p>
            <p className="text-xs text-atlas-text-muted/60 mt-3">
              Lütfen daha sonra tekrar kontrol edin veya bu süre zarfında aşağıdaki yapay zeka soru-cevap özelliğini kullanarak merak ettiğiniz her şeyi hemen öğrenin:
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            {/* AI Soru Sor Butonu */}
            <Link
              href={`/sor?ulke=${encodeURIComponent(countryMeta.name_tr)}`}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-atlas-gold text-atlas-bg font-semibold text-sm hover:bg-atlas-gold-light hover:shadow-atlas-glow transition-all duration-300 w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              Bu Ülke Hakkında Yapay Zekaya Sor
            </Link>

            {/* Geri Dön Butonu */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-atlas-card border border-atlas-border text-atlas-text-muted hover:text-atlas-text hover:border-atlas-gold transition-all duration-300 w-full sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Tüm Ülkelere Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Detaylı veri varsa, tüm şablon bileşenlerini sırasıyla birleştirerek sayfayı oluştur
  return (
    <div className="bg-atlas-bg min-h-screen pb-12">
      {/* 1. Hero Bölümü */}
      <CountryHero data={data} />

      {/* İçerik Bölümleri Konteyneri */}
      <div className="space-y-4">
        {/* 2. Tarih Zaman Çizelgesi */}
        <HistoryTimeline summary={data.history.summary} events={data.history.timeline} />

        {/* 3. Ekonomi Gösterge Paneli */}
        <EconomyDashboard data={data.economy} />

        {/* 4. Uluslararası İlişkiler Ağı */}
        <RelationsSection data={data.relations} countryFlag={data.meta.flag_emoji} />

        {/* 5. Siyasi Tarih ve Yönetim */}
        <PoliticsTimeline data={data.politics} />

        {/* 6. Bilimsel Araştırma ve Gelişmişlik */}
        <ScienceScorecard data={data.science} />
      </div>
    </div>
  );
}