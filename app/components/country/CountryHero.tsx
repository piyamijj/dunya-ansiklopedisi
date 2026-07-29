"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, Calendar, TrendingUp, Users, Award } from "lucide-react";
import { CountryData } from "../../../lib/types";

interface CountryHeroProps {
  data: CountryData;
}

export default function CountryHero({ data }: CountryHeroProps) {
  const { meta, overview } = data;

  const quickLinks = [
    { href: "#tarih", label: "Tarih", icon: Calendar },
    { href: "#ekonomi", label: "Ekonomi", icon: TrendingUp },
    { href: "#iliskiler", label: "İlişkiler", icon: Compass },
    { href: "#siyaset", label: "Siyaset", icon: Users },
    { href: "#bilim", label: "Bilim", icon: Award },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-atlas-radial from-atlas-bg-alt via-atlas-bg to-atlas-bg py-16 md:py-24 border-b border-atlas-border">
      {/* Arka Plan Dekoratif Işıma Blobları */}
      <div className="absolute left-10 top-10 -z-10 h-72 w-72 rounded-full bg-atlas-gold/5 blur-[100px]" />
      <div className="absolute right-10 bottom-10 -z-10 h-72 w-72 rounded-full bg-atlas-teal/5 blur-[100px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Sol Taraf: Ülke Bilgileri */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            {/* Bölge Rozeti */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-atlas-card border border-atlas-border px-3 py-1 text-xs font-medium text-atlas-text-muted"
            >
              <Compass className="h-3.5 w-3.5 text-atlas-gold" />
              <span>{meta.region}</span>
            </motion.div>

            {/* Bayrak Emojisi (Bobbing Animasyonlu) */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: [0, -8, 0]
              }}
              transition={{ 
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 },
                y: { 
                  repeat: Infinity, 
                  duration: 4, 
                  ease: "easeInOut" 
                }
              }}
              className="inline-block select-none filter drop-shadow-md"
            >
              <span className="text-7xl md:text-8xl block">{meta.flag_emoji}</span>
            </motion.div>

            {/* Ülke Adı ve Başkent */}
            <div className="space-y-2">
              <motion.h1
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="font-atlas-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-atlas-text via-atlas-text to-atlas-gold-light leading-tight"
              >
                {meta.name_tr}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-atlas-text-muted"
              >
                <span className="font-medium italic">({meta.name_en})</span>
                <span className="text-atlas-border">•</span>
                <span className="flex items-center gap-1 text-atlas-gold-light">
                  <MapPin className="h-4 w-4" />
                  Başkent: <strong className="text-atlas-text">{meta.capital_tr}</strong>
                </span>
                <span className="text-atlas-border">•</span>
                <span className="font-mono uppercase tracking-wider text-xs bg-atlas-card px-2 py-0.5 rounded border border-atlas-border">
                  {meta.iso3}
                </span>
              </motion.div>
            </div>

            {/* Özet Metin */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base text-atlas-text-muted leading-relaxed max-w-2xl"
            >
              {overview}
            </motion.p>

            {/* Hızlı Bağlantılar */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center md:justify-start gap-2 pt-2"
            >
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 rounded-full bg-atlas-card border border-atlas-border px-4 py-2 text-xs font-medium text-atlas-text-muted hover:text-atlas-gold hover:border-atlas-gold hover:shadow-atlas-glow/5 transition-all duration-300"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {link.label}
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* Sağ Taraf: Dekoratif Kozmik/Yörünge SVG Çemberleri */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex items-center justify-center w-[280px] h-[280px] relative flex-shrink-0"
          >
            {/* Dış Çember (Yavaş Saat Yönü) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-atlas-gold/20"
            />
            
            {/* Orta Çember (Hızlı Ters Saat Yönü) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-dashed border-atlas-teal/20"
            />

            {/* İç Çember (Yavaş Saat Yönü) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-10 rounded-full border border-dashed border-atlas-gold/10 flex items-center justify-center"
            />

            {/* Merkez Küre */}
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-atlas-card-light to-atlas-bg border border-atlas-border flex items-center justify-center shadow-atlas-glow/10">
              <Compass className="h-10 w-10 text-atlas-gold/40 animate-pulse" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}