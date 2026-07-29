"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Award,
  GraduationCap,
  Rocket,
  Building2,
  Star,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { CountryData, ScienceIndicator, Institution } from "../../../lib/types";

interface ScienceScorecardProps {
  data: CountryData["science"];
}

export default function ScienceScorecard({ data }: ScienceScorecardProps) {
  const { summary, indicators = [], notableAchievements = [], institutions = [] } = data;

  // Radar grafik verisini hazırla (Sadece 100 üzerinden skoru olan göstergeleri al)
  const radarData = indicators
    .filter((ind) => typeof ind.scoreOutOf100 === "number")
    .map((ind) => {
      // Uzun başlıkları kısalt
      const truncatedLabel =
        ind.label.length > 20 ? `${ind.label.substring(0, 18)}...` : ind.label;
      return {
        subject: truncatedLabel,
        score: ind.scoreOutOf100,
        fullMark: 100,
      };
    });

  // Kurum türüne göre ikon seçici
  const getInstitutionIcon = (type: string) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes("uzay") || normalizedType.includes("space") || normalizedType.includes("rocket")) {
      return <Rocket className="h-4 w-4 text-atlas-gold" />;
    }
    if (normalizedType.includes("universite") || normalizedType.includes("okul") || normalizedType.includes("academic") || normalizedType.includes("university")) {
      return <GraduationCap className="h-4 w-4 text-atlas-teal" />;
    }
    return <Building2 className="h-4 w-4 text-atlas-text-muted" />;
  };

  return (
    <section id="bilim" className="scroll-mt-24 py-16 pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Bölüm Başlığı */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <FlaskConical className="h-6 w-6 text-atlas-gold" />
            <h2 className="atlas-section-title text-2xl md:text-3xl">
              Bilimsel Araştırma ve Gelişmişlik
            </h2>
          </div>
          <div className="atlas-divider" />
          <p className="text-base text-atlas-text-muted leading-relaxed max-w-3xl">
            {summary}
          </p>
        </div>

        {/* İki Sütunlu Gösterge ve Skor Kartı Bölümü */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Sol Sütun: Recharts Radar Grafik */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="atlas-card p-6 flex flex-col items-center justify-center min-h-[380px]"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-atlas-gold-light mb-6 self-start flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Görsel Skor Kartı (Radar Analizi)
            </h3>
            
            {radarData.length >= 3 ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#25324f" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#8b96b3", fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#8b96b3", fontSize: 8 }}
                      axisLine={false}
                    />
                    <Radar
                      name="Skor"
                      dataKey="score"
                      stroke="#e0a52c"
                      fill="#e0a52c"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-atlas-text-muted/60 h-[300px]">
                <FlaskConical className="h-10 w-10 text-atlas-border mb-3 animate-pulse" />
                <p className="text-xs">Radar grafiği çizimi için yeterli skor verisi bulunmuyor.</p>
                <p className="text-[10px] text-atlas-text-muted/40 mt-1">En az 3 skorlu gösterge gereklidir.</p>
              </div>
            )}
          </motion.div>

          {/* Sağ Sütun: Detaylı Göstergeler ve İlerleme Çubukları */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-atlas-gold-light flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Detaylı Göstergeler
            </h3>
            <div className="space-y-4">
              {indicators.map((indicator, index) => (
                <motion.div
                  key={`${indicator.label}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-atlas-text">{indicator.label}</span>
                    <span className="font-bold text-atlas-gold-light">
                      {indicator.value} {indicator.unit || ""}
                    </span>
                  </div>
                  
                  {/* Skor Varsa İlerleme Çubuğu Çiz */}
                  {typeof indicator.scoreOutOf100 === "number" && (
                    <div className="h-1.5 w-full bg-atlas-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${indicator.scoreOutOf100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-atlas-gold to-atlas-gold-light rounded-full"
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* Öne Çıkan Bilimsel Başarılar */}
        {notableAchievements.length > 0 && (
          <div className="mt-20">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light mb-6 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Öne Çıkan Bilimsel ve Teknolojik Başarılar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notableAchievements.map((achievement, index) => (
                <motion.div
                  key={`achievement-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="atlas-card p-5 flex items-start gap-4 hover:border-atlas-teal/40 transition-all duration-300"
                >
                  <div className="p-2 rounded-lg bg-atlas-gold/10 border border-atlas-gold/20 flex-shrink-0">
                    <Star className="h-4 w-4 text-atlas-gold" />
                  </div>
                  <p className="text-xs md:text-sm text-atlas-text-muted leading-relaxed">
                    {achievement}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Önde Gelen Kurumlar ve Üniversiteler */}
        {institutions.length > 0 && (
          <div className="mt-20">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light mb-6 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Önde Gelen Kurumlar ve Üniversiteler
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {institutions.map((inst, index) => (
                <motion.div
                  key={`${inst.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="atlas-card p-5 flex flex-col justify-between hover:border-atlas-gold/50 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-atlas-card-light border border-atlas-border px-2.5 py-0.5 text-[9px] font-semibold text-atlas-text-muted uppercase tracking-wider">
                        {inst.type}
                      </span>
                      <div className="p-1.5 rounded-md bg-atlas-bg-alt border border-atlas-border">
                        {getInstitutionIcon(inst.type)}
                      </div>
                    </div>
                    <h4 className="font-bold text-atlas-text text-sm line-clamp-2">
                      {inst.name}
                    </h4>
                    <p className="text-xs text-atlas-text-muted leading-relaxed line-clamp-4">
                      {inst.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}