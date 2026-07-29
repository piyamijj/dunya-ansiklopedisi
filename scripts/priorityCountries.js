/**
 * Küresel Ülke Ansiklopedisi Platformu - Tarihsel Öncelikli Ülkeler Listesi
 * 
 * Bu modül, veri üretim betiğinin (generateCountryData.js) ilk çalıştırmada
 * hangi ülkeleri öncelikli olarak işleyeceğini belirler. Seçilen ~29 ülke,
 * insanlık tarihindeki büyük medeniyetlere, imparatorluklara ve kültürel
 * kırılma noktalarına ev sahipliği yapmış coğrafyalardan oluşmaktadır.
 * Bu sayede ilk yayına alımda yüksek coğrafi ve kültürel çeşitlilik sağlanır.
 */

const PRIORITY_COUNTRY_CODES = [
  "it", // İtalya (Roma İmparatorluğu, Rönesans)
  "tr", // Türkiye (Osmanlı İmparatorluğu, Bizans, Selçuklu)
  "gr", // Yunanistan (Antik Yunan, Bizans İmparatorluğu)
  "eg", // Mısır (Antik Mısır, Firavunlar Dönemi)
  "cn", // Çin (Çoklu kadim hanedanlıklar, İpek Yolu)
  "ir", // İran (Pers İmparatorluğu, Akamenid/Sasani)
  "in", // Hindistan (Maurya İmparatorluğu, Babür İmparatorluğu)
  "iq", // Irak (Mezopotamya, Babil, Abbasi Hilafeti)
  "mx", // Meksika (Aztek İmparatorluğu, Maya Medeniyeti)
  "pe", // Peru (İnka İmparatorluğu)
  "es", // İspanya (İspanyol İmparatorluğu, Keşifler Çağı)
  "pt", // Portekiz (Portekiz Sömürge İmparatorluğu)
  "gb", // Birleşik Krallık (Büyük Britanya İmparatorluğu)
  "fr", // Fransa (Fransız İmparatorluğu, Napolyon Dönemi)
  "ru", // Rusya (Rus Çarlığı, Sovyetler Birliği)
  "mn", // Moğolistan (Moğol İmparatorluğu)
  "de", // Almanya (Kutsal Roma Cermen İmparatorluğu, Alman İmparatorluğu)
  "at", // Avusturya (Habsburg Hanedanı, Avusturya-Macaristan)
  "et", // Etiyopya (Aksum Krallığı, Doğu Afrika medeniyeti)
  "ml", // Mali (Mali İmparatorluğu, Timbuktu altın çağı)
  "jp", // Japonya (Şogunluk Dönemi, Japon İmparatorluğu)
  "kr", // Güney Kore (Kore Hanedanlıkları, Joseon)
  "us", // Amerika Birleşik Devletleri (Modern süper güç, kuruluş tarihi)
  "br", // Brezilya (Portekiz sömürge mirası, Güney Amerika'nın en büyüğü)
  "il", // İsrail (Antik tarih, İsrail/Yahuda Krallıkları)
  "ps", // Filistin (Kadim Kenan bölgesi, ortak bölgesel miras)
  "sy", // Suriye (Antik Levant medeniyetleri, Emevi Hilafeti)
  "vn", // Vietnam (Antik hanedanlıklar, direniş tarihi)
  "id"  // Endonezya (Majapahit İmparatorluğu, Srivijaya)
];

module.exports = { PRIORITY_COUNTRY_CODES };