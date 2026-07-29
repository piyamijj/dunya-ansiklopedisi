"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Globe, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryListItem } from "../../lib/types";

interface CountryGridProps {
  countries: CountryListItem[];
  availableCodes: string[];
}

const regions = ["Tümü", "Avrupa", "Asya", "Afrika", "Kuzey Amerika", "Güney Amerika", "Okyanusya"];

export default function CountryGrid({ countries = [], availableCodes = [] }: CountryGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Tümü");

  // Arama ve bölge filtreleme mantığı
  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch =
        country.name_tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.capital_tr.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = selectedRegion === "Tümü" || country.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [countries, searchQuery, selectedRegion]);

  // Alfabetik sıralama (Türkçe karakter duyarlı)
  const sortedCountries = useMemo(() => {
    return [...filteredCountries].sort((a, b) =>
      a.name_tr.localeCompare(b.name_tr, "tr")
    );
  }, [filteredCountries]);

  // Framer Motion animasyon varyasyonları
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  };

  return (
    <div className="space-y-8">
      {/* Filtreler ve Arama Çubuğu */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Bölge Seçici */}
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                selectedRegion === region
                  ? "bg-atlas-gold text-atlas-bg border-atlas-gold shadow-atlas-glow"
                  : "bg-atlas-card border-atlas-border text-atlas-text-muted hover:text-atlas-text hover:border-atlas-gold/50"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Arama Girişi */}
        <div className="relative w-full md:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-atlas-text-muted" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ülke veya başkent ara..."
            className="w-full rounded-full border border-atlas-border bg-atlas-card py-2.5 pl-11 pr-4 text-sm text-atlas-text placeholder-atlas-text-muted focus:border-atlas-gold focus:outline-none focus:ring-1 focus:ring-atlas-gold transition-all duration-300"
          />
        </div>
      </div>

      {/* Ülke Sayısı Özeti */}
      <div className="text-xs text-atlas-text-muted flex items-center gap-2">
        <Globe className="h-3.5 w-3.5 text-atlas-gold" />
        <span>
          Toplam {countries.length} ülkeden{" "}
          <span className="text-atlas-gold font-semibold">{sortedCountries.length}</span> tanesi
          listeleniyor. ({availableCodes.length} ülkenin detaylı verisi hazır)
        </span>
      </div>

      {/* Ülke Kartları Izgarası */}
      <AnimatePresence mode="wait">
        {sortedCountries.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {sortedCountries.map((country) => {
              const hasData = availableCodes.includes(country.code.toLowerCase());
              return (
                <motion.div
                  key={country.code}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="relative"
                >
                  <Link
                    href={`/ulke/${country.code.toLowerCase()}`}
                    className="flex flex-col items-center text-center h-full rounded-xl border border-atlas-border bg-atlas-card p-5 hover:border-atlas-gold hover:shadow-atlas-glow/10 transition-all duration-300 group"
                  >
                    {/* Hazır/Yakında Rozeti */}
                    <div className="absolute top-3 right-3">
                      {hasData ? (
                        <span className="flex items-center gap-1 rounded-full bg-atlas-teal/10 px-2 py-0.5 text-[10px] font-semibold text-atlas-teal border border-atlas-teal/20">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Hazır
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-atlas-text-muted/10 px-2 py-0.5 text-[10px] font-medium text-atlas-text-muted/80 border border-atlas-border">
                          <Clock className="h-2.5 w-2.5" />
                          Yakında
                        </span>
                      )}
                    </div>

                    {/* Bayrak Emojisi */}
                    <span className="text-4xl mb-3 select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {country.flag_emoji}
                    </span>

                    {/* Ülke Adı */}
                    <h3 className="font-atlas-serif text-sm font-bold text-atlas-text group-hover:text-atlas-gold transition-colors line-clamp-1">
                      {country.name_tr}
                    </h3>

                    {/* Başkent */}
                    <p className="text-xs text-atlas-text-muted mt-1 line-clamp-1">
                      {country.capital_tr}
                    </p>

                    {/* Bölge */}
                    <span className="text-[10px] text-atlas-text-muted/50 mt-2 uppercase tracking-wider">
                      {country.region}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-atlas-border rounded-2xl bg-atlas-card/20"
          >
            <Globe className="h-12 w-12 text-atlas-text-muted/40 mb-4 animate-pulse" />
            <h3 className="font-atlas-serif text-lg font-semibold text-atlas-text mb-1">
              Ülke Bulunamadı
            </h3>
            <p className="text-sm text-atlas-text-muted max-w-md">
              &quot;{searchQuery}&quot; araması veya seçilen bölge için uygun bir ülke kaydı bulunamadı. Lütfen arama kriterlerinizi kontrol edin.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}