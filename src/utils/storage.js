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
  updateDoc,
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
/** Inicializa datos básicos */
export async function initDB() {
  try {
    const ref = doc(db, COLL.USERS, SUPER_ADMIN_DEFAULT.id);
    // Usamos setDoc con merge para asegurar el superadmin sin bloquear el hilo principal
    setDoc(ref, SUPER_ADMIN_DEFAULT, { merge: true })
      .then(() => console.log("[storage] initDB: SuperAdmin verificado."))
      .catch(e => console.error("[storage] initDB error:", e));
  } catch (e) {
    console.error("[storage] initDB error fatal:", e);
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
export function subscribeResults(callback, onError = null) {
  const q = query(collection(db, COLL.RESULTS), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ ...d.data(), _docId: d.id })));
  }, (err) => {
    console.error("[storage] subscribeResults error:", err);
    if(onError) onError(err);
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
export function subscribeUsers(callback, onError = null) {
  return onSnapshot(collection(db, COLL.USERS), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, (err) => {
    console.error("[storage] subscribeUsers error:", err);
    if(onError) onError(err);
  });
}

/** Busca un usuario activo (Filtrado local para evitar latencia de queries en la nube) */
export async function findUser(usernameOrEmail, password) {
  try {
    const hashed = await hashPassword(password);
    const term = usernameOrEmail.trim().toLowerCase();
    
    console.log("[storage] Buscando usuario:", term);
    
    // Obtenemos todos los usuarios (colección pequeña) para filtrar localmente.
    // Esto es mucho más rápido y resiliente a fallos de conexión que 'where' query.
    const all = await getUsers();
    
    const found = all.find(u => 
      (u.username?.toLowerCase() === term || u.email?.toLowerCase() === term) &&
      u.password === hashed &&
      u.active === true
    );

    if (found) {
      console.log("[storage] Usuario encontrado con éxito.");
      return found;
    }
    console.warn("[storage] Usuario no encontrado o inactivo.");
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
    console.log("[storage] Guardando nuevo usuario:", newUser.username);
    // No usamos 'await' aquí para que la UI no se cuelgue si el servidor tarda
    setDoc(doc(db, COLL.USERS, newUser.id), newUser)
      .then(() => console.log("[storage] Usuario guardado en la nube."))
      .catch(err => console.error("[storage] Error guardando usuario:", err));
    
    return newUser;
  } catch (e) {
    console.error("[storage] addUser error:", e);
    throw e;
  }
}

/** Guarda todos los usuarios (útil para actualizaciones en lote) */
export async function saveUsers(users) {
  // No se usa en la implementación Firestore — usamos updateUser
}

/** Activa / desactiva un usuario */
export async function toggleUserActive(id, currentStatus) {
  if (id === "superadmin") return; 
  try {
    const ref = doc(db, COLL.USERS, id);
    await updateDoc(ref, { active: !currentStatus });
    console.log(`[storage] User ${id} active status toggled to ${!currentStatus}`);
  } catch (e) {
    console.error("[storage] toggleUserActive error:", e);
    throw e;
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
