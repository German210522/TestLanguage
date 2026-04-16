// src/__tests__/grading.test.js
// Tests de calificación, grades, feedback y validación de formularios

import { describe, it, expect } from "vitest";
import { calcScore, getGrade, getFeedback, validateStudentForm } from "../utils/grading";

/* ══════════════════════════════════════════════════════════
   calcScore — Cálculo de puntaje
   ══════════════════════════════════════════════════════════ */
describe("calcScore", () => {
  const mockQuestions = [
    { correct: 0 },
    { correct: 1 },
    { correct: 2 },
    { correct: 3 },
    { correct: 0 },
  ];

  it("calcula correctamente cuando todas las respuestas son correctas", () => {
    const answers = [0, 1, 2, 3, 0];
    const result = calcScore(answers, mockQuestions);
    expect(result.score).toBe(5);
    expect(result.pct).toBe(100);
    expect(result.wrong).toBe(0);
    expect(result.unanswered).toBe(0);
  });

  it("calcula correctamente cuando todas las respuestas son incorrectas", () => {
    const answers = [1, 0, 0, 0, 1];
    const result = calcScore(answers, mockQuestions);
    expect(result.score).toBe(0);
    expect(result.pct).toBe(0);
    expect(result.wrong).toBe(5);
    expect(result.unanswered).toBe(0);
  });

  it("calcula correctamente con respuestas mixtas", () => {
    const answers = [0, 1, 0, 0, 0]; // 3 correctas (0, 1, 4), 2 incorrectas (2, 3)
    const result = calcScore(answers, mockQuestions);
    expect(result.score).toBe(3);
    expect(result.pct).toBe(60);
    expect(result.wrong).toBe(2);
    expect(result.unanswered).toBe(0);
  });

  it("maneja preguntas sin responder (null)", () => {
    const answers = [0, null, null, 3, null];
    const result = calcScore(answers, mockQuestions);
    expect(result.score).toBe(2);
    expect(result.unanswered).toBe(3);
    expect(result.wrong).toBe(0);
    expect(result.pct).toBe(40);
  });

  it("maneja todas las respuestas como null", () => {
    const answers = [null, null, null, null, null];
    const result = calcScore(answers, mockQuestions);
    expect(result.score).toBe(0);
    expect(result.pct).toBe(0);
    expect(result.unanswered).toBe(5);
    expect(result.wrong).toBe(0);
  });

  it("funciona con las 50 preguntas reales del proyecto", () => {
    const { QUESTIONS } = require("../data/questions");
    const perfectAnswers = QUESTIONS.map(q => q.correct);
    const result = calcScore(perfectAnswers, QUESTIONS);
    expect(result.score).toBe(QUESTIONS.length);
    expect(result.pct).toBe(100);
  });
});

/* ══════════════════════════════════════════════════════════
   getGrade — Etiquetas de calificación
   ══════════════════════════════════════════════════════════ */
describe("getGrade", () => {
  it("retorna 'Excelente' para punteos >= 90%", () => {
    expect(getGrade(90).label).toBe("Excelente");
    expect(getGrade(95).label).toBe("Excelente");
    expect(getGrade(100).label).toBe("Excelente");
  });

  it("retorna 'Muy bueno' para punteos 75-89%", () => {
    expect(getGrade(75).label).toBe("Muy bueno");
    expect(getGrade(89).label).toBe("Muy bueno");
  });

  it("retorna 'Bueno' para punteos 60-74%", () => {
    expect(getGrade(60).label).toBe("Bueno");
    expect(getGrade(74).label).toBe("Bueno");
  });

  it("retorna 'Regular' para punteos 50-59%", () => {
    expect(getGrade(50).label).toBe("Regular");
    expect(getGrade(59).label).toBe("Regular");
  });

  it("retorna 'Insuficiente' para punteos < 50%", () => {
    expect(getGrade(0).label).toBe("Insuficiente");
    expect(getGrade(49).label).toBe("Insuficiente");
  });

  it("cada grade tiene color y bg válidos", () => {
    [0, 50, 60, 75, 90].forEach(pct => {
      const grade = getGrade(pct);
      expect(grade.color).toMatch(/^#[0-9a-f]{6}$/);
      expect(grade.bg).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});

/* ══════════════════════════════════════════════════════════
   getFeedback — Retroalimentación textual
   ══════════════════════════════════════════════════════════ */
describe("getFeedback", () => {
  it("retorna feedback positivo para >= 90%", () => {
    const fb = getFeedback(95);
    expect(fb).toContain("sobresaliente");
  });

  it("retorna feedback diferente para cada rango", () => {
    const feedbacks = [getFeedback(10), getFeedback(55), getFeedback(65), getFeedback(80), getFeedback(95)];
    const unique = new Set(feedbacks);
    expect(unique.size).toBe(5); // Cada rango da un feedback diferente
  });

  it("siempre retorna un string no vacío", () => {
    [0, 25, 50, 60, 75, 90, 100].forEach(pct => {
      expect(getFeedback(pct)).toBeTruthy();
      expect(typeof getFeedback(pct)).toBe("string");
    });
  });
});

/* ══════════════════════════════════════════════════════════
   validateStudentForm — Validación de formulario
   ══════════════════════════════════════════════════════════ */
describe("validateStudentForm", () => {
  const validInfo = {
    name: "María López García",
    email: "maria@correo.com",
    institution: "Instituto Nacional Central",
    municipality: "Guatemala",
  };

  it("no retorna errores cuando todo es válido", () => {
    const errors = validateStudentForm(validInfo);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("detecta nombre vacío", () => {
    const errors = validateStudentForm({ ...validInfo, name: "" });
    expect(errors.name).toBeTruthy();
  });

  it("detecta nombre demasiado corto (< 3 chars)", () => {
    const errors = validateStudentForm({ ...validInfo, name: "AB" });
    expect(errors.name).toBeTruthy();
  });

  it("detecta nombre sin letras", () => {
    const errors = validateStudentForm({ ...validInfo, name: "12345" });
    expect(errors.name).toBeTruthy();
  });

  it("acepta nombres con caracteres especiales del español", () => {
    const errors = validateStudentForm({ ...validInfo, name: "José Ángel Ñuñez" });
    expect(errors.name).toBeUndefined();
  });

  it("detecta email inválido", () => {
    const errors = validateStudentForm({ ...validInfo, email: "correo-sin-arroba" });
    expect(errors.email).toBeTruthy();
  });

  it("detecta email vacío", () => {
    const errors = validateStudentForm({ ...validInfo, email: "" });
    expect(errors.email).toBeTruthy();
  });

  it("detecta institución vacía", () => {
    const errors = validateStudentForm({ ...validInfo, institution: "" });
    expect(errors.institution).toBeTruthy();
  });

  it("detecta municipio vacío", () => {
    const errors = validateStudentForm({ ...validInfo, municipality: "" });
    expect(errors.municipality).toBeTruthy();
  });

  it("detecta múltiples errores simultáneamente", () => {
    const errors = validateStudentForm({ name: "", email: "", institution: "", municipality: "" });
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(4);
  });

  it("acepta espacios en blanco alrededor (trim)", () => {
    const errors = validateStudentForm({
      ...validInfo,
      name: "  María López  ",
      email: " maria@correo.com ",
    });
    expect(errors.name).toBeUndefined();
    expect(errors.email).toBeUndefined();
  });
});
