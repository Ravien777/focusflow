import { initializeApp, FirebaseOptions, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

let app: ReturnType<typeof initializeApp> | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let initFailed = false;

export function isFirebaseAvailable(): boolean {
  return !initFailed;
}

export function getFirebaseApp() {
  if (initFailed) return null;
  if (!app) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    } catch {
      initFailed = true;
      return null;
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (initFailed) return null;
  if (!auth) {
    try {
      const a = getFirebaseApp();
      if (!a) return null;
      auth = getAuth(a);
    } catch {
      initFailed = true;
      return null;
    }
  }
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  if (initFailed) return null;
  if (!db) {
    try {
      const a = getFirebaseApp();
      if (!a) return null;
      db = getFirestore(a);
    } catch {
      initFailed = true;
      return null;
    }
  }
  return db;
}
