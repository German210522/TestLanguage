// src/utils/shuffleQuiz.js
// Utilidades de aleatorización para anti-copia de evaluaciones

/**
 * Fisher-Yates shuffle — reordena un array de forma aleatoria.
 * Retorna una copia nueva, NO muta el original.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Aleatoriza el orden de las opciones de respuesta de cada pregunta.
 * Actualiza el índice `correct` para que siga apuntando a la respuesta correcta.
 * @param {{ q: string, opts: string[], correct: number }[]} questions
 * @returns {{ q: string, opts: string[], correct: number }[]}
 */
export function shuffleOptions(questions) {
  return questions.map(({ q, opts, correct }) => {
    // Crear un array de índices [0, 1, 2, 3] y mezclarlo
    const indices = fisherYates(opts.map((_, i) => i));
    // Reordenar las opciones según los nuevos índices
    const newOpts = indices.map(i => opts[i]);
    // Encontrar dónde quedó la respuesta correcta
    const newCorrect = indices.indexOf(correct);
    return { q, opts: newOpts, correct: newCorrect };
  });
}

/**
 * Selecciona `count` preguntas aleatorias del banco total y aleatoriza sus opciones.
 * @param {{ q: string, opts: string[], correct: number }[]} allQuestions - Banco completo
 * @param {number} count - Número de preguntas a seleccionar
 * @returns {{ q: string, opts: string[], correct: number }[]}
 */
export function prepareQuiz(allQuestions, count = 50) {
  // Si el banco tiene menos preguntas que las solicitadas, usar todas
  const n = Math.min(count, allQuestions.length);
  // 1. Seleccionar preguntas aleatorias
  const selected = fisherYates(allQuestions).slice(0, n);
  // 2. Aleatorizar el orden de las opciones dentro de cada pregunta
  return shuffleOptions(selected);
}
