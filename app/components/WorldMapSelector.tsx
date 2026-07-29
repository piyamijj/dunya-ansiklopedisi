"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion } from "framer-motion";

// TopoJSON world atlas URL (110m resolution is lightweight and perfect for fast loading)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapSelectorProps {
  /** Detaylı verisi hazır olan iki harfli ülke kodları (küçük harf, örn: ["tr", "us"]) */
  availableCodes: string[];
  /** ISO Sayısal Kod -> İki Harfli Ülke Kodu eşleştirmesi (örn: {"792": "tr", "840": "us"}) */
  numericToAlpha2?: Record<string, string>;
  /** ISO Sayısal Kod -> Türkçe Ülke Adı eşleştirmesi (örn: {"792": "Türkiye"}) */
  numericToNameTr?: Record<string, string>;
}

export default function WorldMapSelector({
  availableCodes = [],
  numericToAlpha2 = {},
  numericToNameTr = {},
}: WorldMapSelectorProps) {
  const router = useRouter();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // İki harfli koda göre verinin hazır olup olmadığını kontrol et
  const isAvailable = (numericId: string): boolean => {
    const alpha2 = numericToAlpha2[numericId]?.toLowerCase();
    return alpha2 ? availableCodes.includes(alpha2) : false;
  };

  const handleCountryClick = (geo: any) => {
    const numericId = geo.id || geo.properties?.id;
    if (!numericId) return;

    const alpha2 = numericToAlpha2[numericId]?.toLowerCase();
    if (alpha2) {
      router.push(`/ulke/${alpha2}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full rounded-2xl border border-atlas-border bg-atlas-bg-alt/40 p-4 md:p-6 shadow-atlas-glow/5"
    >
      {/* Tooltip / Bilgi Paneli */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none min-h-[40px]">
        {hoveredCountry ? (
          <div className="rounded-lg bg-atlas-card border border-atlas-gold/30 px-3 py-1.5 text-sm font-medium text-atlas-gold shadow-atlas-glow">
            {hoveredCountry}
          </div>
        ) : (
          <div className="rounded-lg bg-atlas-card/40 border border-atlas-border px-3 py-1.5 text-sm text-atlas-text-muted">
            Keşfetmek için bir ülkenin üzerine gelin
          </div>
        )}
      </div>

      {/* Harita Çizim Alanı */}
      <div className="w-full overflow-hidden">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 145,
          }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numericId = geo.id || geo.properties?.id;
                const englishName = geo.properties?.name || "Bilinmeyen Ülke";
                const turkishName = numericToNameTr[numericId] || englishName;
                const hasData = isAvailable(numericId);

                // Harita renk paleti
                const defaultFill = hasData ? "#1e2e4a" : "#131c31"; // Verisi olanlar daha açık mavi
                const hoverFill = hasData ? "#e0a52c" : "#25324f"; // Verisi olanlar altın sarısı, olmayanlar gri-mavi
                const strokeColor = hasData ? "#2dd4bf" : "#25324f"; // Verisi olanların sınırları teal

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setHoveredCountry(
                        hasData
                          ? `${turkishName} 🇹🇷 (Veri Hazır)`
                          : `${turkishName} (İçerik Yakında)`
                      );
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                    }}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: defaultFill,
                        stroke: strokeColor,
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "fill 0.2s ease, stroke 0.2s ease",
                        cursor: hasData ? "pointer" : "default",
                      },
                      hover: {
                        fill: hoverFill,
                        stroke: hasData ? "#e0a52c" : "#8b96b3",
                        strokeWidth: 0.8,
                        outline: "none",
                        transition: "fill 0.2s ease, stroke 0.2s ease",
                        cursor: hasData ? "pointer" : "default",
                      },
                      pressed: {
                        fill: "#a8781c",
                        stroke: "#e0a52c",
                        strokeWidth: 0.8,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Alt Bilgilendirme Yazısı */}
      <div className="mt-4 text-center text-xs text-atlas-text-muted">
        Haritada <span className="text-atlas-teal font-semibold">Teal (Mavi-Yeşil)</span> sınır çizgisine sahip ülkelerin detaylı ansiklopedik verileri hazırdır. Üzerlerine tıklayarak doğrudan inceleyebilirsiniz.
      </div>
    </motion.div>
  );
}