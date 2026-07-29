import React from "react";
import { Globe } from "lucide-react";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-atlas-border bg-atlas-bg-alt py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 text-atlas-text-muted">
            <Globe className="h-4 w-4 text-atlas-gold" />
            <span className="font-atlas-serif text-sm font-semibold tracking-wide">
              Dünya Ansiklopedisi
            </span>
            <span className="text-xs">© {currentYear}</span>
          </div>

          {/* Main Description */}
          <p className="text-sm text-atlas-text-muted max-w-2xl">
            Dünya Ansiklopedisi — 190'dan fazla ülke hakkında yapay zeka destekli, tarafsız ve detaylı ansiklopedik içerik platformu.
          </p>

          {/* AI Disclaimer */}
          <p className="text-xs text-atlas-text-muted/60 max-w-3xl leading-relaxed">
            Önemli Not: Bu platformda sunulan tüm veriler ve ansiklopedik içerikler yapay zeka modelleri tarafından üretilmiştir ve genel bilgilendirme amaçlıdır. Sınır anlaşmazlıkları, hassas tarihi olaylar ve güncel siyasi durumlar tarafsız bir bakış açısıyla sunulmaya çalışılmıştır. Kesinlik gerektiren durumlar için lütfen resmi diplomatik ve akademik kaynaklara başvurunuz.
          </p>
        </div>
      </div>
    </footer>
  );
}