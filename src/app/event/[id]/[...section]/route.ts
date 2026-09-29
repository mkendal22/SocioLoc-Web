import { appGate } from "@/lib/app-gate";

// Uygulama kapısı (src/lib/app-gate.ts): uygulama yoksa mağazaya ya da sade
// sayfaya gider. Yanıt istemciye göre değiştiği için her istekte üretilir.
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return appGate(request);
}
