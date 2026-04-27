// src/utils/grading.js
// Lógica de calificación y utilidades de evaluación

/**
 * Retorna el objeto de calificación según el porcentaje obtenido.
 * @param {number} pct - Porcentaje (0–100)
 * @returns {{ label: string, color: string, bg: string }}
 */
export function getGrade(pct) {
  if (pct >= 90) return { label: "Excelente",    color: "#16a34a", bg: "#f0fdf4" };
  if (pct >= 75) return { label: "Muy bueno",    color: "#2563eb", bg: "#eff6ff" };
  if (pct >= 60) return { label: "Bueno",        color: "#d97706", bg: "#fffbeb" };
  if (pct >= 50) return { label: "Regular",      color: "#ea580c", bg: "#fff7ed" };
  return           { label: "Insuficiente", color: "#dc2626", bg: "#fef2f2" };
}

/**
 * Retroalimentación textual según porcentaje.
 * @param {number} pct
 * @returns {string}
 */
export function getFeedback(pct) {
  if (pct >= 90) return "¡Resultado sobresaliente! Demuestras un dominio sólido del Lenguaje Español.";
  if (pct >= 75) return "Buen desempeño. Hay algunas áreas que puedes reforzar para mejorar.";
  if (pct >= 60) return "Resultado aceptable. Se recomienda repasar los temas evaluados con mayor detalle.";
  if (pct >= 50) return "Resultado regular. Es importante estudiar ortografía, gramática y literatura.";
  return "Se recomienda un repaso profundo de todos los contenidos de Lenguaje y Literatura.";
}

/**
 * Calcula el punteo final a partir del arreglo de respuestas.
 * @param {(number|null)[]} answers
 * @param {{ correct: number }[]} questions
 * @returns {{ score: number, pct: number, unanswered: number, wrong: number }}
 */
export function calcScore(answers, questions) {
  const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].correct ? 1 : 0), 0);
  const unanswered = answers.filter(a => a === null).length;
  const wrong = questions.length - score - unanswered;
  const pct = Math.round((score / questions.length) * 100);
  return { score, pct, unanswered, wrong };
}

/**
 * Valida el formulario de datos del estudiante.
 * @param {{ name: string, email: string, institution: string, municipality: string }} info
 * @returns {Record<string, string>} Mapa de errores (vacío = válido)
 */
export function validateStudentForm(info) {
  const errors = {};
  const nameTrim = info.name.trim();
  if (!nameTrim)                                       errors.name = "Ingresa tu nombre completo";
  else if (nameTrim.length < 3)                        errors.name = "El nombre debe tener al menos 3 caracteres";
  else if (!/[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]/.test(nameTrim))  errors.name = "El nombre debe contener letras";
  
  if (!/\S+@\S+\.\S+/.test(info.email.trim()))         errors.email = "Correo electrónico inválido";
  
  const phoneDigits = info.phone ? info.phone.replace(/\D/g, '') : '';
  if (!info.phone || !info.phone.trim())               errors.phone = "Ingresa tu número de teléfono";
  else if (phoneDigits.length !== 8)                   errors.phone = "El teléfono debe tener 8 dígitos";
  
  if (!info.institution.trim())                        errors.institution = "Ingresa tu institución";
  if (!info.municipality.trim())                       errors.municipality = "Ingresa tu municipio";
  
  if (!info.career || !info.career.trim())             errors.career = "Selecciona una carrera";
  else if (info.career === "-Otros-" && (!info.customCareer || !info.customCareer.trim())) {
    errors.customCareer = "Especifica tu carrera";
  }

  return errors;
}
