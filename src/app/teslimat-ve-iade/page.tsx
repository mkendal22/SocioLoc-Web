import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { DELIVERY } from "@/lib/legal-texts";

export const metadata = {
  title: "Teslimat, İptal ve İade Şartları",
  description:
    "SocioLoc etkinlik biletlerinde elektronik teslimat, T-24 iptal kuralı, etkinlik iptali/ertelenmesi ve iyzico iade koşulları.",
  alternates: { canonical: "/teslimat-ve-iade" },
};

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout
        title="Teslimat, İptal ve İade Şartları"
        intro="Ücretli etkinlik biletlerinin satıcısı Socioloc Teknoloji Anonim Şirketi’dir. Organizatör biletin satıcısı veya ödemeyi tahsil eden taraf değildir."
        body={DELIVERY}
        current="/teslimat-ve-iade"
      />
      <Footer />
    </>
  );
}
