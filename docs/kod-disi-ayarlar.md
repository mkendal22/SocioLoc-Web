# Kod dışı ayarlar: kontrol listesi

`fix/site-iyilestirmeleri` branch'indeki değişikliklerin tam etkisi için kod
dışında yapılması gereken ayarlar. Her maddede kim, nerede ve nasıl
doğrulanacağı yazıyor.

> Canlı site bu repodan değil, başka bir repodan deploy ediliyor. Önce bu
> branch'in o repoya taşınması gerekiyor (bkz. madde 8).

## 1. Vercel: apex alan adını projeye bağla

**Kim:** Vercel projesine erişimi olan kişi (Melik)

Şu an `socioloc.app` → `www.socioloc.app` yönlendirmesini Vercel alan adı
ayarı yapıyor: 307 (geçici) ve `/.well-known` dosyaları dahil her şeyi
yönlendiriyor. Apple ve Google doğrulama dosyalarında yönlendirme izlemediği
için `socioloc.app` üzerinden derin link doğrulaması başarısız oluyor.

1. Vercel → Project → Settings → Domains → `socioloc.app`: "Redirect to
   www.socioloc.app" yerine doğrudan Production'a bağla. `www.socioloc.app`
   birincil alan adı olarak kalsın.
2. Yönlendirmeyi artık `next.config.ts` yapıyor: 308 (kalıcı),
   `/.well-known/*` hariç.
3. Ortam değişkeni (Production + Preview):
   `NEXT_PUBLIC_SITE_URL=https://www.socioloc.app`. Tanımlanmazsa varsayılan
   da bu.

**Doğrulama**

```bash
curl -sI https://socioloc.app/ | grep -iE "^HTTP|^location"
# → 308, location: https://www.socioloc.app/
curl -sI https://socioloc.app/.well-known/assetlinks.json | grep -i "^HTTP"
# → 200
```

## 2. Play Console: SHA-256 parmak izini teyit et

**Kim:** Mobil ekip (Play Console erişimi olan)

`public/.well-known/assetlinks.json` dosyasına, Firebase'deki Android
uygulamasına kayıtlı ve debug olmayan tek SHA-256 değeri yazıldı:

```
B7:83:E8:E8:8C:EC:B7:A1:8B:AF:13:AF:86:9B:1A:E9:B6:96:78:57:1C:68:F5:04:75:0D:E5:91:65:90:D9:58
```

Firebase'de kayıtlı diğer SHA-256 değeri (`AA:DA:29:D9:…:09:D2`) bir
geliştirici bilgisayarındaki `debug.keystore`'a ait; assetlinks'e
**eklenmemeli**.

**Düzeltme (1 Eki 2026):** 29 Eylül'deki teyit yanlıştı. Play Store'dan
kurulu uygulamanın imzası cihazdan okundu (`adb pull` + `apksigner verify
--print-certs`): Play uygulama imzalama sertifikasının SHA-256'sı
`D4:DB:CA:AA:40:E1:6F:03:25:8B:11:F0:FB:9D:6D:E7:2F:42:F1:97:BE:E2:67:A5:0F:B5:5F:79:15:C5:E2:4F`
(SHA-1 `A7:CD:0D:0C:…:5F:FD`). `B7:83:…` bu sertifikaya ait değil (büyük
ihtimalle yükleme anahtarı). `assetlinks.json`'a D4:DB eklendi, B7:83
zararsız olduğu için duruyor. Aynı değer Firebase'e de eklendi; Android App
Check bununla düzeldi.

**Eski durum (29 Eyl 2026, yanlış çıktı):** Play Console'daki uygulama imzalama
SHA-256'sı teyit edildi sanılmıştı, yukarıdaki değerle aynı.
Canlı sitedeki `assetlinks.json` ise hâlâ yer tutucu
(`BURAYA_ANDROID_KEYSTORE_SHA256_PARMAK_IZI_GELECEK`); Google'ın doğrulama
servisi bunu hatalı parmak izi diye reddediyor. Site bu depodan yayınlanana
ya da canlı dosya düzeltilene kadar Android App Links doğrulanmaz.

