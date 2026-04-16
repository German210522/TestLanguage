// src/utils/storage.js
// Capa de datos — Firebase Firestore en producción, localStorage como fallback en dev local

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
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
    await setDoc(ref, SUPER_ADMIN_DEFAULT, { merge: true });
    console.log("[storage] initDB: SuperAdmin verificado.");
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

/** Agrega un nuevo resultado de examen — Normaliza tipos para Firestore Rules */
export async function addResult(result) {
  try {
    const cleanResult = {
      ...result,
      score: Number(result.score || 0),
      pct: Number(result.pct || 0),
      timestamp: result.timestamp || new Date().toISOString()
    };
    await addDoc(collection(db, COLL.RESULTS), cleanResult);
  } catch (e) {
    console.error("[storage] addResult error:", e);
    if (e.message.includes("permission")) {
      alert("Error de Sincronización: El servidor rechazó el resultado. Verifica que las reglas de Firestore estén actualizadas.");
    }
    throw e;
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

/** Obtiene todos los usuarios — Conexión directa al servidor para integridad total */
export async function getUsers() {
  try {
    const colRef = collection(db, COLL.USERS);
    const snap = await getDocs(colRef);
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

/** Busca un usuario para login — Caché primero, servidor como respaldo */
export async function findUser(usernameOrEmail, password) {
  try {
    const term = usernameOrEmail.trim().toLowerCase();
    const pwd  = password.trim();
    const hashed = await hashPassword(pwd);
    
    const colRef = collection(db, COLL.USERS);

    // 1. Intento rápido (caché local — instantáneo)
    try {
      const cacheSnap = await getDocsFromCache(colRef);
      const cached = cacheSnap.docs.map(d => ({ id: d.id, ...d.data() })).find(u =>
        (u.username?.toLowerCase() === term || u.email?.toLowerCase() === term) &&
        u.password === hashed && u.active === true
      );
      if (cached) {
        console.log("[storage] Login instantáneo (caché)");
        return cached;
      }
    } catch (e) { /* caché vacío o no disponible — continuamos */ }

    // 2. Respaldo: consulta al servidor (para usuarios recién creados)
    console.log("[storage] No encontrado en caché, consultando servidor...");
    const snap = await getDocs(colRef);
    const found = snap.docs.map(d => ({ id: d.id, ...d.data() })).find(u => 
      (u.username?.toLowerCase() === term || u.email?.toLowerCase() === term) &&
      u.password === hashed && u.active === true
    );

    if (found) {
      console.log("[storage] Login exitoso (servidor)");
      return found;
    }
    
    console.warn("[storage] Credenciales inválidas o usuario inactivo.");
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
      email: userData.email || userData.username, // Fallback: username como email para login
      password: hashedPwd,
      active: true,
    };
    console.log("[storage] Guardando nuevo usuario:", newUser.username);
    await setDoc(doc(db, COLL.USERS, newUser.id), newUser);
    console.log("[storage] Usuario guardado en la nube.");
    return newUser;
  } catch (e) {
    console.error("[storage] addUser error:", e);
    if (e.message.includes("permission")) {
      alert("Error de Seguridad: No tienes permisos para crear usuarios. Por favor, asegúrate de haber actualizado las reglas de Firestore.");
    }
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
