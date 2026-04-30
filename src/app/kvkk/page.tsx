import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "SocioLoc KVKK aydınlatma metni.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 container-x py-20 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">KVKK Aydınlatma Metni</h1>
        <p className="mt-4 text-white/65">
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanan aydınlatma
          metninin tam hali yakında eklenecektir.
        </p>
      </main>
      <Footer />
    </>
  );
}
