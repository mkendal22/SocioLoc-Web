# Kod dışı ayarlar: kontrol listesi

Sitenin ve derin linklerin tam çalışması için kod dışında yapılması gereken
ayarlar. Her maddede kim, nerede ve nasıl doğrulanacağı yazıyor.

## Durum (7 Ekim 2026)

`fix/site-iyilestirmeleri` dalı `main`'e birleşti (PR #1) ve canlı sitenin
içeriği `main` ile aynı. Aşağıdaki durumlar canlı siteye yapılan sorgularla
ölçüldü; "bakılmadı" yazanlar ölçülmedi.

| Madde | Durum |
|---|---|
| 1. Apex alan adı | Açık: hâlâ 307, `/.well-known` dahil. Derin linkleri engellemiyor |
| 2. SHA-256 parmak izi | Tamam: canlıda, Google doğruluyor |
| 3. iOS Associated Domains | Tamam: değişiklik gerekmiyor |
| 4. Firebase Admin değişkeni | Tamam: etkinlik sayfaları ve sitemap veri dönüyor |
| 5. Firebase web yapılandırması | Bakılmadı (düşük öncelik) |
| 6. Cloudflare proxy | Açık: yanıtlar hâlâ Cloudflare'den geçiyor |
| 7. CSP zorunlu mod | Açık: canlıda hâlâ rapor modunda |
| 8. Canlı repoya taşıma | Tamam |
| 9. Arama motorları | Bakılmadı (opsiyonel) |
| 10. App Store kampanya ölçümü | Tanımlı değil (opsiyonel) |
| 11. Kapı önbelleğe alınmamalı | Tamam: `cf-cache-status: DYNAMIC` |
| 12. AASA yolları | Tamam: canlıda |

## 1. Vercel: apex alan adını projeye bağla

**Kim:** Vercel projesine erişimi olan kişi (Melik)

Şu an `socioloc.app` → `www.socioloc.app` yönlendirmesini Vercel alan adı
ayarı yapıyor: 307 (geçici) ve `/.well-known` dosyaları dahil her şeyi
yönlendiriyor. Derin linkler bu haliyle de çalışıyor (7 Eki 2026):

- Google doğrulamada yönlendirme izlemiyor; apex için Digital Asset Links
  sorgusu `ERROR_CODE_REDIRECT` veriyor. Uygulamanın Android manifesti yalnız
  `www.socioloc.app` adresini sahiplendiği için engel değil.
- Apple'ın CDN'i apex için de dosyayı veriyor (`Apple-From` başlığında önce
  apex, sonra www adresi). Apple dosyanın yönlendirmesiz sunulmasını şart
  koştuğu için buna güvenilmemeli.
- Uygulamanın paylaştığı linkler hep `www.socioloc.app` ile başlıyor.

Madde, apex yönlendirmesinin kalıcı (308) olması ve doğrulama dosyalarının
iki alan adında da yönlendirmesiz sunulması için hâlâ yapılmalı.

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

7 Eki 2026'da ikisi de 307 dönüyor.

## 2. Play Console: SHA-256 parmak izini teyit et

**Kim:** Mobil ekip (Play Console erişimi olan)

Canlıdaki `assetlinks.json` aşağıdaki iki değeri taşıyor ve Google'ın
doğrulama servisi Play imzasıyla `linked: true` dönüyor (7 Eki 2026). Bu
ölçüm Google'ın servisiyle yapıldı; cihazda `pm get-app-links` çıktısına
bakılmadı.

- `D4:DB:CA:AA:40:E1:6F:03:25:8B:11:F0:FB:9D:6D:E7:2F:42:F1:97:BE:E2:67:A5:0F:B5:5F:79:15:C5:E2:4F`:
  Play uygulama imzalama sertifikası (SHA-1 `A7:CD:0D:0C:…:5F:FD`). Play
  Store'dan kurulu uygulamanın imzası cihazdan okunarak bulundu (`adb pull` +
  `apksigner verify --print-certs`, 1 Eki 2026). Aynı değer Firebase'e de
  eklendi; Android App Check bununla düzeldi.
- `B7:83:E8:E8:8C:EC:B7:A1:8B:AF:13:AF:86:9B:1A:E9:B6:96:78:57:1C:68:F5:04:75:0D:E5:91:65:90:D9:58`:
  Firebase'deki Android uygulamasına kayıtlı, debug olmayan değer. Play
  imzalama sertifikasına ait değil (büyük ihtimalle yükleme anahtarı);
  zararsız olduğu için duruyor.

Firebase'de kayıtlı diğer SHA-256 değeri (`AA:DA:29:D9:…:09:D2`) bir
geliştirici bilgisayarındaki `debug.keystore`'a ait; assetlinks'e
**eklenmemeli**.

Geçmiş: 29 Eylül 2026'da dosyaya yalnız `B7:83:…` yazılmış ve Play imzası
sanılmıştı; 1 Ekim'de yanlış olduğu anlaşıldı. O tarihte canlı dosya yer
tutucuydu (`BURAYA_ANDROID_KEYSTORE_SHA256_PARMAK_IZI_GELECEK`) ve Google
reddediyordu.

Yeniden teyit etmek için ya da anahtar değişirse:

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
`applinks:www.socioloc.app` içeriyor. Apple CDN iki alan adı için de güncel
dosyayı (altı yol) veriyor (7 Eki 2026). Apex, Apple CDN yönlendirmeyi
izlediği için çalışıyor; kalıcı çözüm 1. madde.

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

Tamamlandı (7 Eki 2026 ölçümü): canlı sitenin içeriği bu deponun `main`
dalıyla aynı.

- AASA altı yolu içeriyor, `assetlinks.json` gerçek parmak izlerini taşıyor.
- `/post/{id}` artık ana sayfaya yönlenmiyor; `/u/…`, `/app/…` ve
  `/event/{id}/…` ile birlikte uygulama kapısına gidiyor
  (`docs/deeplink.md`). `/indir` çalışıyor.
- Sitemap'teki dört etkinliğin hepsi yaklaşan etkinlik.
- Son commit'teki (`9f60fc3`) destek telefonu yayında, eski numara yok.

Sitenin hangi depodan ve nasıl yayınlandığı Vercel ayarında durur, bu depodan
görülmez. `main`'e giren bir değişikliğin canlıya çıktığını
`docs/deeplink.md` "Yayın sırası" altındaki komutlarla doğrula.

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

**Kim:** Web ekibi, yeni bir yol paylaşan mobil sürüm mağazaya gönderilmeden
önce (bkz. `docs/deeplink.md` "Yayın sırası")

AASA `/u/*`, `/app/*` ve `/user/*` yollarını da içeriyor ve canlıda (29 Eyl
2026 kararı; önceki plan bunları yeni sürüm yaygınlaşınca eklemekti). Neden:
yeni sürüm işletme profilini `/u/{uid}` olarak paylaşıyor. Yol
sahiplenilmeseydi uygulaması olan iPhone kullanıcısı App Store'a düşerdi;
eski `/business/*` uygulamayı açıyordu. Eski sürümler (1.0.25 ve öncesi) bu
yollarda uygulamayı açar ama hedef ekrana gitmez, çökmez (bkz.
`docs/deeplink.md`).
