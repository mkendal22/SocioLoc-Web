import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { getLegalDoc, legalMetadata } from "@/lib/legal";

// Metin: content/legal/gizlilik.md
export const metadata = legalMetadata("gizlilik");

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout doc={getLegalDoc("gizlilik")} />
      <Footer />
    </>
  );
}
