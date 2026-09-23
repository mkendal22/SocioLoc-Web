import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { getLegalDoc, legalMetadata } from "@/lib/legal";

// Metin: content/legal/kullanim-kosullari.md
export const metadata = legalMetadata("kullanim-kosullari");

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout doc={getLegalDoc("kullanim-kosullari")} />
      <Footer />
    </>
  );
}
