// src/utils/seedData.js
// Datos ficticios de demostración — 10 registros para el dashboard
// Ejecutar UNA VEZ y luego eliminar como SuperAdmin

import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const DEMO_RESULTS = [
  // ── 3 NOTAS ALTAS (Excelente: 90-100%)
  {
    id: "demo_01",
    name: "María Fernanda López García",
    email: "maria.lopez@instituto.edu.gt",
    institution: "Instituto Nacional Central para Señoritas Belén",
    municipality: "Guatemala",
    score: 48,
    pct: 94,
    grade: "Excelente",
    answers: [],
    timestamp: "2026-04-14T09:15:00.000Z",
  },
  {
    id: "demo_02",
    name: "Carlos Eduardo Hernández Morales",
    email: "carlos.hernandez@colegio.edu.gt",
    institution: "Colegio Salesiano Don Bosco",
    municipality: "Quetzaltenango",
    score: 47,
    pct: 92,
    grade: "Excelente",
    answers: [],
    timestamp: "2026-04-14T10:30:00.000Z",
  },
  {
    id: "demo_03",
    name: "Ana Lucía Castillo Méndez",
    email: "ana.castillo@liceo.edu.gt",
    institution: "Liceo Guatemala",
    municipality: "Guatemala",
    score: 46,
    pct: 90,
    grade: "Excelente",
    answers: [],
    timestamp: "2026-04-14T11:00:00.000Z",
  },

  // ── 3 NOTAS REGULARES (Bueno: 60-74%)
  {
    id: "demo_04",
    name: "José Manuel Pérez Torres",
    email: "jose.perez@ineb.edu.gt",
    institution: "INEB Huehuetenango",
    municipality: "Huehuetenango",
    score: 35,
    pct: 69,
    grade: "Bueno",
    answers: [],
    timestamp: "2026-04-14T14:20:00.000Z",
  },
  {
    id: "demo_05",
    name: "Rosa Emilia Díaz Ramírez",
    email: "rosa.diaz@escuela.edu.gt",
    institution: "Escuela Normal Rural de Occidente",
    municipality: "Totonicapán",
    score: 33,
    pct: 65,
    grade: "Bueno",
    answers: [],
    timestamp: "2026-04-14T15:45:00.000Z",
  },
  {
    id: "demo_06",
    name: "Fernando Andrés Ruiz Solís",
    email: "fernando.ruiz@colegio.edu.gt",
    institution: "Colegio Evangélico La Patria",
    municipality: "Cobán",
    score: 31,
    pct: 61,
    grade: "Bueno",
    answers: [],
    timestamp: "2026-04-15T08:10:00.000Z",
  },

  // ── 3 NOTAS BAJAS (Regular: 50-59%)
  {
    id: "demo_07",
    name: "Luisa Gabriela Morales Cruz",
    email: "luisa.morales@ined.edu.gt",
    institution: "INED Chimaltenango",
    municipality: "Chimaltenango",
    score: 28,
    pct: 55,
    grade: "Regular",
    answers: [],
    timestamp: "2026-04-15T09:30:00.000Z",
  },
  {
    id: "demo_08",
    name: "Pedro Antonio Juárez Vásquez",
    email: "pedro.juarez@instituto.edu.gt",
    institution: "Instituto Mixto Nocturno",
    municipality: "Escuintla",
    score: 27,
    pct: 53,
    grade: "Regular",
    answers: [],
    timestamp: "2026-04-15T10:15:00.000Z",
  },
  {
    id: "demo_09",
    name: "Elena Patricia García Hernández",
    email: "elena.garcia@escuela.edu.gt",
    institution: "Escuela Normal Intercultural",
    municipality: "Santa Cruz del Quiché",
    score: 26,
    pct: 51,
    grade: "Regular",
    answers: [],
    timestamp: "2026-04-15T11:00:00.000Z",
  },

  // ── 1 NOTA PÉSIMA (Insuficiente: <50%)
  {
    id: "demo_10",
    name: "Roberto Miguel Santizo Orozco",
    email: "roberto.santizo@ineb.edu.gt",
    institution: "INEB Jutiapa",
    municipality: "Jutiapa",
    score: 12,
    pct: 24,
    grade: "Insuficiente",
    answers: [],
    timestamp: "2026-04-15T13:45:00.000Z",
  },
];

/**
 * Inserta los 10 registros demo en Firestore.
 * Llamar UNA VEZ desde initDB. Los datos se eliminan luego como SuperAdmin.
 */
export async function seedDemoData() {
  const SEED_KEY = "demo_data_seeded";
  // Evitar insertar duplicados
  try {
    if (localStorage.getItem(SEED_KEY)) {
      console.log("[seed] Datos demo ya fueron insertados anteriormente.");
      return;
    }
  } catch (e) { /* localStorage no disponible */ }

  console.log("[seed] Insertando 10 registros de demostración...");
  
  try {
    const colRef = collection(db, "results");
    let count = 0;
    for (const result of DEMO_RESULTS) {
      await addDoc(colRef, result);
      count++;
    }
    console.log(`[seed] ✅ ${count} registros demo insertados con éxito.`);
    
    // Marcar como hecho para no repetir
    try { localStorage.setItem(SEED_KEY, Date.now().toString()); } catch (e) {}
  } catch (e) {
    console.error("[seed] Error insertando datos demo:", e);
  }
}
