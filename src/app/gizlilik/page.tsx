import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Gizlilik Politikası",
  description:
    "SocioLoc gizlilik politikası: hangi verileri topluyoruz, nasıl kullanıyoruz ve haklarınız nelerdir.",
};

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1 container-x py-20 max-w-3xl prose prose-invert">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Gizlilik Politikası</h1>
        <p className="mt-4 text-white/65">
          Bu sayfa, SocioLoc&apos;un kişisel verilerinizi nasıl işlediğini açıklayan
          taslaktır. Yayına alınmadan önce hukuki danışmanlık ile gözden geçirilmesi önerilir.
        </p>
        {/* TODO: Tam politika metni eklenecek */}
      </main>
      <Footer />
    </>
  );
}
