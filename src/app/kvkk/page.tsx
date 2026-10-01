import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { getLegalDoc, legalMetadata } from "@/lib/legal";

// Metin: content/legal/kvkk.md
export const metadata = legalMetadata("kvkk");

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout doc={getLegalDoc("kvkk")} />
      <Footer />
    </>
  );
}
