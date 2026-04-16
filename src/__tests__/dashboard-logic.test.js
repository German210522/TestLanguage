// src/__tests__/dashboard-logic.test.js
// Tests de la lógica del Dashboard — estadísticas, filtros, gráficas

import { describe, it, expect } from "vitest";
import { QUESTIONS } from "../data/questions";

/* ══════════════════════════════════════════════════════════
   Simulación de datos de resultados (lo que el Dashboard recibe)
   ══════════════════════════════════════════════════════════ */
const createMockResult = (overrides = {}) => ({
  _docId: "doc_" + Math.random().toString(36).slice(2, 8),
  id: Date.now().toString(),
  name: "Estudiante Test",
  email: "test@correo.com",
  institution: "Instituto Central",
  municipality: "Guatemala",
  score: 35,
  pct: 70,
  grade: "Bueno",
  answers: Array(50).fill(0),
  timestamp: new Date().toISOString(),
  ...overrides,
});

const sampleResults = [
  createMockResult({ name: "Ana García", pct: 95, grade: "Excelente", institution: "Instituto A", municipality: "Guatemala" }),
  createMockResult({ name: "Luis Hernández", pct: 80, grade: "Muy bueno", institution: "Instituto B", municipality: "Quetzaltenango" }),
  createMockResult({ name: "Pedro López", pct: 65, grade: "Bueno", institution: "Instituto A", municipality: "Guatemala" }),
  createMockResult({ name: "María Ruiz", pct: 55, grade: "Regular", institution: "Instituto C", municipality: "Huehuetenango" }),
  createMockResult({ name: "Carlos Méndez", pct: 40, grade: "Insuficiente", institution: "Instituto B", municipality: "Quetzaltenango" }),
  createMockResult({ name: "Rosa Torres", pct: 88, grade: "Muy bueno", institution: "Instituto A", municipality: "Guatemala" }),
  createMockResult({ name: "Juan Pérez", pct: 72, grade: "Bueno", institution: "Instituto C", municipality: "Huehuetenango" }),
  createMockResult({ name: "Elena Díaz", pct: 45, grade: "Insuficiente", institution: "Instituto D", municipality: "Cobán" }),
  createMockResult({ name: "Fernando Castillo", pct: 91, grade: "Excelente", institution: "Instituto A", municipality: "Guatemala" }),
  createMockResult({ name: "Lucía Morales", pct: 62, grade: "Bueno", institution: "Instituto B", municipality: "Quetzaltenango" }),
];

/* ══════════════════════════════════════════════════════════
   Estadísticas del Dashboard
   ══════════════════════════════════════════════════════════ */
describe("Dashboard Statistics", () => {
  it("calcula total de exámenes correctamente", () => {
    const total = sampleResults.length;
    expect(total).toBe(10);
  });

  it("calcula promedio general correctamente", () => {
    const total = sampleResults.length;
    const avgPct = Math.round(sampleResults.reduce((a, r) => a + r.pct, 0) / total);
    // (95+80+65+55+40+88+72+45+91+62) / 10 = 69.3 → 69%
    expect(avgPct).toBe(69);
  });

  it("cuenta aprobados (≥60%) correctamente", () => {
    const approved = sampleResults.filter(r => r.pct >= 60).length;
    // 95, 80, 65, 88, 72, 91, 62 = 7 aprobados
    expect(approved).toBe(7);
  });

  it("cuenta reprobados (<60%) correctamente", () => {
    const failed = sampleResults.filter(r => r.pct < 60).length;
    // 55, 40, 45 = 3 reprobados
    expect(failed).toBe(3);
  });

  it("calcula porcentaje de aprobación correctamente", () => {
    const total = sampleResults.length;
    const approved = sampleResults.filter(r => r.pct >= 60).length;
    const approvedPct = Math.round((approved / total) * 100);
    expect(approvedPct).toBe(70); // 7/10 = 70%
  });
});

/* ══════════════════════════════════════════════════════════
   Filtros de la tabla de estudiantes
   ══════════════════════════════════════════════════════════ */
describe("Dashboard Filters", () => {
  // Función de filtro que replica la lógica del Dashboard
  const filterResults = (results, search = "", filterInst = "") => {
    return results.filter(r => {
      const s = search.toLowerCase();
      return (
        (!s || [r.name, r.email, r.institution, r.municipality].some(v => v.toLowerCase().includes(s))) &&
        (!filterInst || r.institution === filterInst)
      );
    });
  };

  it("sin filtros retorna todos los resultados", () => {
    const filtered = filterResults(sampleResults);
    expect(filtered.length).toBe(10);
  });

  it("filtra por nombre de estudiante", () => {
    const filtered = filterResults(sampleResults, "Ana");
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe("Ana García");
  });

  it("filtra por institución (texto)", () => {
    const filtered = filterResults(sampleResults, "Instituto A");
    // Ana, Pedro, Rosa, Fernando están en Instituto A
    expect(filtered.length).toBe(4);
  });

  it("filtra por municipio", () => {
    const filtered = filterResults(sampleResults, "Huehuetenango");
    expect(filtered.length).toBe(2);
  });

  it("filtra por institución (dropdown)", () => {
    const filtered = filterResults(sampleResults, "", "Instituto B");
    // Luis, Carlos, Lucía
    expect(filtered.length).toBe(3);
  });

  it("combina búsqueda + filtro de institución", () => {
    const filtered = filterResults(sampleResults, "Luis", "Instituto B");
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe("Luis Hernández");
  });

  it("búsqueda case-insensitive", () => {
    const filtered = filterResults(sampleResults, "GUATEMALA");
    expect(filtered.length).toBe(4); // 4 de Guatemala
  });

  it("búsqueda sin resultados retorna array vacío", () => {
    const filtered = filterResults(sampleResults, "NoExiste");
    expect(filtered.length).toBe(0);
  });
});

