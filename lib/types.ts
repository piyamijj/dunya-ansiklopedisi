/**
 * Küresel Ülke Ansiklopedisi Platformu - Veri Şeması ve Tip Tanımlamaları
 * 
 * Bu dosya, platform genelinde kullanılan tüm yapılandırılmış ülke verilerinin
 * TypeScript tiplerini tanımlar. Hem Next.js şablon bileşenleri hem de build-time
 * veri üretim betiği (Gemini veri üretici) bu tipleri temel alır.
 */

/**
 * Ülke Listesi Elemanı (data/countryList.json içindeki her bir kayıt)
 */
export interface CountryListItem {
  /** ISO 3166-1 alpha-2 ülke kodu (küçük harf, örn: "tr", "us", "de") */
  code: string;
  /** ISO 3166-1 alpha-3 ülke kodu (büyük harf, örn: "TUR", "USA", "DEU") */
  iso3: string;
  /** Ülkenin Türkçe yaygın adı (örn: "Türkiye", "Almanya", "Güney Kore") */
  name_tr: string;
  /** Ülkenin İngilizce yaygın adı (örn: "Turkey", "Germany", "South Korea") */
  name_en: string;
  /** Coğrafi bölge (örn: "Avrupa", "Asya", "Afrika", "Kuzey Amerika", "Güney Amerika", "Okyanusya") */
  region: string;
  /** Başkent adı (Türkçe yaygın kullanımı varsa o, örn: "Londra", "Roma", "Pekin") */
  capital_tr: string;
  /** Ülkenin Unicode bayrak emojisi (örn: "🇹🇷") */
  flag_emoji: string;
}

/**
 * Tarihsel veya Siyasal Zaman Çizelgesi Olayı
 */
export interface TimelineEvent {
  /** Olayın yılı veya yıl aralığı (örn: "1923", "1919-1923", "M.Ö. 500", "M.S. 1453") */
  year: string;
  /** Olayın kısa başlığı (Türkçe) */
  title: string;
  /** Olayın detaylı ansiklopedik açıklaması (Türkçe) */
  description: string;
  /** Olayın ait olduğu geniş dönem etiketi (örn: "Antik Dönem", "Orta Çağ", "Modern Dönem", "Cumhuriyet Dönemi") */
  era: string;
}

/**
 * Temel Ekonomik Gösterge
 */
export interface EconomyIndicator {
  /** Gösterge adı (örn: "GSYİH (Nominal)", "Kişi Başına GSYİH", "Enflasyon Oranı", "Para Birimi") */
  label: string;
  /** Gösterge değeri (örn: "900 Milyar", "10,500", "8.5", "Türk Lirası (TRY)") */
  value: string;
  /** Değer birimi (örn: "USD", "%", "TRY", "Milyon") */
  unit?: string;
  /** Verinin ait olduğu yıl (örn: "2025", "2026") */
  year?: string;
}

/**
 * Zaman Serisi Grafik Veri Noktası
 */
export interface EconomyChartPoint {
  /** Yıl (örn: "2015", "2020", "2025") */
  year: string;
  /** Sayısal değer (grafik çizimi için) */
  value: number;
}

/**
 * Ekonomik Zaman Serisi Grafik Serisi
 */
export interface EconomyChartSeries {
  /** Serinin adı (örn: "GSYİH Büyüme Oranı", "Enflasyon Trendi") */
  name: string;
  /** Değerlerin birimi (örn: "%", "Milyar USD") */
  unit: string;
  /** Zaman serisi veri noktaları */
  data: EconomyChartPoint[];
}

/**
 * Uluslararası İlişkiler (İkili veya Çok Taraflı İlişki)
 */
