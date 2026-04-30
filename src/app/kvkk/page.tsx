import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { KVKK } from "@/lib/legal-texts";

export const metadata = {
  title: "KVKK / Açık Rıza Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında SocioLoc açık rıza metni ve haklarınız.",
  alternates: { canonical: "/kvkk" },
};

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout
        title="KVKK / Açık Rıza Metni"
        intro="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, SocioLoc tarafından kişisel verilerinizin işlenmesine ilişkin açık rıza metni."
        body={KVKK}
        current="/kvkk"
      />
      <Footer />
    </>
  );
}
