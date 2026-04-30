import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Kullanım Şartları",
  description: "SocioLoc kullanım şartları.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 container-x py-20 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Kullanım Şartları</h1>
        <p className="mt-4 text-white/65">
          SocioLoc&apos;u kullanarak bu kullanım şartlarını kabul etmiş olursunuz.
          Tam metin yakında eklenecektir.
        </p>
      </main>
      <Footer />
    </>
  );
}
