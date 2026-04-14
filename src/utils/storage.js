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
} from "firebase/firestore";
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
  username: "safecamgm@gmail.com",   // login con correo
  password: "German7@",
  role:     "admin",
  active:   true,
};

/* ─────────────────────────────────────────────────────────
   INICIALIZACIÓN — crea el SuperAdmin si no existe ningún usuario
   ───────────────────────────────────────────────────────── */
export async function initDB() {
  try {
    const snap = await getDocs(collection(db, COLL.USERS));
    if (snap.empty) {
      await setDoc(
        doc(db, COLL.USERS, SUPER_ADMIN_DEFAULT.id),
        SUPER_ADMIN_DEFAULT
      );
    }
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
    return snap.docs.map(d => d.data());
  } catch (e) {
    console.error("[storage] getUsers error:", e);
    return [];
  }
}

/** Busca un usuario activo por username o email + contraseña */
export async function findUser(usernameOrEmail, password) {
  try {
    const users = await getUsers();
    const term  = usernameOrEmail.trim().toLowerCase();
    return users.find(u =>
      (u.username?.toLowerCase() === term || u.email?.toLowerCase() === term) &&
      u.password === password &&
      u.active
    ) || null;
  } catch (e) {
    console.error("[storage] findUser error:", e);
    return null;
  }
}

/** Crea un nuevo usuario */
export async function addUser(userData) {
  try {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
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
