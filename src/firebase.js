// src/firebase.js
// Inicialización de Firebase — Sincronización Directa 2.0
// Se eliminó la persistencia en disco para asegurar integridad total entre dispositivos.

import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Conexión directa al servidor — Garantiza que todos los dispositivos vean lo mismo al instante.
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true
});