1. Play Console → SocioLoc → Uygulama bütünlüğü (App integrity) → Uygulama
   imzalama → "Uygulama imzalama anahtarı sertifikası" altındaki SHA-256.
2. Yukarıdaki değerle aynı değilse assetlinks.json'daki değeri onunla
   değiştir. Aynı sayfadaki hazır "Digital Asset Links JSON" da
   kullanılabilir. İstenirse yükleme anahtarının (upload key) SHA-256'sı da
   listeye eklenebilir.

**Doğrulama**

- `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://www.socioloc.app&relation=delegate_permission/common.handle_all_urls`
- Uygulama yüklü bir cihazda:
  `adb shell pm get-app-links com.socioloc.app` → `www.socioloc.app: verified`

## 3. iOS: Associated Domains

**Kim:** Mobil ekip. **Değişiklik gerekmiyor.**

`ios/Runner/RunnerRelease.entitlements` zaten `applinks:socioloc.app` ve
`applinks:www.socioloc.app` içeriyor. www için doğrulama bugün de çalışıyor.
Apex için 1. madde tamamlanınca çalışır.

**Doğrulama:** `https://app-site-association.cdn-apple.com/a/v1/www.socioloc.app`
(Apple CDN'in önbelleğe aldığı dosya; güncellenmesi 24–48 saat sürebilir).

## 4. Vercel ortam değişkenleri: Firebase Admin

**Kim:** Vercel projesine erişimi olan kişi

Firestore kuralları anonim okumaya kapalı; yerel build sırasında istemci
SDK'nın aldığı "Missing or insufficient permissions" hatasıyla doğrulandı.
Bu yüzden etkinlik sayfaları ve sitemap yalnızca Admin SDK ile veri
alabiliyor.

- Production **ve build** ortamında `FIREBASE_SERVICE_ACCOUNT_BASE64`
  tanımlı olmalı. `/etkinlikler` artık ISR ile build sırasında da
  üretiliyor.
- Üretimde okuma hataları artık yutulmuyor (`src/lib/events/fetch.ts` →
  `STRICT`): geçici bir Firestore hatasında önceki sağlam sayfa sunulmaya
  devam ediyor. Bunun sonucu olarak, bu değişken **eksikse**:
  - build yine geçer (build sırasında hata yutulur),
  - `/etkinlikler` ve sitemap build anındaki (boş) sürümde takılı kalır,
  - önbellekte olmayan etkinlik detay sayfaları 404 yerine **500** verir.

  Bu belirtiler görülürse ilk kontrol edilecek yer bu değişkendir; Vercel
  fonksiyon loglarında `[fetchAllEvents]` / `[fetchEventById]` hataları
  görünür.
- Bu doğrulandıktan sonra `src/lib/firebase.ts` üzerindeki istemci SDK yedeği
  tamamen kaldırılabilir; kurallar nedeniyle zaten hiç çalışmıyor.

## 5. Firebase web yapılandırması (düşük öncelik)

**Kim:** Firebase projesine erişimi olan kişi

Web istemcisi şu an Android uygulamasının `appId` değerini kullanıyor
(`src/lib/firebase.ts`).

1. Firebase Console → Project settings → Add app → Web; çıkan değerleri
   Vercel'de `NEXT_PUBLIC_FIREBASE_*` değişkenlerine gir.
2. Google Cloud Console → APIs & Services → Credentials → web API anahtarı
   → Application restrictions: HTTP referrers (`https://www.socioloc.app/*`,
   `https://socioloc.app/*`, preview alan adı).

Tarayıcı Firebase'e bağlanmadığı için (tüm okumalar sunucuda) bu adım
güvenlikten çok düzen için.

## 6. Cloudflare (değerlendirin)

**Kim:** DNS yöneticisi

Yanıtlar Cloudflare proxy'sinden geçiyor, arkada Vercel var. Vercel önüne
ters proxy konmasını önermiyor: önbellek, güvenlik duvarı ve sertifika
yenileme davranışları çakışabilir. Özel bir sebep yoksa Cloudflare → DNS →
`socioloc.app` ve `www` kayıtlarını "DNS only" (gri bulut) moduna alın.

## 7. CSP'yi zorunlu moda alma

**Kim:** Web ekibi, 1–2 hafta sonra

CSP şu an yalnızca rapor modunda (`Content-Security-Policy-Report-Only`) ve
hiçbir şeyi engellemiyor. Canlıda tarayıcı konsolunda `[Report Only]`
ihlali görülmezse `next.config.ts`'te anahtar
`Content-Security-Policy` yapılarak zorunlu hale getirilebilir.

## 8. Canlı repoya taşıma

**Kim:** Melik + Can

Canlıdaki kod bu repodan farklı:

- www canonical adresleri iki tarafta da var.
- Canlıdaki sitemap tüm etkinlikleri listeliyor; bu branch yalnızca
  yaklaşanları (son 3 gün dahil) ve herkese açık olanları listeliyor.
- Canlıda `/post/:id` ana sayfaya yönleniyor; bu kural kaldırılmalı. Bu
  branch'te `/post/{id}` uygulama kapısına gidiyor (`docs/deeplink.md`).

Taşımadan önce iki repo karşılaştırılmalı. Bu branch'in commit'leri
birbirinden bağımsız olduğu için tek tek cherry-pick edilebilir.

## 9. Arama motorları (opsiyonel)

Google Search Console'da `https://www.socioloc.app` mülkü doğrulanıp
`/sitemap.xml` gönderilebilir.

## 10. App Store kampanya ölçümü (opsiyonel)

**Kim:** App Store Connect erişimi olan kişi

Uygulama kapısı ve indirme linkleri iPhone'u App Store'a gönderirken
kampanya parametresi ekleyebilir; kurulumlar App Store Connect → App
Analytics → Sources altında kampanya bazında görünür.

1. App Store Connect → App Analytics → Campaigns → kampanya linki oluştur;
   linkteki `pt=` değeri sağlayıcı kimliğidir (yalnız rakam).
2. Vercel ortam değişkeni: `APP_STORE_PROVIDER_TOKEN=<pt değeri>`.

Tanımlanmazsa App Store'a parametresiz gidilir; başka bir şey değişmez.

## 11. Cloudflare: uygulama kapısı önbelleğe alınmamalı

**Kim:** DNS yöneticisi

`/post/*`, `/u/*`, `/app/*`, `/event/*/*` ve `/indir` yanıtları cihaza göre
değişir (iPhone → App Store, Android → Play, masaüstü → sayfa). Yanıtlar
`Cache-Control: private, no-store` taşıyor. Cloudflare'de "Cache Everything"
gibi HTML'i önbelleğe alan bir kural varsa bu yollar hariç tutulmalı; aksi
halde bir iPhone kullanıcısına masaüstü sayfası dönebilir.

**Doğrulama**

```bash
curl -sI -A "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" https://www.socioloc.app/u/test123 | grep -iE "^HTTP|^location|^cf-cache-status"
```

`302` ve App Store adresi dönmeli; `cf-cache-status: HIT` olmamalı.

## 12. AASA yolları mobil sürümden önce

**Kim:** Web ekibi, mobil sürüm mağazaya gönderilmeden önce (canlı site
başka depodan yayınlanıyor; değişiklik oraya taşınmalı, bkz.
`docs/deeplink.md` "Yayın sırası")

AASA artık `/u/*`, `/app/*` ve `/user/*` yollarını da içeriyor (29 Eyl 2026
kararı; önceki plan bunları yeni sürüm yaygınlaşınca eklemekti). Neden: yeni
sürüm işletme profilini `/u/{uid}` olarak paylaşıyor. Yol sahiplenilmezse
uygulaması olan iPhone kullanıcısı App Store'a düşer; bugün `/business/*`
uygulamayı açıyor. Eski sürümler bu yollarda uygulamayı ana sayfada açar,
çökmez (bkz. `docs/deeplink.md`).
