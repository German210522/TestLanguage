// src/firebase.js
// Inicialización de Firebase sin persistencia para evitar bloqueos en Brave

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId:             import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
};

const app = initializeApp(firebaseConfig);

// Desactivamos la caché persistente (IndexedDB) para evitar bloqueos infinitos
// en navegadores como Brave y asegurar la sincronización en tiempo real.
export const db = getFirestore(app);
