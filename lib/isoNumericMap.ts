/**
 * Küresel Ülke Ansiklopedisi Platformu - ISO Sayısal -> İki Harfli Kod Eşleştirmesi
 * 
 * Bu dosya, world-atlas TopoJSON harita verilerindeki sayısal ülke kimliklerini (numeric ID),
 * platformumuzun kullandığı iki harfli (alpha-2) küçük harf ülke kodlarına bağlar.
 * Bu sayede interaktif dünya haritasında bir ülkeye tıklandığında doğru detay sayfasına
 * yönlendirme yapılabilir.
 */
export const ISO_NUMERIC_TO_ALPHA2: Record<string, string> = {
  "004": "af", // Afganistan
  "008": "al", // Arnavutluk
  "012": "dz", // Cezayir
  "020": "ad", // Andorra
  "024": "ao", // Angola
  "028": "ag", // Antigua ve Barbuda
  "032": "ar", // Arjantin
  "051": "am", // Ermenistan
  "036": "au", // Avustralya
  "040": "at", // Avusturya
  "031": "az", // Azerbaycan
  "044": "bs", // Bahamalar
  "048": "bh", // Bahreyn
  "050": "bd", // Bangladeş
  "052": "bb", // Barbados
  "112": "by", // Belarus
  "056": "be", // Belçika
  "084": "bz", // Belize
  "204": "bj", // Benin
  "064": "bt", // Butan
  "068": "bo", // Bolivya
  "070": "ba", // Bosna-Hersek
  "072": "bw", // Botsvana
  "076": "br", // Brezilya
  "096": "bn", // Brunei
  "100": "bg", // Bulgaristan
  "854": "bf", // Burkina Faso
  "108": "bi", // Burundi
  "132": "cv", // Cabo Verde
  "116": "kh", // Kamboçya
  "120": "cm", // Kamerun
  "124": "ca", // Kanada
  "140": "cf", // Orta Afrika Cumhuriyeti
  "148": "td", // Çad
  "152": "cl", // Şili
  "156": "cn", // Çin
  "170": "co", // Kolombiya
  "174": "km", // Komorlar
  "178": "cg", // Kongo Cumhuriyeti
  "180": "cd", // Kongo Demokratik Cumhuriyeti
  "188": "cr", // Kosta Rika
  "191": "hr", // Hırvatistan
  "192": "cu", // Küba
  "196": "cy", // Kıbrıs
  "203": "cz", // Çekya
  "208": "dk", // Danimarka
  "262": "dj", // Cibuti
  "212": "dm", // Dominika
  "214": "do", // Dominik Cumhuriyeti
  "218": "ec", // Ekvador
  "818": "eg", // Mısır
  "222": "sv", // El Salvador
  "226": "gq", // Ekvator Ginesi
  "232": "er", // Eritre
  "233": "ee", // Estonya
  "748": "sz", // Esvatini
  "231": "et", // Etiyopya
  "242": "fj", // Fiji
  "246": "fi", // Finlandiya
  "250": "fr", // Fransa
  "266": "ga", // Gabon
  "270": "gm", // Gambiya
  "268": "ge", // Gürcistan
  "276": "de", // Almanya
  "288": "gh", // Gana
  "300": "gr", // Yunanistan
  "308": "gd", // Grenada
  "320": "gt", // Guatemala
  "324": "gn", // Gine
  "624": "gw", // Gine-Bissau
  "328": "gy", // Guyana
  "332": "ht", // Haiti
  "340": "hn", // Honduras
  "348": "hu", // Macaristan
  "352": "is", // İzlanda
  "356": "in", // Hindistan
  "360": "id", // Endonezya
  "364": "ir", // İran
  "368": "iq", // Irak
  "372": "ie", // İrlanda
  "376": "il", // İsrail
  "380": "it", // İtalya
  "388": "jm", // Jamaika
  "392": "jp", // Japonya
  "400": "jo", // Ürdün
  "398": "kz", // Kazakistan
  "404": "ke", // Kenya
  "296": "ki", // Kiribati
  "408": "kp", // Kuzey Kore
  "410": "kr", // Güney Kore
  "414": "kw", // Kuveyt
  "417": "kg", // Kırgızistan
  "418": "la", // Laos
  "428": "lv", // Letonya
  "422": "lb", // Lübnan
  "426": "ls", // Lesotho
  "430": "lr", // Liberya
  "434": "ly", // Libya
  "438": "li", // Lihtenştayn
  "440": "lt", // Litvanya
  "442": "lu", // Lüksemburg
  "450": "mg", // Madagaskar
  "454": "mw", // Malavi
  "458": "my", // Malezya
  "462": "mv", // Maldivler
  "466": "ml", // Mali
  "470": "mt", // Malta
  "584": "mh", // Marshall Adaları
  "478": "mr", // Moritanya
  "480": "mu", // Mauritius
  "484": "mx", // Meksika
  "583": "fm", // Mikronezya
  "498": "md", // Moldova
  "492": "mc", // Monako
  "496": "mn", // Moğolistan
  "499": "me", // Karadağ
  "504": "ma", // Fas
  "508": "mz", // Mozambik
  "104": "mm", // Myanmar
  "516": "na", // Namibya
  "520": "nr", // Nauru
  "524": "np", // Nepal
  "528": "nl", // Hollanda
  "554": "nz", // Yeni Zelanda
  "558": "ni", // Nikaragua
  "562": "ne", // Nijer
  "566": "ng", // Nijerya
  "807": "mk", // Kuzey Makedonya
  "578": "no", // Norveç
  "512": "om", // Umman
  "586": "pk", // Pakistan
  "585": "pw", // Palau
  "275": "ps", // Filistin
  "591": "pa", // Panama
  "598": "pg", // Papua Yeni Gine
  "600": "py", // Paraguay
  "604": "pe", // Peru
  "608": "ph", // Filipinler
  "616": "pl", // Polonya
  "620": "pt", // Portekiz
  "634": "qa", // Katar
  "642": "ro", // Romanya
  "643": "ru", // Rusya
  "646": "rw", // Ruanda
  "659": "kn", // Saint Kitts ve Nevis
  "662": "lc", // Saint Lucia
  "670": "vc", // Saint Vincent ve Grenadinler
  "882": "ws", // Samoa
  "674": "sm", // San Marino
  "678": "st", // Sao Tome ve Principe
  "682": "sa", // Suudi Arabistan
  "686": "sn", // Senegal
  "688": "rs", // Sırbistan
  "690": "sc", // Seyşeller
  "694": "sl", // Sierra Leone
  "702": "sg", // Singapur
  "703": "sk", // Slovakya
  "705": "si", // Slovenya
  "090": "sb", // Solomon Adaları
  "706": "so", // Somali
  "710": "za", // Güney Afrika
  "728": "ss", // Güney Sudan
  "724": "es", // İspanya
  "144": "lk", // Sri Lanka
  "729": "sd", // Sudan
  "740": "sr", // Surinam
  "752": "se", // İsveç
  "756": "ch", // İsviçre
  "760": "sy", // Suriye
  "762": "tj", // Tacikistan
  "834": "tz", // Tanzanya
  "764": "th", // Tayland
  "626": "tl", // Doğu Timor
  "768": "tg", // Togo
  "776": "to", // Tonga
  "780": "tt", // Trinidad ve Tobago
  "788": "tn", // Tunus
  "792": "tr", // Türkiye
  "795": "tm", // Türkmenistan
  "798": "tv", // Tuvalu
  "800": "ug", // Uganda
  "804": "ua", // Ukrayna
  "784": "ae", // Birleşik Arap Emirlikleri
  "826": "gb", // Birleşik Krallık
  "840": "us", // Amerika Birleşik Devletleri
  "858": "uy", // Uruguay
  "860": "uz", // Özbekistan
  "548": "vu", // Vanuatu
  "336": "va", // Vatikan
  "862": "ve", // Venezuela
  "704": "vn", // Vietnam
  "887": "ye", // Yemen
  "894": "zm", // Zambiya
  "716": "zw"  // Zimbabve
};