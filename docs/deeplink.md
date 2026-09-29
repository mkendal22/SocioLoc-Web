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

## AASA aşamaları

`public/.well-known/apple-app-site-association` sürüme göre ayrılamaz: eklenen
yolu uygulamanın eski sürümleri de alır.

- Bugün: `/event/*`, `/post/*`, `/business/*` (mevcut iOS sürümü bu türleri işliyor).
- Uygulamanın yeni sürümü yaygınlaşınca: `/u/*`, `/user/*`, `/app/*`.

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
