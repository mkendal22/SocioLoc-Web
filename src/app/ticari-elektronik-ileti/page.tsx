import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { getLegalDoc, legalMetadata } from "@/lib/legal";

// Metin: content/legal/ticari-elektronik-ileti.md
export const metadata = legalMetadata("ticari-elektronik-ileti");

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout doc={getLegalDoc("ticari-elektronik-ileti")} />
      <Footer />
    </>
  );
}
