// src/__tests__/setup.js
// Mocks globales para Firebase y Web Crypto — 0 llamadas reales a la nube

import { vi } from "vitest";

/* ═══════════════════════════════════════════════════════════
   MOCK: Firebase Firestore
   Simula TODAS las operaciones de Firestore en memoria.
   ═══════════════════════════════════════════════════════════ */

// Almacén en memoria que simula Firestore
export const mockStore = {
  users: new Map(),
  results: new Map(),
};

// Helper para resetear el store entre tests
export function resetMockStore() {
  mockStore.users.clear();
  mockStore.results.clear();
}

// Helper para crear un snapshot fake de docs
function createMockSnapshot(collName) {
  const map = mockStore[collName] || new Map();
  const docs = Array.from(map.entries()).map(([id, data]) => ({
    id,
    data: () => ({ ...data }),
    exists: () => true,
  }));
  return {
    docs,
    empty: docs.length === 0,
    size: docs.length,
    forEach: (fn) => docs.forEach(fn),
  };
}

// Mock de firebase/firestore
vi.mock("firebase/firestore", () => ({
  collection: vi.fn((db, name) => ({ _collName: name })),
  doc: vi.fn((db, collName, docId) => ({ _collName: collName, _docId: docId })),
  getDoc: vi.fn(async (ref) => {
    const data = mockStore[ref._collName]?.get(ref._docId);
    return {
      exists: () => !!data,
      data: () => (data ? { ...data } : undefined),
      id: ref._docId,
    };
  }),
  getDocs: vi.fn(async (queryRef) => {
    const collName = queryRef._collName || queryRef.collName;
    return createMockSnapshot(collName);
  }),
  getDocsFromCache: vi.fn(async (ref) => {
    const collName = ref._collName || ref.collName;
    return createMockSnapshot(collName);
  }),
  getDocsFromServer: vi.fn(async (ref) => {
    const collName = ref._collName || ref.collName;
    return createMockSnapshot(collName);
  }),
  setDoc: vi.fn(async (ref, data, options) => {
    const collName = ref._collName;
    const docId = ref._docId;
    if (options?.merge) {
      const existing = mockStore[collName]?.get(docId) || {};
      mockStore[collName].set(docId, { ...existing, ...data });
    } else {
      if (!mockStore[collName]) mockStore[collName] = new Map();
      mockStore[collName].set(docId, { ...data });
    }
  }),
  deleteDoc: vi.fn(async (ref) => {
    mockStore[ref._collName]?.delete(ref._docId);
  }),
  addDoc: vi.fn(async (ref, data) => {
    const id = "auto_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    const collName = ref._collName;
    if (!mockStore[collName]) mockStore[collName] = new Map();
    mockStore[collName].set(id, { ...data });
    return { id };
  }),
  updateDoc: vi.fn(async (ref, data) => {
    const existing = mockStore[ref._collName]?.get(ref._docId);
    if (!existing) throw new Error("Document not found");
    mockStore[ref._collName].set(ref._docId, { ...existing, ...data });
  }),
  query: vi.fn((...args) => {
    // Return a ref-like object that preserves collName
    const collRef = args[0];
    return { _collName: collRef._collName, collName: collRef._collName };
  }),
  orderBy: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  onSnapshot: vi.fn((ref, onNext, onError) => {
    // Ejecuta callback inmediatamente con datos actuales
    const collName = ref._collName || ref.collName;
    try {
      const snap = createMockSnapshot(collName);
      if (onNext) onNext(snap);
    } catch (e) {
      if (onError) onError(e);
    }
    // Retorna función de unsubscribe
    return vi.fn();
  }),
  initializeFirestore: vi.fn(() => ({})),
  persistentLocalCache: vi.fn(() => ({})),
  persistentMultipleTabManager: vi.fn(() => ({})),
}));

// Mock firebase/app
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

// Mock del módulo firebase.js local
vi.mock("../firebase", () => ({
  db: {},
}));

/* ═══════════════════════════════════════════════════════════
   MOCK: Web Crypto API (para hashPassword en Node/jsdom)
   ═══════════════════════════════════════════════════════════ */
if (!globalThis.crypto?.subtle) {
  const { webcrypto } = await import("node:crypto");
  globalThis.crypto = webcrypto;
}

/* ═══════════════════════════════════════════════════════════
   MOCK: localStorage
   ═══════════════════════════════════════════════════════════ */
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });
