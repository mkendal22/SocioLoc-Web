import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { PRIVACY } from "@/lib/legal-texts";

export const metadata = {
  title: "Gizlilik Politikası",
  description:
    "SocioLoc gizlilik politikası: hangi verileri topluyoruz, nasıl kullanıyoruz, KVKK kapsamındaki haklarınız ve başvuru yolları.",
  alternates: { canonical: "/gizlilik" },
};

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout
        title="Gizlilik Politikası"
        intro="SocioLoc olarak kişisel verilerinizin güvenliği bizim için önemlidir. Aşağıda hangi verileri neden topladığımızı ve KVKK kapsamındaki haklarınızı bulabilirsiniz."
        body={PRIVACY}
        current="/gizlilik"
      />
      <Footer />
    </>
  );
}