export interface InternationalRelation {
  /** İlişki kurulan ortak (ülke adı veya uluslararası örgüt, örn: "Avrupa Birliği", "ABD", "NATO") */
  partner: string;
  /** İlişki türü (örn: "Müttefik", "Ticaret Ortağı", "Üyelik", "Anlaşmazlık", "Tarihi İttifak") */
  relationType: "Ittifak" | "Ticaret Ortagi" | "Uyelik" | "Anlasmazlik" | "Tarihi Ittifak" | string;
  /** İlişkinin niteliği, kapsamı ve güncel durumuna dair detaylı açıklama (Türkçe) */
  description: string;
  /** İlişkinin veya üyeliğin başlangıç yılı (örn: "1952") */
  since?: string;
}

/**
 * Uluslararası Örgüt Üyeliği
 */
export interface OrganizationMembership {
  /** Örgütün adı (örn: "NATO", "Avrupa Birliği", "Birleşmiş Milletler", "İslam İşbirliği Teşkilatı", "G20", "G7", "Afrika Birliği", "ASEAN", "BRICS", "Arap Ligi", "Milletler Topluluğu") */
  name: string;
  /** Ülkenin örgütteki rolü/statüsü (örn: "Kurucu Üye", "Aktif Üye", "Gözlemci Üye", "Aday Ülke", "Ortak Üye") */
  role: string;
  /** Üyeliğin başladığı yıl (biliniyorsa) */
  joinedYear?: string;
}

/**
 * Önemli Uluslararası Antlaşma veya Sözleşme
 */
export interface Treaty {
  /** Antlaşmanın adı (örn: "Lozan Barış Antlaşması", "Schengen Anlaşması") */
  name: string;
  /** İmzalandığı veya yürürlüğe girdiği yıl (örn: "1923") */
  year: string;
  /** Antlaşmanın önemi ve ülke için sonuçlarına dair açıklama (Türkçe) */
  description: string;
}

/**
 * Bilimsel ve Teknolojik Gösterge
 */
export interface ScienceIndicator {
  /** Gösterge adı (örn: "Ar-Ge Harcamalarının GSYİH'ye Oranı", "Milyon Kişi Başına Araştırmacı", "Yıllık Patent Başvurusu") */
  label: string;
  /** Gösterge değeri (örn: "1.4", "2,500", "12,450") */
  value: string;
  /** Değer birimi (örn: "%", "Kişi", "Adet") */
  unit?: string;
  /** Görsel skor kartı için 100 üzerinden normalize edilmiş puan (0-100 arası, örn: 75) */
  scoreOutOf100?: number;
}

/**
 * Önemli Bilimsel/Akademik Kurum veya Kuruluş
 */
export interface Institution {
  /** Kurumun adı (örn: "TÜBİTAK", "Boğaziçi Üniversitesi", "CERN (Üye)") */
  name: string;
  /** Kurum türü (örn: "Üniversite", "Araştırma Enstitüsü", "Uzay Ajansı", "Teknopark") */
  type: "Universite" | "Arastirma Enstitusu" | "Uzay Ajansi" | "Teknopark" | string;
  /** Kurumun başarıları, odak alanları ve bilimsel duruşuna dair açıklama (Türkçe) */
  description: string;
}

/**
 * Tek Bir Ülkeye Ait Tüm Yapılandırılmış Ansiklopedik Veri Şeması
 * (data/countries/[kod].json dosyalarının tam yapısı)
 */
export interface CountryData {
  /** Ülkenin temel kimlik bilgileri (master listeden kopyalanır) */
  meta: CountryListItem;
  
  /** Ülke hakkında genel, 2-4 cümlelik özetleyici ansiklopedik giriş metni */
  overview: string;

  /** (1) Detaylı Tarih Bölümü */
  history: {
    /** Ülke tarihinin genel özeti (Türkçe) */
    summary: string;
    /** Antik çağlardan günümüze uzanan detaylı tarih zaman çizelgesi (8-14 olay) */
    timeline: TimelineEvent[];
  };