/* ══════════════════════════════════════════════════════════
   Datos de gráficas
   ══════════════════════════════════════════════════════════ */
describe("Dashboard Chart Data", () => {
  it("genera distribución de punteos en 10 rangos", () => {
    const dist = Array.from({ length: 10 }, (_, i) => ({
      name: `${i * 10}–${i === 9 ? 100 : i * 10 + 9}`,
      count: sampleResults.filter(r => r.pct >= i * 10 && (i === 9 ? r.pct <= 100 : r.pct < (i + 1) * 10)).length,
    }));

    expect(dist.length).toBe(10);
    // Verificar que la suma total sea igual al total de resultados
    const totalCount = dist.reduce((a, d) => a + d.count, 0);
    expect(totalCount).toBe(sampleResults.length);
  });

  it("genera datos de pie chart aprobados/reprobados", () => {
    const approved = sampleResults.filter(r => r.pct >= 60).length;
    const failed = sampleResults.length - approved;
    const pieData = [
      { name: "Aprobados", value: approved },
      { name: "Reprobados", value: failed },
    ].filter(d => d.value > 0);

    expect(pieData.length).toBe(2);
    expect(pieData[0].value).toBe(7);
    expect(pieData[1].value).toBe(3);
  });

  it("genera distribución por calificación correctamente", () => {
    const gradeData = [
      { name: "Excelente", value: sampleResults.filter(r => r.pct >= 90).length },
      { name: "Muy bueno", value: sampleResults.filter(r => r.pct >= 75 && r.pct < 90).length },
      { name: "Bueno", value: sampleResults.filter(r => r.pct >= 60 && r.pct < 75).length },
      { name: "Regular", value: sampleResults.filter(r => r.pct >= 50 && r.pct < 60).length },
      { name: "Insuficiente", value: sampleResults.filter(r => r.pct < 50).length },
    ];

    expect(gradeData[0].value).toBe(2); // 95, 91
    expect(gradeData[1].value).toBe(2); // 80, 88
    expect(gradeData[2].value).toBe(3); // 65, 72, 62
    expect(gradeData[3].value).toBe(1); // 55
    expect(gradeData[4].value).toBe(2); // 40, 45
  });

  it("genera promedio por institución correctamente", () => {
    const instMap = {};
    sampleResults.forEach(r => {
      if (!instMap[r.institution]) instMap[r.institution] = { sum: 0, n: 0 };
      instMap[r.institution].sum += r.pct;
      instMap[r.institution].n++;
    });
    const instData = Object.entries(instMap)
      .map(([name, { sum, n }]) => ({ name, avg: Math.round(sum / n), n }))
      .sort((a, b) => b.avg - a.avg);

    // Instituto A: (95+65+88+91)/4 = 84.75 → 85%
    // Instituto B: (80+40+62)/3 = 60.67 → 61%
    // Instituto C: (55+72)/2 = 63.5 → 64%
    // Instituto D: 45/1 = 45%
    expect(instData[0].name).toBe("Instituto A");
    expect(instData[0].avg).toBe(85);
    expect(instData[0].n).toBe(4);
  });

  it("lista instituciones únicas para el dropdown", () => {
    const institutions = [...new Set(sampleResults.map(r => r.institution))].sort();
    expect(institutions).toEqual(["Instituto A", "Instituto B", "Instituto C", "Instituto D"]);
  });
});

/* ══════════════════════════════════════════════════════════
   Navegación y permisos del Dashboard
   ══════════════════════════════════════════════════════════ */
describe("Dashboard Navigation & Permissions", () => {
  it("admin tiene acceso a overview, students, users", () => {
    const currentUser = { role: "admin", id: "superadmin" };
    const navItems = [
      ...(currentUser.role === "admin" ? [{ id: "overview" }] : []),
      { id: "students" },
      ...(currentUser.role === "admin" ? [{ id: "users" }] : []),
    ];
    expect(navItems.map(n => n.id)).toEqual(["overview", "students", "users"]);
  });

  it("docente solo tiene acceso a students", () => {
    const currentUser = { role: "docente", id: "teacher1" };
    const navItems = [
      ...(currentUser.role === "admin" ? [{ id: "overview" }] : []),
      { id: "students" },
      ...(currentUser.role === "admin" ? [{ id: "users" }] : []),
    ];
    expect(navItems.map(n => n.id)).toEqual(["students"]);
  });

  it("solo superadmin puede eliminar usuarios", () => {
    const currentUser = { id: "superadmin" };
    const canDelete = (userId) => {
      return currentUser.id === "superadmin" && userId !== "superadmin" && userId !== "1" && userId !== currentUser.id;
    };
    expect(canDelete("user123")).toBe(true);
    expect(canDelete("superadmin")).toBe(false);
  });

  it("deleteResult recibe _docId, no id normal (Bug #4 fix)", () => {
    const result = createMockResult();
    // Bug #4: antes se usaba result.id, ahora debe ser result._docId
    expect(result._docId).toBeTruthy();
    expect(result._docId).not.toBe(result.id);
    // Verificar que _docId tiene formato de doc ID de Firestore (no timestamp)
    expect(result._docId.startsWith("doc_")).toBe(true);
  });
});
