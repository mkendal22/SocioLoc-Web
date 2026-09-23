import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Next.js derleyicide "server-only"yi sunucu tarafında boşa çıkarır;
      // testler de sunucu kodu gibi davransın.
      "server-only": fileURLToPath(new URL("./test/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Bilerek İstanbul dışı bir saat dilimi: sonuçlar sunucunun (Vercel: UTC)
    // saat diliminden bağımsız olmalı. Bkz. time.test.ts'teki koruma testi.
    env: { TZ: "America/Los_Angeles" },
  },
});
