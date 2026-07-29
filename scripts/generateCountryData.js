/**
 * Küresel Ülke Ansiklopedisi Platformu - Yapılandırılmış Veri Üretim Betiği
 * 
 * Bu betik, Google Gemini API'sini doğrudan REST üzerinden çağırarak dünya ülkeleri
 * için detaylı, yapılandırılmış ansiklopedik verileri (.json) üretir.
 * 
 * ÖNEMLİ ÖZELLİKLER:
 * 1. Resumable (Kaldığı Yerden Devam Edebilir): Daha önce üretilmiş ülkeleri otomatik
 *    olarak atlar, böylece yarıda kesilirse kaldığı yerden devam eder.
 * 2. Öncelikli Sıralama: Tarihsel ve medeniyet açısından kritik öneme sahip ~29 ülkeyi
 *    ilk çalıştırmada öncelikli olarak işler, ardından diğer ülkelere geçer.
 * 3. Bağımsız Çalışma: Node.js yerleşik modülleri ve yerleşik fetch() API'si dışında
 *    hiçbir harici npm paketine (dotenv vb.) ihtiyaç duymaz.
 * 4. Güvenli REST Çağrısı: Next.js derleme süreçlerini bozan ağır Google SDK'ları yerine
 *    doğrudan fetch() ile REST API çağrısı yapar ve Gemini'ın resmi JSON modunu kullanır.
 */

const fs = require("fs");
const pathMod = require("path");

// Node.js Sürüm Kontrolü (fetch API desteği için Node 18+ gereklidir)
if (typeof global.fetch !== "function") {
  console.error("\x1b[31m%s\x1b[0m", "HATA: Yerleşik 'fetch' API'si bulunamadı.");
  console.error("Bu betik Node.js 18 veya daha yeni bir sürüm gerektirir.");
  console.error(`Mevcut Node.js sürümünüz: ${process.version}`);
  console.error("Lütfen Node.js sürümünüzü güncelleyin veya Termux'ta 'pkg upgrade nodejs' çalıştırın.");
  process.exit(1);
}

// .env.local Dosyasını El Yordamıyla Ayrıştırma (Harici dotenv paketi gerektirmemesi için)
function loadLocalEnv() {
  try {
    const envPath = pathMod.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const lines = content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.substring(0, eqIdx).trim();
          const val = trimmed.substring(eqIdx + 1).trim();
          // Eğer ortam değişkeni zaten set edilmemişse .env.local'den yükle
          if (!process.env[key]) {
            // Varsa tırnak işaretlerini temizle
            process.env[key] = val.replace(/^['"]|['"]$/g, "");
          }
        }
      }
    }
  } catch (err) {
    console.warn("Uyarı: .env.local dosyası okunurken bir hata oluştu, ortam değişkenleri yüklenemedi:", err.message);
  }
}