  /** (2) Geçmiş ve Mevcut Ekonomi Bölümü */
  economy: {
    /** Ülke ekonomisinin genel yapısı, tarihsel gelişimi ve bugünkü durumunun özeti */
    summary: string;
    /** Temel ekonomik göstergeler (GSYİH, Kişi Başı GSYİH, Para Birimi, İşsizlik vb., 6-10 adet) */
    indicators: EconomyIndicator[];
    /** Başlıca sanayi ve hizmet sektörleri (örn: ["Otomotiv", "Turizm", "Tarım Teknolojileri"]) */
    majorIndustries: string[];
    /** Ekonomik büyüme veya gelişim trendini gösteren zaman serisi verileri (1-2 seri) */
    chartSeries: EconomyChartSeries[];
    /** Ülke ekonomisinin dönüm noktaları (ekonomik krizler, reformlar, sanayileşme hamleleri, 4-8 olay) */
    historicalMilestones: TimelineEvent[];
  };

  /** (3) Uluslararası İlişkiler Bölümü */
  relations: {
    /** Ülkenin dış politika vizyonu ve genel diplomatik duruşunun özeti */
    summary: string;
    /** Önemli ikili müttefikler ve uluslararası örgüt üyelikleri (4-8 adet) */
    alliances: InternationalRelation[];
    /** Ülkenin imzaladığı veya kurucu ortağı olduğu kritik antlaşmalar (3-6 adet) */
    treaties: Treaty[];
    /** Varsa sınır anlaşmazlıkları, diplomatik krizler veya gerilimler (boş dizi olabilir) */
    disputes: InternationalRelation[];
    /** Ülkenin üye olduğu uluslararası örgütler ve bu örgütlerdeki rolü (NATO, AB, BM, İİT, G20, G7, Afrika Birliği, ASEAN, BRICS, Arap Ligi, Milletler Topluluğu vb. - ülkeye uygun olanlar, 3-8 adet) */
    organizations: OrganizationMembership[];
  };

  /** (4) Geçmiş ve Mevcut Siyasi Tarih Bölümü */
  politics: {
    /** Ülkenin siyasi tarihinin ve yönetim kültürünün genel özeti */
    summary: string;
    /** Mevcut yönetim biçimi (örn: "Cumhurbaşkanlığı Sistemi ile Yönetilen Üniter Cumhuriyet") */
    governmentForm: string;
    /** Yürütme, yasama ve yargı organlarının yapısını açıklayan kısa metin */
    currentStructure: string;
    /** Siyasi tarihteki büyük kırılmalar, anayasa değişiklikleri, rejim geçişleri (8-14 olay) */
    timeline: TimelineEvent[];
  };

  /** (5) Bilimsel Araştırma Düzeyi ve Akademik Durum Bölümü */
  science: {
    /** Ülkenin bilim, teknoloji, inovasyon ve akademik araştırma kapasitesinin özeti */
    summary: string;
    /** Ar-Ge yatırımları, patent sayıları, yayın sıralamaları gibi göstergeler (5-8 adet) */
    indicators: ScienceIndicator[];
    /** Ülkenin dünya bilim tarihine kazandırdığı veya öncülük ettiği önemli başarılar (4-8 adet) */
    notableAchievements: string[];
    /** Ülkedeki en prestijli üniversiteler, araştırma merkezleri veya uzay ajansları (3-6 adet) */
    institutions: Institution[];
  };

  /** Verinin üretildiği zaman damgası (ISO formatında, örn: "2026-07-29T20:09:00.000Z") */
  generatedAt: string;
}

/**
 * Gemini Yapay Zeka Modelinden Talep Edilen JSON Şeması Tipi.
 * (CountryData tipinden 'meta' ve 'generatedAt' alanları çıkarılmıştır,
 * çünkü bu alanlar veri üretim betiği tarafından otomatik olarak eklenecektir.)
 */
export type GeminiCountryPromptSchema = Omit<CountryData, "meta" | "generatedAt">;