import { NextResponse } from "next/server";

// NOTE: Bu rota, Google Gemini API'sini doğrudan fetch() kullanarak REST üzerinden çağırır.
// Herhangi bir Node SDK'sı (@google/generative-ai veya @google/genai) KULLANILMAZ.
// Önceki projede tecrübe edildiği üzere, bu SDK'lar gaxios ve google-auth-library gibi
// ağır bağımlılık zincirlerini çeker. Bu bağımlılıklar, Next.js/Vercel derleme (build)
// aşamasında (özellikle Terser minification ve Babel/SWC aşamalarında) private class field
// sözdizimi nedeniyle derleme hatalarına yol açar. Doğrudan REST çağrısı yapmak bu sorunu kökten çözer.

// NOTE: Sabit model kimlikleri (örn: gemini-2.0-flash veya gemini-2.5-flash) Google tarafından
// çok hızlı bir şekilde emekliye ayrılabilmekte veya yeni kullanıcılara kapatılabilmektedir.
// Bu durum uygulamanın aniden 404 hatası vermesine neden olur. Bu riski önlemek için her zaman
// en güncel aktif Flash modeline yönlendirilen dinamik "gemini-flash-latest" takma adı (alias) kullanılır.
const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, countryName } = body;

    // 1. Soru Doğrulaması
    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Lütfen geçerli bir soru metni girin." },
        { status: 400 }
      );
    }

    // 2. API Anahtarı Doğrulaması
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return NextResponse.json(
        { error: "Sunucu yapılandırma hatası: Yapay zeka asistanı şu anda aktif değil." },
        { status: 500 }
      );
    }

    // 3. Sistem Talimatı (System Prompt) İnşası
    // Tarafsızlık, ansiklopedik dil ve hassas konulara yaklaşım kuralları içerir.
    const systemPrompt = `Sen, dünya ülkeleri, coğrafya, tarih, ekonomi, siyaset, uluslararası ilişkiler ve bilim tarihi konularında uzmanlaşmış, gelişmiş bir ansiklopedik yapay zeka asistanısın.
Sana sorulan soruları tamamen Türkçe olarak, detaylı, anlaşılır ve tarafsız bir dille yanıtlamalısın.

Lütfen şu kurallara kesinlikle uy:
1. Yanıtlarını tamamen Türkçe olarak yaz.
2. Ansiklopedik, akademik ve saygın bir dil kullan. Ciddiyetten uzak veya aşırı samimi ifadelerden kaçın.
3. Önemli terimleri, tarihleri veya başlıkları vurgulamak için hafif markdown kalın yazı stilini (**kalın**) kullanabilirsin. Yanıtını paragraflara, maddelere veya numaralandırılmış listelere bölerek okunabilirliği artır.
4. Hassas konular (sınır anlaşmazlıkları, tarihi çatışmalar, hassas siyasi figürler veya rejimler) hakkında soru sorulduğunda KESİNLİKLE tarafsız kal. Herhangi bir siyasi, ulusal veya ideolojik tarafgirlik yapma. Birden fazla perspektif varsa, bunları nesnel ve dengeli bir şekilde, akademik kaynaklara atıfta bulunarak sun (örn. "X tarafı bu durumu ... olarak savunurken, Y tarafı ise ... olduğunu iddia etmektedir").
5. Yanıtlarında spekülatif veya doğrulanmamış bilgilere yer verme. Bilgi sahibi olmadığın veya kesinlik taşımayan konularda bunu açıkça belirt.
6. Karmaşık LaTeX formülleri kullanma. Gerekirse düz metin veya basit matematiksel semboller kullan.`;

    // Eğer soru belirli bir ülke bağlamında sorulmuşsa, prompt'a bu bağlamı ekle
    let fullPrompt = systemPrompt;
    if (countryName && typeof countryName === "string" && countryName.trim()) {
      fullPrompt += `\n\nÖNEMLİ BAĞLAM: Kullanıcının sorusu özellikle "${countryName.trim()}" ülkesi hakkındadır. Yanıtını bu ülkenin bağlamını, tarihini, coğrafyasını veya ilgili durumunu göz önünde bulundurarak özelleştir.`;
    }

    fullPrompt += `\n\nKullanıcı Sorusu: ${question.trim()}`;

    // 4. Gemini REST API İstek Gövdesi (Request Body) Hazırlığı
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
    };

    // 5. API Çağrısı
    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const geminiData = await geminiResponse.json();

    // 6. Hata Yönetimi
    if (!geminiResponse.ok) {
      const apiError = geminiData?.error;
      console.error("Gemini REST API Error:", {
        httpStatus: geminiResponse.status,
        code: apiError?.code,
        status: apiError?.status,
        message: apiError?.message,
      });

      let clientMessage =
        "Yapay zeka asistanından yanıt alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";

      const apiStatus: string = (apiError?.status || "").toString();
      const apiMsg: string = (apiError?.message || "").toString();

      if (/PERMISSION_DENIED|UNAUTHENTICATED/i.test(apiStatus) || /api key/i.test(apiMsg)) {
        clientMessage =
          "API anahtarı geçersiz veya yetkisiz görünüyor. Lütfen sunucu çevre değişkenlerini kontrol edin.";
      } else if (/RESOURCE_EXHAUSTED/i.test(apiStatus) || geminiResponse.status === 429) {
        clientMessage =
          "Yapay zeka kullanım kotası dolmuş görünüyor. Lütfen daha sonra tekrar deneyin.";
      } else if (/NOT_FOUND/i.test(apiStatus) || geminiResponse.status === 404) {
        clientMessage =
          "Seçilen yapay zeka modeline şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.";
      }

      return NextResponse.json({ error: clientMessage }, { status: 500 });
    }

    // 7. Yanıt Metninin Çıkartılması
    const responseText: string | undefined =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Gemini REST API returned no text. Full response:", geminiData);
      throw new Error("Empty response from Gemini API");
    }

    // 8. Başarılı Yanıt Döndürme
    return NextResponse.json({ answer: responseText });
  } catch (error: any) {
    // Sunucu tarafında detaylı hata kaydı tutulur, istemciye sızdırılmaz
    console.error("Ask Route Error:", {
      message: error?.message,
      raw: error,
    });

    return NextResponse.json(
      { error: "Yapay zeka asistanı yanıt üretirken beklenmedik bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}