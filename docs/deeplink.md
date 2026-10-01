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

- `/u/*` ve `/app/*` mobil sürümden önce canlıda olmalı (bkz. "Yayın
  sırası"). Yeni sürüm işletme profilini `/u/{uid}` olarak paylaşıyor; yol
  sahiplenilmezse uygulaması olan iPhone kullanıcısı App Store'a düşer (eski
  `/business/*` uygulamayı açıyordu).
- Eski sürümler `/u/…` ve `/app/…` linkinde uygulamayı ana sayfada açar;
  hedefi bilmez ama çökmez.
- Android'de yollar uygulamanın prod manifestinde (`android/app/src/prod/
  AndroidManifest.xml`), sürümle birlikte gelir. Yalnız `www.socioloc.app`
  sahiplenilir: apex `.well-known` dosyalarını www'ye yönlendiriyor ve Android
  doğrulaması yönlendirme izlemez.
- `assetlinks.json`: canlı sitede henüz yer tutucu var; bu depodaki parmak izi
  (Play uygulama imzalama anahtarı) yayında olmadan Android App Links
  doğrulanmaz.

## Yayın sırası

Canlı site (www.socioloc.app) başka bir depodan yayınlanıyor; bu depodaki
derin link değişiklikleri canlıya ancak oraya taşınınca (ya da site bu
depodan yayınlanınca) çıkar. 30 Eylül 2026'da canlıda AASA yalnız
`/event/*` içeriyor, `assetlinks.json` yer tutucu, `/indir`, `/u/…`,
`/app/…` ve `/event/{id}/…` 404.

Uygulamanın yeni sürümü bu adresleri paylaşıyor (profil `/u/{uid}`, davet
`/indir`). Bu yüzden **web, mobil sürüm mağazaya gönderilmeden önce**
canlıda olmalı: AASA, `assetlinks.json`, uygulama kapısı rotaları ve
`/indir`. Mobil sürümden önce kontrol:

```bash
curl -s https://www.socioloc.app/.well-known/apple-app-site-association | grep -c '"/u/\*"'
```

```bash
curl -s https://www.socioloc.app/.well-known/assetlinks.json | grep -c "B7:83:E8"
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" https://www.socioloc.app/u/test123
```

İlk ikisi 1, üçüncüsü 302 dönmeli.

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
