import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { KVKK } from "@/lib/legal-texts";

export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında SocioLoc aydınlatma metni: veri sorumlusu, işleme amaçları, iyzico, haklar ve başvuru usulü.",
  alternates: { canonical: "/kvkk" },
};

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout
        title="KVKK Aydınlatma Metni"
        intro="Bu metin bir açık rıza metni değildir. Açık rızaya dayalı bir işlem varsa rıza talebi bu aydınlatmadan ayrı sunulur."
        body={KVKK}
        current="/kvkk"
      />
      <Footer />
    </>
  );
}
