// src/utils/exportCsv.js
// Exporta los resultados filtrados a un archivo CSV con BOM para Excel en español

/**
 * Descarga un CSV con los resultados del examen.
 * @param {Object[]} results - Array de resultados filtrados
 */
export function exportResultsCSV(results) {
  const headers = ["Nombre", "Correo", "Institución", "Municipio", "Punteo", "%", "Calificación", "Fecha", "Hora"];
  const rows = results.map(r => {
    const d = new Date(r.timestamp);
    const fecha = d.toLocaleDateString("es-GT");
    const hora = d.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" });
    return [
      r.name,
      r.email,
      r.institution,
      r.municipality,
      r.score,
      r.pct + "%",
      r.grade,
      fecha,
      hora
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resultados_evaluacion.csv";
  a.click();
  URL.revokeObjectURL(url);
}
