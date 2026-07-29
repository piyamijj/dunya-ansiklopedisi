"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Briefcase, Landmark, Calendar } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { CountryData } from "../../../lib/types";

interface EconomyDashboardProps {
  data: CountryData["economy"];
}

export default function EconomyDashboard({ data }: EconomyDashboardProps) {
  const { summary, indicators = [], majorIndustries = [], chartSeries = [], historicalMilestones = [] } = data;

  return (
    <section id="ekonomi" className="scroll-mt-24 py-16 border-b border-atlas-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Bölüm Başlığı */}
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <TrendingUp className="h-6 w-6 text-atlas-gold" />
            <h2 className="atlas-section-title text-2xl md:text-3xl">
              Geçmiş ve Mevcut Ekonomi
            </h2>
          </div>
          <div className="atlas-divider" />
          <p className="text-base text-atlas-text-muted leading-relaxed max-w-3xl">
            {summary}
          </p>
        </div>

        {/* Temel Göstergeler Izgarası */}
        <div className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light mb-4 flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            Temel Ekonomik Göstergeler
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {indicators.map((indicator, index) => (
              <motion.div
                key={`${indicator.label}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="atlas-card p-4 flex flex-col justify-between min-h-[110px]"
              >
                <span className="text-[10px] font-semibold text-atlas-text-muted uppercase tracking-wider line-clamp-1">
                  {indicator.label}
                </span>
                <div className="mt-2">
                  <span className="text-lg md:text-xl font-bold font-atlas-serif text-atlas-gold-light">
                    {indicator.value}
                  </span>
                  {indicator.unit && (
                    <span className="text-xs text-atlas-text-muted ml-1">
                      {indicator.unit}
                    </span>
                  )}
                </div>
                {indicator.year && (
                  <span className="text-[9px] text-atlas-text-muted/40 mt-1 block">
                    Veri Yılı: {indicator.year}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Başlıca Sektörler */}
        {majorIndustries.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Başlıca Sektörler
            </h3>
            <div className="flex flex-wrap gap-2">
              {majorIndustries.map((industry, index) => (
                <span
                  key={`${industry}-${index}`}
                  className="inline-flex items-center rounded-full bg-atlas-teal/10 border border-atlas-teal/20 px-3 py-1 text-xs font-medium text-atlas-teal"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grafik ve Zaman Serisi Bölümü */}
        {chartSeries.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6">
            {chartSeries.map((series, index) => (
              <motion.div
                key={`${series.name}-${index}`}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="atlas-card p-6"
              >
                <h4 className="text-sm font-bold text-atlas-text mb-6 flex items-center justify-between">
                  <span>{series.name}</span>
                  <span className="text-xs font-normal text-atlas-text-muted">
                    Birim: {series.unit}
                  </span>
                </h4>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={series.data}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#25324f" />
                      <XAxis
                        dataKey="year"
                        stroke="#8b96b3"
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#8b96b3"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "#131c31",
                          borderColor: "#25324f",
                          borderRadius: "8px",
                          color: "#e8ecf5",
                        }}
                        labelStyle={{ color: "#e0a52c", fontWeight: "bold" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#e0a52c"
                        strokeWidth={2.5}
                        dot={{ fill: "#e0a52c", stroke: "#131c31", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Ekonomik Dönüm Noktaları */}
        {historicalMilestones.length > 0 && (
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-atlas-gold-light mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ekonomik Dönüm Noktaları
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-atlas-border scrollbar-track-transparent">
              {historicalMilestones.map((milestone, index) => (
                <div
                  key={`${milestone.year}-${index}`}
                  className="atlas-card p-4 min-w-[280px] max-w-[320px] flex-shrink-0 flex flex-col justify-between hover:border-atlas-teal/50 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold font-atlas-serif text-atlas-gold-light">
                        {milestone.year}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-atlas-text-muted/60 bg-atlas-card-light px-1.5 py-0.5 rounded border border-atlas-border">
                        {milestone.era}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-atlas-text line-clamp-1">
                      {milestone.title}
                    </h4>
                    <p className="text-xs text-atlas-text-muted mt-2 leading-relaxed line-clamp-3">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}