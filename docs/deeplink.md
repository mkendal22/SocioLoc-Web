# Deep link: web tarafı

Uygulama yüklüyse iOS ve Android linki doğrudan uygulamaya verir; web'e istek
hiç gelmez. Web yalnız uygulama açılamadığında devreye girer. Kararlar ve
mobil taraf: "SocioLoc Deep Link Mimarisi" belgesi.

## Link sözleşmesi

`src/lib/links.ts`, uygulamanın açabildiği yolların tek kaynağı. Mobildeki rota
tablosuyla aynı; iki taraf `src/lib/deeplink-vectors.json` dosyasındaki
örneklerle test edilir.

| Yol | Uygulama yoksa |
|---|---|
| `/event/{id}` | Herkese açıksa etkinlik sayfası; değilse aşağıdaki görünürlük tablosu |
| `/event/{id}/album`, `participants`, `ticket`, `feedback`, `requests`, `check-in`, `edit` | Uygulama kapısı |
| `/post/{id}` | Uygulama kapısı |
| `/u/{uid}`, `/u/{uid}/followers`, `/u/{uid}/following` | Uygulama kapısı |
| `/user/{uid}`, `/business/{uid}` | 308 → `/u/{uid}` |
| `/app/…` (ekranlar, `support/{id}`, `business/{bizUid}/…`) | Uygulama kapısı |

Sözleşmede olmayan yol 404 verir. Kimlikler `^[A-Za-z0-9_-]{1,128}$`.

## Uygulama kapısı

`src/lib/app-gate.ts`. Veritabanına dokunmaz: var olan ve olmayan kimlik aynı
yanıtı alır.

| İstemci | Yanıt |
|---|---|
| iPhone | 302 → App Store |
| Android Chrome | 302 → `intent://…`: uygulama varsa hedef ekran, yoksa Play |
| Android'de diğer tarayıcılar ve uygulama içi tarayıcılar | 302 → Play |
| Önizleme botu, masaüstü | 200: genel başlık, QR kodu, mağaza düğmeleri |

Play adresindeki `referrer`, hedef yolu (`link`) ve UTM'yi taşır; uygulama
kurulumdan sonraki ilk açılışta bu içeriğe gidebilir. Yanıtlar
`private, no-store` ve `noindex`.

## Etkinlik görünürlüğü

`src/lib/events/visibility.ts`, Firestore kurallarının ve uygulamanın keşif
listesinin web karşılığı.

| Durum | Alan | Sayfa | Liste, sitemap |
|---|---|---|---|
| Herkese açık | – | Tam sayfa | Var |
| İptal | `cancelled` | "İptal edildi" bandı, noindex | Yok |
| Kilitli | `audience` ≠ `public` ya da `archived` | Kapı görünümü, ayrıntı yok | Yok |
| Kaldırıldı | `isHidden` | 404 | Yok |

## Yeni link eklemek

1. `src/lib/links.ts` tablosuna satır ekle.
2. `deeplink-vectors.json` dosyasına örnek ekle (mobildeki kopyaya da).
3. Yol yeni bir üst segmentse `src/app/…/route.ts` ile kapıya bağla.
4. Mobilde rota tablosuna aynı satırı ekle.
5. iOS AASA ve Android manifest yolları kapsıyor mu, kontrol et.

## AASA ve Android yolları

`public/.well-known/apple-app-site-association` sürüme göre ayrılamaz: eklenen
yolu uygulamanın eski sürümleri de alır. Yollar: `/event/*`, `/post/*`,
`/u/*`, `/app/*` ve eski biçimler `/user/*`, `/business/*`.

- Yeni bir yol, onu paylaşan mobil sürümden önce canlı AASA'da olmalı (bkz.
  "Yayın sırası"). Yeni sürüm işletme profilini `/u/{uid}` olarak paylaşıyor;
  yol sahiplenilmeseydi uygulaması olan iPhone kullanıcısı App Store'a
  düşerdi (eski `/business/*` uygulamayı açıyordu).
- Eski sürümler (1.0.25 ve öncesi) `/u/…` ve `/app/…` linkinde uygulamayı
  açar ama hedef ekrana gitmez; çökmez. 7 Ekim 2026'da Play'de 1.0.27, App
  Store'da 1.0.25 var: iPhone'da bu linkler 1.0.27 yayınlanana kadar hedefe
  gitmiyor.
- Android'de yollar uygulamanın prod manifestinde (`android/app/src/prod/
  AndroidManifest.xml`), sürümle birlikte gelir. Yalnız `www.socioloc.app`
  sahiplenilir: apex `.well-known` dosyalarını www'ye yönlendiriyor ve Android
  doğrulaması yönlendirme izlemez.
- `assetlinks.json`, Play uygulama imzalama anahtarının parmak izini
  (`D4:DB:CA:AA…`) taşıyor ve canlıda; Google'ın doğrulama servisi
  `linked: true` dönüyor (7 Ekim 2026). Parmak izinin kaynağı:
  `docs/kod-disi-ayarlar.md` madde 2.

## Yayın sırası

Uygulama, paylaştığı adreslerin (profil `/u/{uid}`, davet `/indir`) web'de
hazır olduğunu varsayar. Bu yüzden **web, o adresleri paylaşan mobil sürüm
mağazaya gönderilmeden önce** canlıda olmalı: AASA, `assetlinks.json`,
uygulama kapısı rotaları ve `/indir`. Mobil sürümden önce kontrol:

```bash
curl -s https://www.socioloc.app/.well-known/apple-app-site-association | grep -c '"/u/\*"'
```

```bash
curl -s https://www.socioloc.app/.well-known/assetlinks.json | grep -c "D4:DB:CA:AA"
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" https://www.socioloc.app/u/test123
```

İlk ikisi 1, üçüncüsü 302 dönmeli.

Durum (7 Ekim 2026): üç kontrol de beklenen sonucu veriyor ve canlı sitenin
içeriği bu deponun `main` dalıyla aynı. 30 Eylül 2026'da canlıda AASA yalnız
`/event/*` içeriyordu, `assetlinks.json` yer tutucuydu, `/indir`, `/u/…`,
`/app/…` ve `/event/{id}/…` 404 veriyordu; bu fark kapandı.

Sitenin hangi depodan ve nasıl yayınlandığı Vercel ayarında durur, bu depodan
görülmez. `main`'e giren bir derin link değişikliğinin canlıya çıktığını
yukarıdaki komutlarla doğrula.

## Deneme

```bash
curl -sI -A "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" https://www.socioloc.app/u/test123
```

```bash
curl -sI -A "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36" https://www.socioloc.app/post/test123
```

```bash
curl -s -A "WhatsApp/2.24" https://www.socioloc.app/u/test123 | grep og:title
```
