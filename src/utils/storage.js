// src/utils/storage.js
// Capa de datos — Firebase Firestore en producción, localStorage como fallback en dev local

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";

/* ── Hash de Contraseñas (SHA-256) ──────────────────────── */
export async function hashPassword(pwd) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pwd);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
import { db } from "../firebase";

/* ── Colecciones de Firestore ───────────────────────────── */
const COLL = {
  USERS:   "users",
  RESULTS: "results",
};

/* ══ SuperAdmin por defecto ════════════════════════════════
   Se crea automáticamente si la colección de usuarios está vacía.
   ═══════════════════════════════════════════════════════════ */
const SUPER_ADMIN_DEFAULT = {
  id:       "superadmin",
  name:     "Super Administrador",
  email:    "safecamgm@gmail.com",
  username: "safecamgm@gmail.com",
  password: "89862ec8c9fec7667622decac563b1ea4397d106d6882fd85d45241b665372a8", // Hash SHA-256
  role:     "admin",
  active:   true,
};

/* ─────────────────────────────────────────────────────────
   INICIALIZACIÓN — crea el SuperAdmin si no existe ningún usuario
   ───────────────────────────────────────────────────────── */
export async function initDB() {
  try {
    // Forzar siempre a la cuenta SuperAdmin a usar la contraseña encriptada si alguien intenta sobreescribir u obviar el hash.
    // Usamos merge: true para no borrar otros campos (si de casualidad hubo cambios de active)
    await setDoc(
      doc(db, COLL.USERS, SUPER_ADMIN_DEFAULT.id),
      SUPER_ADMIN_DEFAULT,
      { merge: true }
    );
  } catch (e) {
    console.error("[storage] initDB error:", e);
  }
}

/* ─────────────────────────────────────────────────────────
   RESULTADOS
   ───────────────────────────────────────────────────────── */

/** Obtiene todos los resultados ordenados del más reciente al más antiguo */
export async function getResults() {
  try {
    const q    = query(collection(db, COLL.RESULTS), orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
  } catch (e) {
    console.error("[storage] getResults error:", e);
    return [];
  }
}

/** Escucha resultados en tiempo real */
export function subscribeResults(callback) {
  const q = query(collection(db, COLL.RESULTS), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ ...d.data(), _docId: d.id })));
  });
}

/** Agrega un nuevo resultado de examen */
export async function addResult(result) {
  try {
    await addDoc(collection(db, COLL.RESULTS), result);
  } catch (e) {
    console.error("[storage] addResult error:", e);
  }
}

/** Elimina un resultado por su ID de documento Firestore */
export async function deleteResult(docId) {
  try {
    await deleteDoc(doc(db, COLL.RESULTS, docId));
  } catch (e) {
    console.error("[storage] deleteResult error:", e);
  }
}

/* ─────────────────────────────────────────────────────────
   USUARIOS
   ───────────────────────────────────────────────────────── */

/** Obtiene todos los usuarios */
export async function getUsers() {
  try {
    const snap = await getDocs(collection(db, COLL.USERS));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("[storage] getUsers error:", e);
    return [];
  }
}

/** Escucha la lista de usuarios en tiempo real */
export function subscribeUsers(callback) {
  return onSnapshot(collection(db, COLL.USERS), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

/** Busca un usuario activo por username o email + contraseña encriptada (Velocidad <1s) */
export async function findUser(usernameOrEmail, password) {
  try {
    const hashed = await hashPassword(password);
    const term = usernameOrEmail.trim().toLowerCase();
    
    let q = query(
      collection(db, COLL.USERS),
      where("username", "==", term),
      where("password", "==", hashed),
      where("active", "==", true),
      limit(1)
    );
    let snap = await getDocs(q);
    
    if (snap.empty) {
      q = query(
        collection(db, COLL.USERS),
        where("email", "==", term),
        where("password", "==", hashed),
        where("active", "==", true),
        limit(1)
      );
      snap = await getDocs(q);
    }

    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() };
    }
  } catch (e) {
    console.error("[storage] findUser error:", e);
  }
  return null;
}

/** Crea un nuevo usuario encriptando su contraseña */
export async function addUser(userData) {
  try {
    const hashedPwd = await hashPassword(userData.password);
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      password: hashedPwd,
      active: true,
    };
    await setDoc(doc(db, COLL.USERS, newUser.id), newUser);
    return newUser;
  } catch (e) {
    console.error("[storage] addUser error:", e);
  }
}

/** Guarda todos los usuarios (útil para actualizaciones en lote) */
export async function saveUsers(users) {
  // No se usa en la implementación Firestore — usamos updateUser
}

/** Activa / desactiva un usuario */
export async function toggleUserActive(id) {
  if (id === "superadmin") return; // protegido
  try {
    const ref  = doc(db, COLL.USERS, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    await setDoc(ref, { ...snap.data(), active: !snap.data().active });
  } catch (e) {
    console.error("[storage] toggleUserActive error:", e);
  }
}

/** Elimina un usuario */
export async function deleteUser(id) {
  if (id === "superadmin") throw new Error("No puedes eliminar al Super Administrador.");
  try {
    await deleteDoc(doc(db, COLL.USERS, id));
  } catch (e) {
    console.error("[storage] deleteUser error:", e);
    throw e;
  }
}
