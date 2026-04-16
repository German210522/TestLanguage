// src/__tests__/export-csv.test.js
// Tests de exportación CSV

import { describe, it, expect, vi, beforeEach } from "vitest";

/* ══════════════════════════════════════════════════════════
   Lógica de generación CSV (extraída para testing)
   Replicamos la lógica de exportCsv.js sin el lado DOM
   ══════════════════════════════════════════════════════════ */
function generateCSV(results) {
  const headers = ["Nombre", "Correo", "Institución", "Municipio", "Punteo", "%", "Calificación", "Fecha", "Hora"];
  const rows = results.map(r => {
    const d = new Date(r.timestamp);
    const fecha = d.toLocaleDateString("es-GT");
    const hora = d.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
    return [r.name, r.email, r.institution, r.municipality, r.score, r.pct + "%", r.grade, fecha, hora];
  });

  return [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

const sampleResults = [
  {
    name: "Ana García",
    email: "ana@correo.com",
    institution: "Instituto Central",
    municipality: "Guatemala",
    score: 45,
    pct: 90,
    grade: "Excelente",
    timestamp: "2026-04-15T14:30:00.000Z",
  },
  {
    name: 'José "Pepe" López',
    email: "jose@correo.com",
    institution: "Escuela Rural",
    municipality: "Huehuetenango",
    score: 25,
    pct: 50,
    grade: "Regular",
    timestamp: "2026-04-15T16:45:00.000Z",
  },
];

describe("CSV Export", () => {
  it("genera CSV con headers correctos", () => {
    const csv = generateCSV(sampleResults);
    const firstLine = csv.split("\n")[0];
    expect(firstLine).toContain('"Nombre"');
    expect(firstLine).toContain('"Correo"');
    expect(firstLine).toContain('"Institución"');
    expect(firstLine).toContain('"Municipio"');
    expect(firstLine).toContain('"Punteo"');
    expect(firstLine).toContain('"%"');
    expect(firstLine).toContain('"Calificación"');
    expect(firstLine).toContain('"Fecha"');
    expect(firstLine).toContain('"Hora"');
  });

  it("tiene la cantidad correcta de filas (headers + datos)", () => {
    const csv = generateCSV(sampleResults);
    const lines = csv.split("\n");
    expect(lines.length).toBe(3); // 1 header + 2 datos
  });

  it("escapa comillas dobles dentro de campos", () => {
    const csv = generateCSV(sampleResults);
    // José "Pepe" López → José ""Pepe"" López
    expect(csv).toContain('""Pepe""');
  });

  it("cada campo está envuelto en comillas", () => {
    const csv = generateCSV([sampleResults[0]]);
    const dataLine = csv.split("\n")[1];
    const fields = dataLine.match(/"[^"]*"/g);
    // Debe haber 9 campos
    expect(fields?.length).toBe(9);
  });

  it("genera CSV vacío solo con headers cuando no hay resultados", () => {
    const csv = generateCSV([]);
    const lines = csv.split("\n");
    expect(lines.length).toBe(1); // Solo headers
  });

  it("incluye porcentaje con símbolo %", () => {
    const csv = generateCSV(sampleResults);
    expect(csv).toContain('"90%"');
    expect(csv).toContain('"50%"');
  });

  it("incluye calificación textual", () => {
    const csv = generateCSV(sampleResults);
    expect(csv).toContain('"Excelente"');
    expect(csv).toContain('"Regular"');
  });
});
