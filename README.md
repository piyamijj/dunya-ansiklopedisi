# Küresel Ülke Ansiklopedisi Platformu (Dünya Ansiklopedisi)

Bu proje, dünya üzerindeki 190'dan fazla ülkenin detaylı tarihini, ekonomisini, siyasi geçmişini, uluslararası ilişkilerini ve bilimsel gelişmişlik düzeyini kapsayan, yapay zeka destekli ve görsel olarak zenginleştirilmiş interaktif bir web ansiklopedisidir. Ayrıca kullanıcıların herhangi bir ülke hakkında diledikleri soruyu sorup anında detaylı yanıtlar alabildikleri canlı bir yapay zeka soru-cevap (Q&A) özelliğine sahiptir.

---

## 🚀 Teknolojik Altyapı (Tech Stack)

Proje, mobil cihazlarda (Termux) ve bulut sunucularda (Vercel) sorunsuz çalışacak şekilde hafif, modern ve saf JavaScript/React kütüphaneleriyle inşa edilmiştir:

- **Framework:** Next.js 14 (App Router)
- **Dil:** TypeScript
- **Tasarım & Stil:** Tailwind CSS (Özel "Atlas" koyu tema paleti)
- **Animasyonlar:** Framer Motion (Saf JS/React, yerel ikili dosya bağımlılığı yoktur)
- **Veri Görselleştirme:** Recharts (Ekonomi grafikleri ve bilimsel skor kartları için hafif grafik kütüphanesi)
- **İnteraktif Harita:** React Simple Maps & D3-Geo (Saf SVG tabanlı dünya haritası seçici)
- **Yapay Zeka Entegrasyonu:** Google Gemini API (Doğrudan REST fetch() çağrıları ile; Next.js/Vercel derleme süreçlerini bozan ağır Node SDK'ları kullanılmamıştır)

---

## 📂 Proje Yapısı (Project Structure)

```text
dunya-ansiklopedisi/
├── app/                      # Next.js App Router Sayfaları ve Rotaları
│   ├── api/ask/route.ts      # Canlı Yapay Zeka Soru-Cevap API Rotası (REST)
│   ├── components/           # Genel Arayüz Bileşenleri
│   │   ├── country/          # Ülke Detay Sayfası Şablon Bileşenleri
│   │   │   ├── CountryHero.tsx
│   │   │   ├── HistoryTimeline.tsx
│   │   │   ├── EconomyDashboard.tsx
│   │   │   ├── RelationsSection.tsx
│   │   │   ├── PoliticsTimeline.tsx
│   │   │   └── ScienceScorecard.tsx
│   │   ├── CountryGrid.tsx   # Arama ve Filtreleme Özellikli Ülke Izgarası
│   │   ├── HeroSection.tsx   # Ana Sayfa Kahraman Banner'ı
│   │   ├── SiteHeader.tsx    # Sticky Navigasyon Barı (Mobil Uyumlu)
│   │   ├── SiteFooter.tsx    # Bilgi ve Sorumluluk Reddi Beyanı İçeren Alt Bilgi
│   │   └── WorldMapSelector.tsx # İnteraktif SVG Dünya Haritası Seçici
│   ├── sor/page.tsx          # Yapay Zeka Soru-Cevap (Q&A) Sayfası
│   ├── ulke/[kod]/page.tsx   # Dinamik Ülke Detay Şablon Sayfası (SSG)
│   ├── ulkeler/page.tsx      # Tüm Ülkeleri Listeleme ve Filtreleme Sayfası
│   ├── globals.css           # Küresel CSS ve Özel Kaydırma Çubuğu/Kart Stilleri
│   ├── layout.tsx            # Kök Düzen (Root Layout)
│   └── page.tsx              # Ana Sayfa (Giriş, Harita ve Ülke Seçici)
├── data/                     # Yapılandırılmış Veri Klasörü
│   ├── countries/            # Ülkelere Ait Detaylı JSON Verileri (Örn: tr.json)
│   └── countryList.json      # 194 Ülkenin Temel Kimlik Bilgileri (Master Liste)
├── lib/                      # Yardımcı Fonksiyonlar ve Tipler
│   ├── countries.ts          # Sunucu Tarafı Veri Erişim Katmanı (I/O)
│   ├── isoNumericMap.ts      # Harita için ISO Sayısal -> İki Harfli Kod Eşleştirmesi
│   ├── types.ts              # Tüm Platformun TypeScript Tip Tanımlamaları (Şema)
│   └── isoNumericMap.ts      # Harita için ISO Sayısal -> İki Harfli Kod Eşleştirmesi
├── scripts/                  # Build-Time Veri Üretim Betikleri
│   └── generateCountryData.js # Gemini ile Ülke Verilerini Üreten Node Betiği
├── next.config.js            # Next.js Yapılandırması (TS/ESLint Hata Yoksayma Dahil)
├── tailwind.config.ts        # Tailwind CSS Yapılandırması (Özel Renkler ve Animasyonlar)
├── tsconfig.json             # TypeScript Yapılandırması
└── package.json              # Proje Bağımlılıkları ve Betik Tanımlamaları
```

---

## ⚙️ Kurulum ve Çalıştırma (Setup Instructions)

Projeyi yerel ortamınızda veya Termux üzerinde çalıştırmak için aşağıdaki adımları sırasıyla uygulayın:

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Çevre Değişkenlerini Hazırlayın
Proje kök dizinindeki `.env.example` dosyasını `.env.local` adıyla kopyalayın:
```bash
cp .env.example .env.local
```
Ardından `.env.local` dosyasını bir metin editörü (nano, micro vb.) ile açarak `GEMINI_API_KEY` alanına Google AI Studio'dan aldığınız kendi API anahtarınızı yapıştırın:
```bash
nano .env.local
```

### 3. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Sunucu başladıktan sonra tarayıcınızdan `http://localhost:3000` adresine giderek uygulamayı test edebilirsiniz.

---

## 📊 Veri Odaklı Şablon Mimarisi (Data-Driven Template)

190'dan fazla ülkenin her biri için ayrı ayrı statik sayfalar kodlamak yerine, bu projede **Veri Odaklı Şablon (Data-Driven Template)** mimarisi tercih edilmiştir:

1. **Tek Şablon Sayfası:** `app/ulke/[kod]/page.tsx` dosyası, gelen ülke koduna göre dinamik olarak ilgili JSON dosyasını okur ve tek bir görsel şablon üzerinden tüm ülkeleri aynı derinlikte render eder.
2. **Statik Derleme (SSG):** `generateStaticParams()` fonksiyonu sayesinde, sadece `data/countries/` klasöründe JSON dosyası hazır olan ülkeler build-time sırasında statik olarak derlenir. Bu sayede site performansı en üst düzeyde kalır.
3. **Yakında Gelecek Durumu:** Detaylı verisi henüz üretilmemiş bir ülkeye tıklandığında, sistem hata vermek yerine kullanıcıya şık bir "İçerik Hazırlanıyor" sayfası gösterir ve kullanıcıyı o ülke bağlamıyla Yapay Zeka Soru-Cevap sayfasına yönlendirir.

---

## 🧠 Ülke Verisi Üretimi (Data Generation)

`data/countries/` klasöründeki ülke JSON dosyalarını üretmek için Gemini destekli betiği çalıştırabilirsiniz:

```bash
node scripts/generateCountryData.js
```

Bu betik:
- Öncelikle tarihsel/medeniyet açısından önemli ~29 ülkeyi (`scripts/priorityCountries.js`), ardından kalan tüm ülkeleri sırayla işler.
- Daha önce üretilmiş ülkeleri otomatik olarak atlar (yeniden çalıştırmak güvenlidir, kaldığı yerden devam eder).
- Varsayılan olarak her çalıştırmada 15 ülke işler; `--batch-size=20` gibi bir parametreyle bu sayı değiştirilebilir.
- Belirli bir ülkeyi yeniden üretmek için: `node scripts/generateCountryData.js --only=tr,us`

---

## ☁️ Vercel Dağıtımı (Deployment)

Bu proje, yerel Termux ortamında derleme (build) yapma zorunluluğu olmadan doğrudan **Vercel** üzerinde derlenecek şekilde yapılandırılmıştır. 

Vercel, Linux x86_64 altyapısı kullandığı için Next.js'in yerel SWC derleyicisini sorunsuz çalıştırır. Bu nedenle, Termux üzerinde `npm run build` komutunun çalıştırılması zorunlu değildir; kodlarınızı GitHub'a push etmeniz ve Vercel projenize bağlamanız dağıtım için yeterlidir. Dağıtım sırasında Vercel Dashboard üzerinden `GEMINI_API_KEY` çevre değişkenini tanımlamayı unutmayınız.