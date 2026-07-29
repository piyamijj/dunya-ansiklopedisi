"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollText, Calendar, Clock } from "lucide-react";
import { TimelineEvent } from "../../../lib/types";

interface HistoryTimelineProps {
  summary: string;
  events: TimelineEvent[];
}

export default function HistoryTimeline({ summary, events = [] }: HistoryTimelineProps) {
  if (events.length === 0) return null;

  return (
    <section id="tarih" className="scroll-mt-24 py-16 border-b border-atlas-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Bölüm Başlığı */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <ScrollText className="h-6 w-6 text-atlas-gold" />
            <h2 className="atlas-section-title text-2xl md:text-3xl">
              Detaylı Tarih
            </h2>
          </div>
          <div className="atlas-divider" />
          <p className="text-base text-atlas-text-muted leading-relaxed max-w-3xl">
            {summary}
          </p>
        </div>

        {/* Zaman Çizelgesi Akışı */}
        <div className="relative mt-16">
          {/* Dikey Çizgi */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-atlas-gold via-atlas-border to-atlas-bg-alt" />

          {/* Olaylar Listesi */}
          <div className="space-y-12">
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={`${event.year}-${index}`}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Zaman Çizelgesi Noktası */}
                  <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-atlas-bg bg-atlas-gold ring-4 ring-atlas-gold/20 z-10" />

                  {/* Kart İçeriği */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full pl-10 md:pl-0 md:w-[calc(50%-2rem)]"
                  >
                    <div className="atlas-card relative group">
                      {/* Dönem ve Yıl Bilgisi */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-atlas-teal/10 px-2.5 py-0.5 text-[10px] font-semibold text-atlas-teal border border-atlas-teal/20">
                          <Clock className="h-3 w-3" />
                          {event.era}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-bold font-atlas-serif text-atlas-gold-light">
                          <Calendar className="h-3.5 w-3.5" />
                          {event.year}
                        </span>
                      </div>

                      {/* Başlık */}
                      <h3 className="font-atlas-serif text-base font-bold text-atlas-text group-hover:text-atlas-gold transition-colors">
                        {event.title}
                      </h3>

                      {/* Açıklama */}
                      <p className="text-xs text-atlas-text-muted mt-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Desktop için Karşı Taraf Boşluk Doldurucu */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}