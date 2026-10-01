import "server-only";
import { renderSVG } from "uqr";

/**
 * Masaüstünde "telefonunla okut" için SVG QR kodu. Girdi yalnız kendi
 * linklerimiz; üçüncü taraf bir QR servisine istek gitmez.
 */
export function qrSvg(url: string): string {
  return renderSVG(url, { ecc: "M", border: 2, whiteColor: "#ffffff", blackColor: "#07060c" });
}
