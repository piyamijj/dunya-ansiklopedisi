"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, AlertCircle, Globe, X } from "lucide-react";

function AskPageContent() {
  const searchParams = useSearchParams();
  const prefilledCountry = searchParams.get("ulke") || "";

  // Form ve Yanıt Durumları
  const [question, setQuestion] = useState("");
  const [countryContext, setCountryContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // URL'den gelen ülke parametresini bağlama eşitle
  useEffect(() => {
    if (prefilledCountry) {
      setCountryContext(prefilledCountry);
    }
  }, [prefilledCountry]);

  // Basit Markdown Kalın Yazı (**kalın**) ve Paragraf Ayrıştırıcı Yardımcı Fonksiyon
  const renderFormattedAnswer = (text: string) => {
    if (!text) return null;

    // Satır sonlarına göre paragraflara böl
    const paragraphs = text.split("\n");

    return paragraphs.map((para, pIdx) => {
      // Boş satırları atla ama yapısal boşluk bırak
      if (!para.trim()) return <div key={`empty-${pIdx}`} className="h-2" />;

      // Paragraf içindeki **kalın** ifadeleri ayrıştır
      const parts = para.split("**");
      
      return (
        <p key={`p-${pIdx}`} className="text-sm text-atlas-text-muted leading-relaxed mb-3">
          {parts.map((part, partIdx) => {
            // Çift indeksler düz metin, tek indeksler kalın metindir
            if (partIdx % 2 === 1) {
              return (
                <strong key={`bold-${partIdx}`} className="text-atlas-gold-light font-semibold">
                  {part}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          countryName: countryContext.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Yapay zeka yanıtı alınırken bir hata oluştu.");
      }

      setAnswer(data.answer);
    } catch (err: any) {
      console.error("Q&A Submit Error:", err);
      setError(
        err.message || "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      {/* Sayfa Başlığı */}
      <div className="text-center flex flex-col items-center space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-atlas-gold/10 px-3 py-1 text-xs font-semibold text-atlas-gold border border-atlas-gold/20">
          <Sparkles className="h-3.5 w-3.5" />
          Yapay Zeka Destekli Asistan
        </div>
        <h1 className="atlas-section-title text-3xl md:text-4xl">
          Yapay Zeka Sor
        </h1>
        <div className="atlas-divider max-w-xs mx-auto" />
        <p className="text-sm md:text-base text-atlas-text-muted max-w-2xl leading-relaxed">
          Herhangi bir ülke hakkında merak ettiğiniz her şeyi sorun — tarih, ekonomi, siyaset, ilişkiler veya bilim, aklınıza takılan her konuda detaylı ve tarafsız yanıt alın.
        </p>
      </div>

      {/* Soru Sorma Formu */}
      <div className="mt-12 atlas-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Bağlam / Ülke Seçimi */}
          <div className="space-y-2">
            <label htmlFor="country-context" className="block text-xs font-semibold uppercase tracking-wider text-atlas-text-muted">
              Ülke Bağlamı (İsteğe Bağlı)
            </label>
            
            <div className="relative">
              <input
                id="country-context"
                type="text"
                value={countryContext}
                onChange={(e) => setCountryContext(e.target.value)}
                placeholder="örn. Türkiye, Japonya, Brezilya..."
                className="w-full rounded-xl border border-atlas-border bg-atlas-bg-alt/50 py-2.5 px-4 text-sm text-atlas-text placeholder-atlas-text-muted/50 focus:border-atlas-gold focus:outline-none focus:ring-1 focus:ring-atlas-gold transition-all duration-300"
              />
              
              {countryContext && (
                <button
                  type="button"
                  onClick={() => setCountryContext("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-atlas-text-muted hover:text-atlas-gold hover:bg-atlas-card transition-all"
                  title="Bağlamı temizle"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-atlas-text-muted/60">
              Belirli bir ülkeye odaklanmak istiyorsanız buraya adını yazabilirsiniz. Yapay zeka yanıtını bu ülkeye göre özelleştirecektir.
            </p>
          </div>

          {/* Soru Metni */}
          <div className="space-y-2">
            <label htmlFor="question-input" className="block text-xs font-semibold uppercase tracking-wider text-atlas-text-muted">
              Sorunuz
            </label>
            <textarea
              id="question-input"
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Örneğin: Türkiye'nin Avrupa Birliği ile ilişkisinin tarihi nasıl gelişti?"
              className="w-full rounded-xl border border-atlas-border bg-atlas-bg-alt/50 py-3 px-4 text-sm text-atlas-text placeholder-atlas-text-muted/50 focus:border-atlas-gold focus:outline-none focus:ring-1 focus:ring-atlas-gold transition-all duration-300 resize-none"
              required
            />
          </div>

          {/* Gönder Butonu */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-atlas-gold text-atlas-bg font-semibold text-sm hover:bg-atlas-gold-light hover:shadow-atlas-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Düşünülüyor...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Yanıt Al
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Yanıt ve Hata Alanı */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {/* Hata Durumu */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="atlas-card border-red-500/20 bg-red-500/5 p-5 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-red-400">İşlem Başarısız</h4>
                <p className="text-xs text-atlas-text-muted leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Yapay Zeka Yanıtı */}
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="atlas-card border-atlas-gold/30 bg-gradient-to-b from-atlas-card to-atlas-bg-alt/40 p-6 md:p-8 shadow-atlas-glow/5"
            >
              <div className="flex items-center gap-2 border-b border-atlas-border/60 pb-4 mb-6">
                <div className="p-2 rounded-lg bg-atlas-gold/10 border border-atlas-gold/20">
                  <Globe className="h-4 w-4 text-atlas-gold" />
                </div>
                <div>
                  <h3 className="font-atlas-serif text-base font-bold text-atlas-text">
                    Yapay Zeka Yanıtı
                  </h3>
                  <p className="text-[10px] text-atlas-text-muted/60">
                    Dünya Ansiklopedisi Yapay Zeka Modeli tarafından üretilmiştir
                  </p>
                </div>
              </div>

              {/* Biçimlendirilmiş Yanıt Metni */}
              <div className="space-y-1">
                {renderFormattedAnswer(answer)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Alt Bilgi / Feragatname */}
      <p className="text-[10px] text-atlas-text-muted/40 text-center mt-12 leading-relaxed max-w-xl mx-auto">
        Önemli Not: Yapay zeka asistanı tarafından üretilen yanıtlar genel bilgilendirme amaçlıdır. Sınır anlaşmazlıkları, hassas tarihi olaylar ve güncel siyasi durumlar tarafsız bir bakış açısıyla sunulmaya çalışılmaktadır. Kesinlik gerektiren durumlar için lütfen resmi diplomatik ve akademik kaynaklara başvurunuz.
      </p>
    </div>
  );
}

export default function AskPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-atlas-gold animate-spin" />
      </div>
    }>
      <AskPageContent />
    </Suspense>
  );
}