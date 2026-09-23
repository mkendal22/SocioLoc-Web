import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { PRIVACY } from "@/lib/legal-texts";

export const metadata = {
  title: "Gizlilik Politikası",
  description:
    "SocioLoc gizlilik politikası: işlenen veriler, iyzico ödemeleri, organizatör paylaşımı, konum izinleri ve KVKK haklarınız.",
  alternates: { canonical: "/gizlilik" },
};

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout
        title="Gizlilik Politikası"
        intro="Bu politika, www.socioloc.app ve SocioLoc mobil uygulamasındaki genel gizlilik uygulamalarını açıklar. 6698 sayılı Kanun kapsamındaki aydınlatma, ayrıca yayımlanan KVKK Aydınlatma Metni ile yapılır."
        body={PRIVACY}
        current="/gizlilik"
      />
      <Footer />
    </>
  );
}