// Çevre değişkenlerini yükle
loadLocalEnv();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("\x1b[31m%s\x1b[0m", "HATA: GEMINI_API_KEY bulunamadı.");
  console.error("Lütfen proje kök dizininde .env.local dosyası oluşturup anahtarınızı ekleyin:");
  console.error("GEMINI_API_KEY=your_api_key_here");
  console.error("\nAlternatif olarak terminalinizde şu komutla geçici olarak tanımlayabilirsiniz:");
  console.error("export GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

// Gemini REST API Yapılandırması
const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

// CLI Argümanlarını Ayrıştırma (Basit Eşleştirme)
let batchSize = 15; // Varsayılan batch boyutu
let forceOnlyCodes = null; // --only=tr,us gibi zorunlu çalıştırma listesi

process.argv.forEach((arg) => {
  if (arg.startsWith("--batch-size=")) {
    const parsedSize = parseInt(arg.split("=")[1], 10);
    if (!isNaN(parsedSize) && parsedSize > 0) {
      batchSize = parsedSize;
    }
  } else if (arg.startsWith("--only=")) {
    const codesStr = arg.split("=")[1];
    if (codesStr) {
      forceOnlyCodes = codesStr.split(",").map((c) => c.trim().toLowerCase());
    }
  }
});

// Yardımcı Gecikme Fonksiyonu (Rate Limit aşımını önlemek için)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ana Veri Üretim Fonksiyonu
 */
async function main() {
  try {
    // 1. Master Ülke Listesini ve Öncelikli Ülkeleri Yükle
    const listPath = pathMod.join(process.cwd(), "data", "countryList.json");
    const priorityPath = pathMod.join(process.cwd(), "scripts", "priorityCountries.js");

    if (!fs.existsSync(listPath)) {
      console.error("\x1b[31m%s\x1b[0m", `HATA: Master ülke listesi bulunamadı: ${listPath}`);
      process.exit(1);
    }

    const countriesList = JSON.parse(fs.readFileSync(listPath, "utf-8"));
    let priorityCodes = [];
    if (fs.existsSync(priorityPath)) {
      priorityCodes = require(priorityPath).PRIORITY_COUNTRY_CODES || [];
    }

    // Hedef klasörü oluştur
    const outputDir = pathMod.join(process.cwd(), "data", "countries");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 2. İşlem Kuyruğunu (Queue) İnşa Et
    let queue = [];

    if (forceOnlyCodes) {
      // Eğer --only parametresi verilmişse, sadece o ülkeleri sıraya al (mevcut olsalar bile zorla üret)
      queue = forceOnlyCodes.filter(code => countriesList.some(c => c.code.toLowerCase() === code));
      console.log(`\x1b[33m%s\x1b[0m`, `Zorunlu Çalıştırma Modu: Sadece şu ${queue.length} ülke işlenecek: ${queue.join(", ")}`);
    } else {
      // Normal Mod: Önce öncelikli ülkeler, sonra kalanlar
      const allCodes = countriesList.map((c) => c.code.toLowerCase());
      
      // Öncelikli listedekileri sıraya ekle
      priorityCodes.forEach((code) => {
        const lower = code.toLowerCase();
        if (allCodes.includes(lower) && !queue.includes(lower)) {
          queue.push(lower);
        }
      });

      // Kalan diğer tüm ülkeleri sıraya ekle
      allCodes.forEach((code) => {
        if (!queue.includes(code)) {
          queue.push(code);
        }
      });

      // Zaten üretilmiş olan dosyaları kuyruktan çıkar (Resumable/Incremental özelliği)
      const totalBeforeFiltering = queue.length;
      queue = queue.filter((code) => {
        const filePath = pathMod.join(outputDir, `${code}.json`);
        return !fs.existsSync(filePath);
      });

      const completedCount = totalBeforeFiltering - queue.length;
      console.log(`\x1b[32m%s\x1b[0m`, `İlerleme Durumu: 194 ülkeden ${completedCount} tanesi zaten hazır.`);
    }

    // Kuyruk boşsa tamamlandı mesajı ver ve çık
    if (queue.length === 0) {
      console.log("\x1b[32m%s\x1b[0m", "Tüm ülkeler için veri zaten üretilmiş! 🎉 Yapılacak başka bir şey yok.");
      process.exit(0);
    }

    // 3. Bu Çalıştırmadaki Batch'i Belirle
    const currentBatch = queue.slice(0, batchSize);
    const remainingInQueue = queue.length - currentBatch.length;

    console.log("\n==================================================");
    console.log(`\x1b[36m%s\x1b[0m`, `YENİ BATCH BAŞLATILIYOR (Boyut: ${currentBatch.length})`);
    console.log(`Sırada bekleyen toplam ülke: ${queue.length}`);
    console.log(`Bu çalıştırmada işlenecek: ${currentBatch.map(c => c.toUpperCase()).join(", ")}`);
    
    // Tahmini süre hesabı (ortalama 10 saniye API çağrısı + 2 saniye gecikme = 12 saniye/ülke)
    const estMin = Math.ceil((currentBatch.length * 12) / 60);
    console.log(`Tahmini tamamlanma süresi: ~${estMin} dakika`);
    console.log("==================================================\n");

    let successCount = 0;
    let failCount = 0;
    const failedCountries = [];

    // 4. Batch Döngüsü (Sıralı İşleme - Rate Limit Dostu)
    for (let i = 0; i < currentBatch.length; i++) {
      const code = currentBatch[i];
      const countryMeta = countriesList.find((c) => c.code.toLowerCase() === code);
      const progressStr = `[${i + 1}/${currentBatch.length}]`;

      console.log(`\x1b[33m%s\x1b[0m`, `${progressStr} ${countryMeta.name_tr} (${countryMeta.name_en}) için veri üretiliyor...`);

      try {
        // Gemini için detaylı Türkçe prompt inşası
        const prompt = `Sana temel bilgileri verilen ülke hakkında, belirtilen JSON şemasına birebir uyan, son derece detaylı, ansiklopedik ve tarafsız bir veri seti üretmelisin.

ÜLKE BİLGİLERİ:
- Türkçe Adı: ${countryMeta.name_tr}
- İngilizce Adı: ${countryMeta.name_en}
- Başkent: ${countryMeta.capital_tr}
- Coğrafi Bölge: ${countryMeta.region}
- ISO Kodu: ${countryMeta.code.toUpperCase()} / ${countryMeta.iso3}

LÜTFEN ŞU KURALLARA KESİNLİKLE UY:
1. Tüm metinsel içerikleri, açıklamaları, başlıkları ve özetleri akıcı, akademik ve saygın bir TÜRKÇE ile yaz. Türkçe imla kurallarına ve diyakritik işaretlere (ş, ç, ğ, ı, ü, ö) tam olarak dikkat et.
2. Hassas tarihi olaylar, sınır anlaşmazlıkları, diplomatik krizler veya siyasi rejimler hakkında yazarken KESİNLİKLE tarafsız, nesnel ve ansiklopedik bir dil kullan. Herhangi bir tarafı övme veya yerme; birden fazla bakış açısı varsa bunları dengeli bir şekilde sun.
3. JSON şemasındaki tüm alanları eksiksiz doldur. "TBD", "bilinmiyor", "yakında" gibi geçici ifadeler KULLANMA. Gerçekçi, tarihsel ve ekonomik olarak tutarlı veriler üret.
4. Sayısal göstergeler için (ekonomi ve bilim alanlarında) 2024-2026 yılları arasındaki güncel veya gerçekçi tahmin verilerini kullan.

ÜRETİLECEK JSON ŞEMASI (Bu şemaya birebir uymalıdır):
{
  "overview": "Ülke hakkında genel, coğrafi konumunu, önemini ve yapısını özetleyen 3-4 cümlelik ansiklopedik giriş metni.",
  "history": {
    "summary": "Ülke tarihinin antik çağlardan günümüze genel özeti.",
    "timeline": [
      {
        "year": "Olayın yılı veya aralığı (örn: '1923', 'M.Ö. 500', '1914-1918')",
        "title": "Olayın kısa Türkçe başlığı",
        "description": "Olayın detaylı açıklaması (2-3 cümle)",
        "era": "Geniş dönem etiketi (örn: 'Antik Dönem', 'Orta Çağ', 'Modern Dönem')"
      }
      // En az 8, en fazla 14 önemli tarihsel olay ekle. Antik/kuruluş döneminden modern güne kadar dengeli dağılsın.
    ]
  },
  "economy": {
    "summary": "Ülke ekonomisinin genel yapısı, tarihsel gelişimi ve bugünkü durumunun özeti.",
    "indicators": [
      {
        "label": "Gösterge adı (örn: 'GSYİH (Nominal)', 'Kişi Başına GSYİH', 'Enflasyon Oranı', 'Para Birimi', 'İşsizlik Oranı', 'Yıllık İhracat')",
        "value": "Gösterge değeri (örn: '1.1 Trilyon', '12,800', '38.5', 'Türk Lirası (TRY)')",
        "unit": "Değer birimi (örn: 'USD', '%', 'TRY', 'Milyar USD')",
        "year": "Verinin ait olduğu yıl (örn: '2025')"
      }
      // En az 6, en fazla 10 temel ekonomik gösterge ekle.
    ],
    "majorIndustries": [
      "Başlıca sanayi/hizmet sektörü 1", "Sektör 2" // En az 5, en fazla 8 sektör adı
    ],
    "chartSeries": [
      {
        "name": "Grafik serisi adı (örn: 'GSYİH Yıllık Büyüme Oranı' veya 'Enflasyon Trendi')",
        "unit": "Değerlerin birimi (örn: '%')",
        "data": [
          { "year": "Yıl (örn: '2018')", "value": 3.1 },
          { "year": "Yıl (örn: '2019')", "value": 1.5 }
          // 2018-2025 yılları arasındaki trendi gösteren en az 6, en fazla 8 yıllık veri noktası ekle (sayısal değerler float/int olmalıdır).
        ]
      }
    ],
    "historicalMilestones": [
      {
        "year": "Yıl veya dönem",
        "title": "Ekonomik dönüm noktasının başlığı",
        "description": "Dönüm noktasının açıklaması (örn: sanayileşme hamlesi, büyük kriz, reform)",
        "era": "Dönem etiketi"
      }
      // En az 4, en fazla 8 ekonomik dönüm noktası ekle.
    ]
  },
  "relations": {
    "summary": "Ülkenin dış politika vizyonu ve genel diplomatik duruşunun özeti.",
    "alliances": [
      {
        "partner": "İlişki kurulan ortak veya örgüt (örn: 'NATO', 'Avrupa Birliği', 'ABD')",
        "relationType": "İlişki türü (örn: 'Müttefik', 'Üyelik', 'Ticaret Ortağı')",
        "description": "İlişkinin niteliği ve güncel durumuna dair detaylı açıklama.",
        "since": "Başlangıç yılı (isteğe bağlı)"
      }
      // En az 4, en fazla 8 önemli ikili müttefik veya örgüt üyeliği ekle.
    ],
    "treaties": [
      {
        "name": "Antlaşmanın adı",
        "year": "İmzalandığı yıl",
        "description": "Antlaşmanın önemi ve ülke için sonuçlarına dair açıklama."
      }
      // En az 3, en fazla 6 kritik antlaşma ekle.
    ],
    "disputes": [
      {
        "partner": "Anlaşmazlık konusu veya muhatap taraf",
        "relationType": "Anlasmazlik",
        "description": "Anlaşmazlığın arka planı ve güncel durumu (tamamen tarafsız ve nesnel dille yazılmalıdır).",
        "since": "Başlangıç yılı (isteğe bağlı)"
      }
      // Varsa sınır anlaşmazlıkları veya diplomatik krizler (boş dizi [] olabilir).
    ],
    "organizations": [
      {
        "name": "Örgütün adı (örn: 'NATO', 'Avrupa Birliği', 'Birleşmiş Milletler', 'İslam İşbirliği Teşkilatı', 'G20', 'G7', 'Afrika Birliği', 'ASEAN', 'BRICS', 'Arap Ligi', 'Milletler Topluluğu')",
        "role": "Ülkenin örgütteki rolü (örn: 'Kurucu Üye', 'Aktif Üye', 'Gözlemci Üye', 'Aday Ülke')",
        "joinedYear": "Üyeliğin başladığı yıl (biliniyorsa, isteğe bağlı)"
      }
      // Ülkenin GERÇEKTEN üye olduğu uluslararası örgütleri ekle (NATO, AB, BM, İİT, G20, G7, Afrika Birliği, ASEAN, BRICS, Arap Ligi, Milletler Topluluğu vb. arasından ülkeye uygun olanları seç). En az 3, en fazla 8 örgüt ekle. Uydurma örgüt adı KULLANMA, sadece ülkenin fiilen üye olduğu gerçek örgütleri listele.
    ]
  },
  "politics": {
    "summary": "Ülkenin siyasi tarihinin ve yönetim kültürünün genel özeti.",
    "governmentForm": "Mevcut yönetim biçimi (örn: 'Cumhurbaşkanlığı Hükümet Sistemi ile Yönetilen Üniter Cumhuriyet')",
    "currentStructure": "Yürütme, yasama ve yargı organlarının yapısını açıklayan kısa metin.",
    "timeline": [
      {
        "year": "Yıl veya dönem",
        "title": "Siyasi olayın başlığı",
        "description": "Siyasi kırılma, anayasa değişikliği veya rejim geçişinin açıklaması.",
        "era": "Dönem etiketi"
      }
      // Siyasi tarihteki önemli kırılmaları gösteren en az 8, en fazla 14 olay ekle.
    ]
  },
  "science": {
    "summary": "Ülkenin bilim, teknoloji, inovasyon ve akademik araştırma kapasitesinin özeti.",
    "indicators": [
      {
        "label": "Gösterge adı (örn: 'Ar-Ge Harcamalarının GSYİH'ye Oranı', 'Toplam Araştırmacı Sayısı', 'Yıllık Patent Başvurusu')",
        "value": "Gösterge değeri (örn: '1.43', '220,000', '9,200')",
        "unit": "Birim (örn: '%', 'Kişi', 'Adet')",
        "scoreOutOf100": 45 // Görsel radar grafiği için 100 üzerinden normalize edilmiş başarı puanı (0-100 arası sayısal değer olmalıdır).
      }
      // En az 5, en fazla 8 bilimsel gösterge ekle. En az 3 tanesinde 'scoreOutOf100' sayısal değeri mutlaka bulunmalıdır.
    ],
    "notableAchievements": [
      "Önemli bilimsel/teknolojik başarı veya buluş 1 (örn: TOGG yerli otomobil üretimi, uzay misyonu vb.)",
      "Başarı 2"
      // En az 4, en fazla 8 önemli başarı maddesi.
    ],
    "institutions": [
      {
        "name": "Kurumun adı (örn: 'TÜBİTAK', 'Boğaziçi Üniversitesi')",
        "type": "Kurum türü (örn: 'Universite', 'Arastirma Enstitusu', 'Uzay Ajansi')",
        "description": "Kurumun başarıları, odak alanları ve bilimsel duruşuna dair açıklama."
      }
      // En az 3, en fazla 6 prestijli üniversite veya araştırma merkezi ekle.
    ]
  }
}`;

        // API İstek Gövdesi (Request Body)
        const requestBody = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json", // Resmi JSON modu - temiz çıktı garantiler
          },
        };

        // İstek Zaman Aşımı (Timeout) Kontrolü (60 saniye)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(GEMINI_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error?.message || `HTTP Hata Kodu: ${response.status}`);
        }

        const resData = await response.json();
        const rawJsonText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawJsonText) {
          throw new Error("Gemini API boş yanıt döndürdü.");
        }

        // JSON Ayrıştırma ve Doğrulama
        const parsedData = JSON.parse(rawJsonText);

        // Temel anahtarların varlığını doğrula
        const requiredKeys = ["overview", "history", "economy", "relations", "politics", "science"];
        const missingKeys = requiredKeys.filter((k) => !parsedData[k]);
        if (missingKeys.length > 0) {
          throw new Error(`Eksik JSON anahtarları tespit edildi: ${missingKeys.join(", ")}`);
        }

        // Nihai Ülke Verisi Nesnesini Birleştir
        const finalCountryData = {
          meta: countryMeta,
          ...parsedData,
          generatedAt: new Date().toISOString(),
        };

        // Dosyaya Yaz
        const filePath = pathMod.join(outputDir, `${code}.json`);
        fs.writeFileSync(filePath, JSON.stringify(finalCountryData, null, 2), "utf-8");

        successCount++;
        console.log(`\x1b[32m%s\x1b[0m`, `✓ BAŞARILI: ${countryMeta.name_tr} verisi üretildi ve kaydedildi. (${successCount}/${currentBatch.length})`);

      } catch (err) {
        failCount++;
        failedCountries.push(countryMeta.name_tr);
        console.error(`\x1b[31m%s\x1b[0m`, `✗ HATA: ${countryMeta.name_tr} işlenirken hata oluştu:`, err.message);
      }

      // Batch içindeki son ülkeden sonra bekleme yapma
      if (i < currentBatch.length - 1) {
        // Rate limit (RPM) aşımını önlemek için her istek arasında 2.5 saniye bekle
        await sleep(2500);
      }
    }

    // 5. Çalıştırma Sonu Özet Raporu
    console.log("\n==================================================");
    console.log(`\x1b[36m%s\x1b[0m`, "BATCH ÇALIŞMASI TAMAMLANDI");
    console.log(`Başarılı: ${successCount}`);
    console.log(`Başarısız: ${failCount}`);
    if (failedCountries.length > 0) {
      console.log(`Başarısız Ülkeler: ${failedCountries.join(", ")}`);
    }

    // Güncel hazır dosya sayısını tekrar hesapla
    const finalFiles = fs.readdirSync(outputDir).filter(f => f.endsWith(".json"));
    const totalReady = finalFiles.length;
    const totalRemaining = 194 - totalReady;

    console.log(`\nŞu Anda Hazır Ülke Sayısı: ${totalReady} / 194`);
    console.log(`Kalan Ülke Sayısı: ${totalRemaining}`);
    
    if (totalRemaining > 0) {
      console.log(`\n\x1b[33m%s\x1b[0m`, `Bir sonraki batch'i başlatmak için komutu tekrar çalıştırabilirsiniz:`);
      console.log(`node scripts/generateCountryData.js --batch-size=${batchSize}`);
    } else {
      console.log(`\x1b[32m%s\x1b[0m`, `Tebrikler! Tüm 194 ülkenin ansiklopedik verileri başarıyla üretildi! 🎉`);
    }
    console.log("==================================================\n");

    process.exit(0);

  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", "Beklenmedik küresel hata:", err);
    process.exit(1);
  }
}

// Betiği çalıştır
main();