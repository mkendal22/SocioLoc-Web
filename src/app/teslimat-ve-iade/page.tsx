import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { getLegalDoc, legalMetadata } from "@/lib/legal";

// Metin: content/legal/teslimat-ve-iade.md
export const metadata = legalMetadata("teslimat-ve-iade");

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout doc={getLegalDoc("teslimat-ve-iade")} />
      <Footer />
    </>
  );
}
