import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { COMMERCIAL } from "@/lib/legal-texts";

export const metadata = {
  title: "Ticari Elektronik İleti Aydınlatma Metni",
  description:
    "6563 sayılı Kanun kapsamında SocioLoc ticari elektronik ileti aydınlatma metni, onay ve ret hakkınız.",
  alternates: { canonical: "/ticari-elektronik-ileti" },
};

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout
        title="Ticari Elektronik İleti Aydınlatma Metni"
        intro="SMS, e-posta ve arama yoluyla göndereceğimiz ticari elektronik iletilere ilişkin aydınlatma metni ve onay/ret haklarınız."
        body={COMMERCIAL}
        current="/ticari-elektronik-ileti"
      />
      <Footer />
    </>
  );
}
