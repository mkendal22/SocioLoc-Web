"use client";

import Link from "next/link";

/**
 * Kök yerleşimin (layout) kendisi çökerse gösterilen son çare sayfası. Kök
 * layout ve stilleri devrede olmadığı için kendi <html>/<body>'sini ve satır içi
 * stilini taşır (10 Eki 2026'ya dek Next'in İngilizce varsayılanı çıkıyordu).
 */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#07060c",
          color: "#f5f3ff",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Bir şeyler ters gitti</h1>
          <p style={{ marginTop: 12, color: "rgba(245,243,255,0.65)", lineHeight: 1.6 }}>
            Sayfa şu an yüklenemedi. Biraz sonra yeniden deneyebilirsin.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                height: 44,
                padding: "0 24px",
                borderRadius: 999,
                border: "none",
                background: "#7c3aed",
                color: "#fff",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Tekrar dene
            </button>
            <Link
              href="/"
              style={{
                height: 44,
                padding: "0 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(245,243,255,0.85)",
                fontSize: 14,
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              Ana sayfa
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
