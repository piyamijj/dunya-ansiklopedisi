import fs from "fs";
import path from "path";
import { CountryListItem, CountryData } from "./types";

// Modül düzeyinde önbellek (memoization)
let cachedCountryList: CountryListItem[] | null = null;

/**
 * Tüm ülkelerin temel listesini okur ve döndürür.
 * Dosya okuma işlemini modül düzeyinde önbelleğe alır.
 */
export function getCountryList(): CountryListItem[] {
  if (cachedCountryList) {
    return cachedCountryList;
  }

  try {
    const filePath = path.join(process.cwd(), "data", "countryList.json");
    if (!fs.existsSync(filePath)) {
      console.error(`Ülke listesi dosyası bulunamadı: ${filePath}`);
      return [];
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(fileContent) as CountryListItem[];
    
    // Önbelleğe kaydet
    cachedCountryList = parsedData;
    return parsedData;
  } catch (error) {
    console.error("Ülke listesi okunurken veya ayrıştırılırken hata oluştu:", error);
    return [];
  }
}

/**
 * Verilen iki harfli ülke koduna göre temel ülke bilgilerini bulur.
 * @param code İki harfli ülke kodu (örn: "tr", "us")
 */
export function getCountryByCode(code: string): CountryListItem | undefined {
  if (!code) return undefined;
  const list = getCountryList();
  const targetCode = code.toLowerCase();
  return list.find((country) => country.code.toLowerCase() === targetCode);
}

/**
 * Belirli bir ülkeye ait detaylı ansiklopedik veriyi okur.
 * Eğer ülkeye ait veri dosyası henüz üretilmemişse null döner.
 * @param code İki harfli ülke kodu (örn: "tr", "us")
 */
export function getCountryData(code: string): CountryData | null {
  if (!code) return null;
  
  try {
    const targetCode = code.toLowerCase();
    const filePath = path.join(process.cwd(), "data", "countries", `${targetCode}.json`);
    
    if (!fs.existsSync(filePath)) {
      // Veri henüz üretilmemişse şablonun "yakında gelecek" göstermesi için null dönüyoruz
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(fileContent) as CountryData;
    
    return parsedData;
  } catch (error) {
    console.error(`${code} ülkesine ait detaylı veri okunurken hata oluştu:`, error);
    return null;
  }
}

/**
 * Şu anda detaylı verisi (JSON dosyası) hazır olan ülke kodlarının listesini döndürür.
 * Next.js generateStaticParams (SSG) için kullanılır.
 */
export function getAvailableCountryCodes(): string[] {
  try {
    const dirPath = path.join(process.cwd(), "data", "countries");
    
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = fs.readdirSync(dirPath);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => path.basename(file, ".json").toLowerCase());
  } catch (error) {
    console.error("Hazır ülke kodları listelenirken hata oluştu:", error);
    return [];
  }
}

/**
 * Tüm ülkeleri coğrafi bölgelerine göre gruplayarak döndürür.
 * Ülke seçici/tarayıcı arayüzünde kategorize edilmiş listeleme için kullanılır.
 */
export function getCountriesByRegion(): Record<string, CountryListItem[]> {
  const list = getCountryList();
  const grouped: Record<string, CountryListItem[]> = {};

  for (const country of list) {
    const region = country.region || "Diğer";
    if (!grouped[region]) {
      grouped[region] = [];
    }
    grouped[region].push(country);
  }

  // Her bölgedeki ülkeleri Türkçe isimlerine göre alfabetik sırala
  for (const region in grouped) {
    grouped[region].sort((a, b) => a.name_tr.localeCompare(b.name_tr, "tr"));
  }

  return grouped;
}