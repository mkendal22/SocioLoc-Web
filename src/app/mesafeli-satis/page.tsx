import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LegalLayout } from "@/components/LegalLayout";
import { DISTANCE_SALE } from "@/lib/legal-texts";

export const metadata = {
  title: "Mesafeli Hizmet Satış Sözleşmesi",
  description:
    "SocioLoc etkinlik bileti satışları için mesafeli hizmet satış sözleşmesi, T-24 iptal hakkı, cayma istisnası ve tüketici başvuru yolları.",
  alternates: { canonical: "/mesafeli-satis" },
};

export default function Page() {
  return (
    <>
      <Header />
      <LegalLayout
        title="Mesafeli Hizmet Satış Sözleşmesi"
        intro="Etkinlik bileti SocioLoc tarafından kendi adına ve hesabına satılır. Organizatör bağımsız hizmet tedarikçisidir; biletin satıcısı değildir."
        body={DISTANCE_SALE}
        current="/mesafeli-satis"
      />
      <Footer />
    </>
  );
}
