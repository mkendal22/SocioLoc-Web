import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { getLegalDoc, legalMetadata } from "@/lib/legal";

// Metin: content/legal/mesafeli-satis.md
export const metadata = legalMetadata("mesafeli-satis");

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout doc={getLegalDoc("mesafeli-satis")} />
      <Footer />
    </>
  );
}
