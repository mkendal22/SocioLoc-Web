import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyChXFNrscSnicXiQJCO5S2YP49Se9K80QM",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "sociolock-4cbc3.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "sociolock-4cbc3",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "sociolock-4cbc3.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "692563904185",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:692563904185:android:ffe74b5cc1e9dbd8b23d68",
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    ? { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }
    : {}),
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let _db: Firestore | null = null;

/**
 * Next.js sunucu ortamında Firestore bazen WebChannel/gRPC ile düşer.
 * Long polling bu senaryoda bağlantıyı stabilize eder.
 *
 * Not: `experimentalAutoDetectLongPolling` ile birlikte verilirse Firebase
 * "cannot be used together" hatası fırlatır ve ayar hiç uygulanmaz;
 * bu yüzden yalnızca zorunlu long polling açık.
 */
export function getDb(): Firestore {
  if (_db) return _db;
  const app = getFirebaseApp();
  try {
    _db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } catch {
    // Aynı process içinde Firestore zaten başlatıldıysa
    _db = getFirestore(app);
  }
  return _db;
}
