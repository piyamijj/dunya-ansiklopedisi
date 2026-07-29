"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Globe, Sparkles, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  stats: {
    totalCountries: number;
    readyCountries: number;
  };
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-atlas-radial from-atlas-bg-alt via-atlas-bg to-atlas-bg py-20 md:py-28 border-b border-atlas-border">
      {/* Arka Plan Dekoratif Işıma Blobları */}
      <div className="absolute left-1/4 top-1/4 -z-10 h-96 w-96 rounded-full bg-atlas-gold/5 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-atlas-teal/5 blur-[120px]" />

      {/* İnce Nokta Deseni (Grid Overlay) */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.02]" 
        style={{
          backgroundImage: "radial-gradient(#e0a52c 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="mx-auto max-w-4xl px-4 text-center flex flex-col items-center">
        {/* Eyebrow Rozeti */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full bg-atlas-gold/10 px-4 py-1.5 text-xs font-semibold text-atlas-gold border border-atlas-gold/20 mb-6"
        >
          <Globe className="h-3.5 w-3.5 animate-spin-slow" />
          <span>190+ Ülke · Yapay Zeka Destekli Ansiklopedi</span>
        </motion.div>

        {/* Ana Başlık */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="font-atlas-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-atlas-text via-atlas-text to-atlas-gold-light leading-tight max-w-3xl"
        >
          Dünyayı Keşfetmenin En Kapsamlı Yolu
        </motion.h1>

        {/* Alt Başlık Açıklaması */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-base sm:text-lg md:text-xl text-atlas-text-muted max-w-2xl leading-relaxed"
        >
          Her ülkenin tarihini, ekonomisini, siyasi geçmişini, uluslararası ilişkilerini ve bilimsel gelişmişliğini tek platformda, derinlemesine ve görsel olarak zenginleştirilmiş şekilde inceleyin.
        </motion.p>

        {/* İstatistikler Satırı */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-10 border border-atlas-border/60 bg-atlas-card/30 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-atlas-glow/5"
        >
          {/* İstatistik 1 */}
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl md:text-4xl font-bold text-atlas-gold-light tracking-tight">
              {stats.totalCountries}+
            </span>
            <span className="text-xs text-atlas-text-muted mt-1 uppercase tracking-wider font-medium">
              Kayıtlı Ülke
            </span>
          </div>

          {/* Dikey Bölücü Çizgi */}
          <div className="hidden sm:block w-px bg-atlas-border/60 self-stretch" />

          {/* İstatistik 2 */}
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl md:text-4xl font-bold text-atlas-teal tracking-tight flex items-center gap-1.5">
              <CheckCircle2 className="h-6 w-6 text-atlas-teal" />
              {stats.readyCountries}
            </span>
            <span className="text-xs text-atlas-text-muted mt-1 uppercase tracking-wider font-medium">
              Detaylı İçerik Hazır
            </span>
          </div>

          {/* Dikey Bölücü Çizgi */}
          <div className="hidden sm:block w-px bg-atlas-border/60 self-stretch" />

          {/* İstatistik 3 */}
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl md:text-4xl font-bold text-atlas-gold tracking-tight flex items-center gap-1.5">
              <Sparkles className="h-6 w-6 text-atlas-gold" />
              Aktif
            </span>
            <span className="text-xs text-atlas-text-muted mt-1 uppercase tracking-wider font-medium">
              Yapay Zeka Çözücü
            </span>
          </div>
        </motion.div>

        {/* Aşağı Kaydır Göstergesi */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 flex flex-col items-center gap-1 text-atlas-text-muted/60 text-xs cursor-pointer hover:text-atlas-gold transition-colors"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight * 0.85,
              behavior: "smooth"
            });
          }}
        >
          <span>Haritayı İnceleyin</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-atlas-gold" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}