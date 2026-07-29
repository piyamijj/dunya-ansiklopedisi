"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Globe, Handshake, AlertTriangle, FileText, HelpCircle, Landmark } from "lucide-react";
import { CountryData, InternationalRelation, Treaty, OrganizationMembership } from "../../../lib/types";

interface RelationsSectionProps {
  data: CountryData["relations"];
  countryFlag?: string;
}

export default function RelationsSection({ data, countryFlag = "🌍" }: RelationsSectionProps) {
  const { summary, alliances = [], treaties = [], disputes = [], organizations = [] } = data;
  const [activeNode, setActiveNode] = useState<number | null>(null);

  if (alliances.length === 0 && treaties.length === 0 && disputes.length === 0 && organizations.length === 0) return null;

  // Örgüt rolüne göre rozet renk tonu seçici (kurucu üyeler için altın, aktif üyeler için teal, diğerleri nötr)
  const getRoleBadgeStyle = (role: string) => {
    const normalizedRole = role.toLowerCase();
    if (normalizedRole.includes("kurucu") || normalizedRole.includes("founding")) {
      return "bg-atlas-gold/10 border-atlas-gold/20 text-atlas-gold";
    }
    if (normalizedRole.includes("gözlemci") || normalizedRole.includes("observer") || normalizedRole.includes("aday")) {
      return "bg-atlas-text-muted/10 border-atlas-border text-atlas-text-muted";
    }
    return "bg-atlas-teal/10 border-atlas-teal/20 text-atlas-teal";
  };

  // Radyal diyagram için koordinat hesaplama yardımcısı
  const getRadialPosition = (index: number, total: number, radius: number) => {
    if (total === 0) return { x: 0, y: 0 };
    // Açıları radyana çevir (360 dereceyi eşit parçalara böl)
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2; // Üstten başla (-PI/2)
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const radius = 130; // Merkezden uzaklık (piksel)

  return (
    <section id="iliskiler" className="scroll-mt-24 py-16 border-b border-atlas-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Bölüm Başlığı */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <Handshake className="h-6 w-6 text-atlas-gold" />
            <h2 className="atlas-section-title text-2xl md:text-3xl">
              Uluslararası İlişkiler
            </h2>
          </div>
          <div className="atlas-divider" />
          <p className="text-base text-atlas-text-muted leading-relaxed max-w-3xl">
            {summary}
          </p>
        </div>

        {/* Radyal İlişkiler Ağı Görselleştirmesi */}
        {alliances.length > 0 && (
          <div className="mt-16 flex flex-col lg:flex-row items-center justify-center gap-12">
            
            {/* Sol Taraf: İnteraktif Radyal Diyagram */}
            <div className="relative w-[360px] h-[360px] flex items-center justify-center flex-shrink-0 bg-atlas-card/10 rounded-full border border-atlas-border/40 shadow-inner">
              
              {/* Bağlantı Çizgileri (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {alliances.map((_, index) => {
                  const pos = getRadialPosition(index, alliances.length, radius);
                  const cx = 180; // Merkez X
                  const cy = 180; // Merkez Y
                  const targetX = cx + pos.x;
                  const targetY = cy + pos.y;
                  const isActive = activeNode === index;

                  return (
                    <line
                      key={`line-${index}`}
                      x1={cx}
                      y1={cy}
                      x2={targetX}
                      y2={targetY}
                      stroke={isActive ? "#e0a52c" : "#25324f"}
                      strokeWidth={isActive ? 2 : 1}
                      strokeDasharray={isActive ? "none" : "4 4"}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              {/* Merkez Düğüm (Bu Ülke) */}
              <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-atlas-card-light to-atlas-bg border-2 border-atlas-gold flex items-center justify-center shadow-atlas-glow z-20 select-none">
                <span className="text-4xl">{countryFlag}</span>
              </div>

              {/* Çevre Düğümler (Müttefikler / Örgütler) */}
              {alliances.map((alliance, index) => {
                const pos = getRadialPosition(index, alliances.length, radius);
                const isActive = activeNode === index;

                return (
                  <motion.button
                    key={`node-${index}`}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onMouseEnter={() => setActiveNode(index)}
                    onMouseLeave={() => setActiveNode(null)}
                    onClick={() => {
                      setActiveNode(isActive ? null : index);
                      const element = document.getElementById(`alliance-card-${index}`);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "center" });
                      }
                    }}
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px)`,
                    }}
                    className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-center p-1 text-[9px] font-bold border transition-all duration-300 z-20 ${
                      isActive
                        ? "bg-atlas-gold text-atlas-bg border-atlas-gold shadow-atlas-glow scale-110"
                        : "bg-atlas-card border-atlas-border text-atlas-text hover:border-atlas-gold/60"
                    }`}
                    title={`${alliance.partner} (${alliance.relationType})`}
                  >
                    <span className="line-clamp-2 leading-tight">
                      {alliance.partner.split(" ")[0]}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Sağ Taraf: Diyagram Detay Kartı (Hover/Click Durumunda Gösterilir) */}
            <div className="flex-1 w-full min-h-[200px] flex items-center">
              <div className="w-full">
                {activeNode !== null ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="atlas-card border-atlas-gold/40 bg-atlas-card-light/50 p-6"
                  >
                    <span className="inline-flex items-center rounded-full bg-atlas-gold/10 border border-atlas-gold/20 px-2.5 py-0.5 text-[10px] font-semibold text-atlas-gold uppercase tracking-wider mb-3">
                      {alliances[activeNode].relationType}
                    </span>
                    <h4 className="font-atlas-serif text-lg font-bold text-atlas-text">
                      {alliances[activeNode].partner}
                    </h4>
                    {alliances[activeNode].since && (
                      <span className="text-[10px] text-atlas-text-muted block mt-1">
                        Ortaklık Başlangıcı: {alliances[activeNode].since}
                      </span>
                    )}
                    <p className="text-xs text-atlas-text-muted mt-3 leading-relaxed">
                      {alliances[activeNode].description}
                    </p>
                  </motion.div>
                ) : (
                  <div className="atlas-card border-dashed border-atlas-border bg-transparent p-8 text-center flex flex-col items-center justify-center text-atlas-text-muted min-h-[200px]">
                    <HelpCircle className="h-8 w-8 text-atlas-border mb-3 animate-pulse" />
                    <p className="text-sm font-medium">İlişki Detaylarını İnceleyin</p>
                    <p className="text-xs text-atlas-text-muted/60 mt-1 max-w-xs">
                      Diyagramdaki düğümlerin üzerine gelerek veya tıklayarak ortaklık detaylarını görebilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Detaylı İttifaklar ve Üyelikler Listesi */}
        {alliances.length > 0 && (
          <div className="mt-16">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light mb-6 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              İttifaklar ve Üyelikler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alliances.map((alliance, index) => (
                <div
                  key={`${alliance.partner}-${index}`}
                  id={`alliance-card-${index}`}
                  className={`atlas-card p-5 transition-all duration-300 ${
                    activeNode === index ? "border-atlas-gold shadow-atlas-glow/10" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-atlas-text text-sm">
                        {alliance.partner}
                      </h4>
                      {alliance.since && (
                        <span className="text-[10px] text-atlas-text-muted/60 block mt-0.5">
                          {alliance.since} yılından beri
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-atlas-teal/10 border border-atlas-teal/20 px-2 py-0.5 text-[9px] font-semibold text-atlas-teal uppercase tracking-wider">
                      {alliance.relationType}
                    </span>
                  </div>
                  <p className="text-xs text-atlas-text-muted mt-3 leading-relaxed">
                    {alliance.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uluslararası Örgüt Üyelikleri */}
        {organizations.length > 0 && (
          <div className="mt-16">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light mb-6 flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              Uluslararası Örgüt Üyelikleri
            </h3>
            <div className="flex flex-wrap gap-3">
              {organizations.map((org, index) => (
                <motion.div
                  key={`${org.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium ${getRoleBadgeStyle(org.role)}`}
                  title={org.joinedYear ? `${org.joinedYear} yılından beri` : undefined}
                >
                  <span className="font-bold">{org.name}</span>
                  <span className="opacity-70">•</span>
                  <span>{org.role}</span>
                  {org.joinedYear && (
                    <span className="opacity-60">({org.joinedYear})</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Önemli Antlaşmalar */}
        {treaties.length > 0 && (
          <div className="mt-16">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light mb-6 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Önemli Antlaşmalar ve Sözleşmeler
            </h3>
            <div className="space-y-4">
              {treaties.map((treaty, index) => (
                <div
                  key={`${treaty.name}-${index}`}
                  className="atlas-card p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-atlas-teal/50 transition-all duration-300"
                >
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-atlas-text text-sm">
                      {treaty.name}
                    </h4>
                    <p className="text-xs text-atlas-text-muted leading-relaxed">
                      {treaty.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center rounded-lg bg-atlas-card-light border border-atlas-border px-3 py-1.5 text-xs font-bold font-atlas-serif text-atlas-gold-light self-start sm:self-auto">
                    {treaty.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anlaşmazlıklar ve Gerilimler (Varsa Gösterilir) */}
        {disputes.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500/80" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500/80">
                Anlaşmazlıklar ve Gerilimler
              </h3>
            </div>
            <p className="text-xs text-atlas-text-muted/60 italic mb-6">
              Aşağıdaki konular tarafsız bir bakış açısıyla, çok taraflı perspektifler göz önünde bulundurularak ansiklopedik bir dille sunulmuştur.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {disputes.map((dispute, index) => (
                <div
                  key={`${dispute.partner}-${index}`}
                  className="atlas-card border-amber-500/20 bg-amber-500/5 p-5 hover:border-amber-500/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-atlas-text text-sm">
                        {dispute.partner}
                      </h4>
                      {dispute.since && (
                        <span className="text-[10px] text-atlas-text-muted/60 block mt-0.5">
                          Başlangıç: {dispute.since}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-semibold text-amber-500 uppercase tracking-wider">
                      {dispute.relationType}
                    </span>
                  </div>
                  <p className="text-xs text-atlas-text-muted mt-3 leading-relaxed">
                    {dispute.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}