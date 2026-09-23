import "server-only";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  cert,
  getApps,
  initializeApp,
  applicationDefault,
  type ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _adminDb: Firestore | null | undefined;

function resolveAccountPath(): string | null {
  const p = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!p) return null;
  return path.isAbsolute(p) ? p : path.join(process.cwd(), p);
}


export function getAdminFirestore(): Firestore | null {
  if (_adminDb !== undefined) return _adminDb;

  try {
    if (getApps().length === 0) {
      const accountPath = resolveAccountPath();
      const b64 =
        process.env.FIREBASE_SERVICE_ACCOUNT_BASE64?.replace(/\s/g, "") ?? "";
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();

      if (accountPath) {
        if (!existsSync(accountPath)) {
          console.error(
            `[firebase-admin] Dosya yok: ${accountPath} (FIREBASE_SERVICE_ACCOUNT_PATH)`,
          );
          _adminDb = null;
          return null;
        }
        const json = JSON.parse(readFileSync(accountPath, "utf8"));
        initializeApp({ credential: cert(json as ServiceAccount) });
      } else if (b64) {
        const json = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
        initializeApp({ credential: cert(json as ServiceAccount) });
      } else if (raw) {
        const json = JSON.parse(raw);
        initializeApp({ credential: cert(json as ServiceAccount) });
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        initializeApp({ credential: applicationDefault() });
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "[firebase-admin] Servis hesabı yok: FIREBASE_SERVICE_ACCOUNT_PATH veya FIREBASE_SERVICE_ACCOUNT_BASE64 ekle. .env.local kaydedildi mi (Cmd+S)?",
          );
        }
        _adminDb = null;
        return null;
      }
    }
    _adminDb = getFirestore();
    if (process.env.NODE_ENV === "development") {
      console.info("[firebase-admin] Firestore Admin hazır.");
    }
    return _adminDb;
  } catch (e) {
    console.error(
      "[firebase-admin] Başlatılamadı (JSON/base64/dosya hatalı olabilir):",
      e,
    );
    _adminDb = null;
    return null;
  }
}
