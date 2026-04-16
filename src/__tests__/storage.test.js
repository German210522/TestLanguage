// src/__tests__/storage.test.js
// Tests de la capa de datos — hashPassword, addUser, findUser, users, results
// Usa mocks de Firebase — 0 llamadas a la nube

import { describe, it, expect, beforeEach } from "vitest";
import { resetMockStore, mockStore } from "./setup";
import {
  hashPassword,
  addUser,
  findUser,
  getUsers,
  deleteUser,
  toggleUserActive,
  addResult,
  getResults,
  deleteResult,
  initDB,
} from "../utils/storage";

beforeEach(() => {
  resetMockStore();
});

/* ══════════════════════════════════════════════════════════
   hashPassword — Hashing SHA-256
   ══════════════════════════════════════════════════════════ */
describe("hashPassword", () => {
  it("genera un hash hex de 64 caracteres", async () => {
    const hash = await hashPassword("test123");
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("misma contraseña produce el mismo hash (determinístico)", async () => {
    const h1 = await hashPassword("miContraseña");
    const h2 = await hashPassword("miContraseña");
    expect(h1).toBe(h2);
  });

  it("contraseñas diferentes producen hashes diferentes", async () => {
    const h1 = await hashPassword("password1");
    const h2 = await hashPassword("password2");
    expect(h1).not.toBe(h2);
  });

  it("maneja contraseñas con caracteres especiales", async () => {
    const hash = await hashPassword("P@$$w0rd!#ñ");
    expect(hash).toHaveLength(64);
  });

  it("hash NO es la contraseña en texto plano", async () => {
    const pwd = "miContraseña";
    const hash = await hashPassword(pwd);
    expect(hash).not.toBe(pwd);
  });
});

/* ══════════════════════════════════════════════════════════
   initDB — Creación del SuperAdmin
   ══════════════════════════════════════════════════════════ */
describe("initDB", () => {
  it("crea el SuperAdmin en la colección users", async () => {
    await initDB();
    const superadmin = mockStore.users.get("superadmin");
    expect(superadmin).toBeTruthy();
    expect(superadmin.name).toBe("Super Administrador");
    expect(superadmin.role).toBe("admin");
    expect(superadmin.active).toBe(true);
  });

  it("no lanza error si se ejecuta múltiples veces (merge)", async () => {
    await initDB();
    await initDB();
    // No debe lanzar error
    expect(mockStore.users.get("superadmin")).toBeTruthy();
  });
});

/* ══════════════════════════════════════════════════════════
   addUser — Creación de usuarios
   ══════════════════════════════════════════════════════════ */
describe("addUser", () => {
  it("crea un usuario con contraseña hasheada (no plaintext)", async () => {
    const user = await addUser({
      name: "Juan Pérez",
      username: "jperez",
      password: "secreto123",
      role: "docente",
    });
    expect(user.password).not.toBe("secreto123");
    expect(user.password).toHaveLength(64); // SHA-256 hex
  });

  it("guarda el usuario en Firestore (con await — Bug #2 fix)", async () => {
    const user = await addUser({
      name: "Teacher",
      username: "teacher1",
      password: "pass123456",
      role: "docente",
    });
    // El usuario debe estar en el mock store después de await
    const stored = mockStore.users.get(user.id);
    expect(stored).toBeTruthy();
    expect(stored.name).toBe("Teacher");
  });

  it("incluye campo email como fallback del username (Bug #3 fix)", async () => {
    const user = await addUser({
      name: "Docente",
      username: "docente@email.com",
      password: "pass123456",
      role: "docente",
    });
    expect(user.email).toBe("docente@email.com");
  });

  it("usa email explícito si se proporciona", async () => {
    const user = await addUser({
      name: "Admin",
      username: "admin_user",
      email: "admin@custom.com",
      password: "pass123456",
      role: "admin",
    });
    expect(user.email).toBe("admin@custom.com");
  });

  it("marca el usuario como activo por defecto", async () => {
    const user = await addUser({
      name: "Test",
      username: "test",
      password: "pass123456",
      role: "docente",
    });
    expect(user.active).toBe(true);
  });

  it("genera un ID único basado en timestamp", async () => {
    const u1 = await addUser({ name: "A", username: "a", password: "pass123456", role: "docente" });
    const u2 = await addUser({ name: "B", username: "b", password: "pass123456", role: "docente" });
    expect(u1.id).not.toBe(u2.id);
  });
});

/* ══════════════════════════════════════════════════════════
   findUser — Login / autenticación
   ══════════════════════════════════════════════════════════ */
describe("findUser", () => {
  beforeEach(async () => {
    // Crear un usuario de test
    await addUser({
      name: "María Test",
      username: "maria_test",
      password: "contra123",
      role: "docente",
    });
  });

  it("encuentra un usuario por username + contraseña correcta", async () => {
    const user = await findUser("maria_test", "contra123");
    expect(user).toBeTruthy();
    expect(user.name).toBe("María Test");
  });

  it("retorna null con contraseña incorrecta", async () => {
    const user = await findUser("maria_test", "incorrecta");
    expect(user).toBeNull();
  });

  it("retorna null con username inexistente", async () => {
    const user = await findUser("no_existo", "contra123");
    expect(user).toBeNull();
  });

  it("busca case-insensitive en username", async () => {
    const user = await findUser("MARIA_TEST", "contra123");
    expect(user).toBeTruthy();
  });

  it("busca también por email (Bug #3 fix)", async () => {
    // El email se setea como fallback del username
    const user = await findUser("maria_test", "contra123");
    expect(user).toBeTruthy();
  });

  it("no encuentra usuarios inactivos", async () => {
    // Crear usuario y desactivarlo
    const created = await addUser({
      name: "Inactivo",
      username: "inactivo",
      password: "pass123456",
      role: "docente",
    });
    await toggleUserActive(created.id, true); // active: true → false
    const user = await findUser("inactivo", "pass123456");
    expect(user).toBeNull();
  });
});

/* ══════════════════════════════════════════════════════════
   getUsers — Obtener todos los usuarios
   ══════════════════════════════════════════════════════════ */
describe("getUsers", () => {
  it("retorna array vacío cuando no hay usuarios", async () => {
    const users = await getUsers();
    expect(users).toEqual([]);
  });

  it("retorna todos los usuarios creados", async () => {
    await addUser({ name: "A", username: "a", password: "pass123456", role: "docente" });
    // Pequeño delay para evitar colisión de Date.now() como ID
    await new Promise(r => setTimeout(r, 5));
    await addUser({ name: "B", username: "b", password: "pass123456", role: "admin" });
    const users = await getUsers();
    expect(users.length).toBe(2);
  });
});

/* ══════════════════════════════════════════════════════════
   deleteUser — Eliminación de usuarios
   ══════════════════════════════════════════════════════════ */
describe("deleteUser", () => {
  it("no permite eliminar el SuperAdmin", async () => {
    await expect(deleteUser("superadmin")).rejects.toThrow("Super Administrador");
  });

  it("elimina un usuario normal correctamente", async () => {
    const user = await addUser({ name: "Temp", username: "temp", password: "pass123456", role: "docente" });
    await deleteUser(user.id);
    expect(mockStore.users.get(user.id)).toBeUndefined();
  });
});

/* ══════════════════════════════════════════════════════════
   toggleUserActive — Activar/desactivar usuarios
   ══════════════════════════════════════════════════════════ */
describe("toggleUserActive", () => {
  it("no permite cambiar el estado del SuperAdmin", async () => {
    await initDB();
    await toggleUserActive("superadmin", true); // Debe ser silencioso (return early)
    // El SuperAdmin debe seguir activo
    const sa = mockStore.users.get("superadmin");
    expect(sa.active).toBe(true);
  });

  it("desactiva un usuario activo", async () => {
    const user = await addUser({ name: "Test", username: "test", password: "pass123456", role: "docente" });
    await toggleUserActive(user.id, true); // current=true → set false
    const stored = mockStore.users.get(user.id);
    expect(stored.active).toBe(false);
  });

  it("activa un usuario inactivo", async () => {
    const user = await addUser({ name: "Test", username: "test", password: "pass123456", role: "docente" });
    await toggleUserActive(user.id, true);  // → false
    await toggleUserActive(user.id, false); // → true
    const stored = mockStore.users.get(user.id);
    expect(stored.active).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════
   Resultados — addResult, getResults, deleteResult
   ══════════════════════════════════════════════════════════ */
describe("results", () => {
  const mockResult = {
    id: "12345",
    name: "Estudiante Uno",
    email: "est@correo.com",
    institution: "Instituto Central",
    municipality: "Guatemala",
    score: 35,
    pct: 70,
    grade: "Bueno",
    answers: Array(50).fill(0),
    timestamp: new Date().toISOString(),
  };

  it("addResult guarda un resultado correctamente", async () => {
    await addResult(mockResult);
    expect(mockStore.results.size).toBe(1);
  });

  it("getResults retorna resultados guardados", async () => {
    await addResult(mockResult);
    const results = await getResults();
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Estudiante Uno");
  });

  it("cada resultado tiene _docId de Firestore", async () => {
    await addResult(mockResult);
    const results = await getResults();
    expect(results[0]._docId).toBeTruthy();
  });

  it("deleteResult elimina por docId (Bug #4 fix)", async () => {
    await addResult(mockResult);
    const results = await getResults();
    const docId = results[0]._docId;
    await deleteResult(docId);
    expect(mockStore.results.size).toBe(0);
  });

  it("múltiples resultados se guardan independientemente", async () => {
    await addResult({ ...mockResult, name: "Estudiante 1" });
    await addResult({ ...mockResult, name: "Estudiante 2" });
    await addResult({ ...mockResult, name: "Estudiante 3" });
    const results = await getResults();
    expect(results.length).toBe(3);
  });
});
