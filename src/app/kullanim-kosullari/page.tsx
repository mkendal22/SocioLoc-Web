import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { LAST_UPDATED_LEGACY, TERMS } from "@/lib/legal-texts";

export const metadata = {
  title: "Kullanım Koşulları",
  description:
    "SocioLoc uygulaması ve socioloc.app web sitesi için geçerli kullanım koşulları, sorumluluklar ve uygulanacak hukuk.",
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout
        title="Kullanım Koşulları"
        intro="SocioLoc uygulamasını veya web sitesini kullanmadan önce lütfen aşağıdaki kullanım koşullarını okuyunuz. Hizmetimizden yararlanmanız bu koşulları kabul ettiğiniz anlamına gelir."
        body={TERMS}
        current="/kullanim-kosullari"
        updated={LAST_UPDATED_LEGACY}
      />
      <Footer />
    </>
  );
}
