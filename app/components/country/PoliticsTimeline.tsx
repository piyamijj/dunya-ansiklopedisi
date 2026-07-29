"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Landmark, ChevronLeft, ChevronRight, Calendar, Clock, Shield } from "lucide-react";
import { CountryData, TimelineEvent } from "../../../lib/types";

interface PoliticsTimelineProps {
  data: CountryData["politics"];
}

export default function PoliticsTimeline({ data }: PoliticsTimelineProps) {
  const { summary, governmentForm, currentStructure, timeline = [] } = data;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="siyaset" className="scroll-mt-24 py-16 border-b border-atlas-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Bölüm Başlığı */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <Landmark className="h-6 w-6 text-atlas-gold" />
            <h2 className="atlas-section-title text-2xl md:text-3xl">
              Siyasi Tarih ve Yönetim
            </h2>
          </div>
          <div className="atlas-divider" />
          <p className="text-base text-atlas-text-muted leading-relaxed max-w-3xl">
            {summary}
          </p>
        </div>

        {/* Mevcut Yönetim Yapısı Kartı */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 atlas-card border-l-4 border-l-atlas-gold p-6 md:p-8 bg-gradient-to-r from-atlas-card to-atlas-bg-alt/40"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-atlas-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-atlas-gold" />
                Mevcut Yönetim Biçimi
              </span>
              <h3 className="font-atlas-serif text-lg md:text-xl font-bold text-atlas-gold-light leading-snug">
                {governmentForm}
              </h3>
            </div>
            <div className="space-y-2 border-t border-atlas-border/60 pt-4 md:border-t-0 md:pt-0 md:border-l md:border-atlas-border/60 md:pl-6">
              <span className="text-[10px] font-semibold text-atlas-text-muted uppercase tracking-wider">
                Yönetim Yapısı ve Organlar
              </span>
              <p className="text-xs md:text-sm text-atlas-text-muted leading-relaxed">
                {currentStructure}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Yatay Siyasi Zaman Çizelgesi */}
        {timeline.length > 0 && (
          <div className="mt-16 relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Siyasi Tarihin Dönüm Noktaları
              </h3>
              
              {/* Kaydırma Butonları (Desktop) */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="p-2 rounded-full border border-atlas-border bg-atlas-card text-atlas-text-muted hover:text-atlas-gold hover:border-atlas-gold transition-all duration-200"
                  aria-label="Sola kaydır"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2 rounded-full border border-atlas-border bg-atlas-card text-atlas-text-muted hover:text-atlas-gold hover:border-atlas-gold transition-all duration-200"
                  aria-label="Sağa kaydır"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Yatay Kaydırılabilir Konteyner */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-atlas-border scrollbar-track-transparent"
            >
              {timeline.map((event, index) => (
                <motion.div
                  key={`${event.year}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-center"
                >
                  <div className="atlas-card p-5 h-full flex flex-col justify-between hover:border-atlas-gold/50 transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold font-atlas-serif text-atlas-gold-light">
                          {event.year}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-atlas-teal/10 px-2 py-0.5 text-[9px] font-semibold text-atlas-teal border border-atlas-teal/20">
                          <Clock className="h-2.5 w-2.5" />
                          {event.era}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-atlas-text line-clamp-1">
                        {event.title}
                      </h4>
                      <p className="text-xs text-atlas-text-muted mt-2 leading-relaxed line-clamp-4">
                        {event.description}
                      </p>
                    </div>
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