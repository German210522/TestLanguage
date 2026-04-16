// src/__tests__/quiz-flow.test.js
// Tests del flujo del quiz — desde landing hasta resultados

import { describe, it, expect, beforeEach } from "vitest";
import { QUESTIONS, TOTAL, TIME_PER_QUESTION, OPTION_LABELS } from "../data/questions";
import { calcScore, getGrade } from "../utils/grading";

/* ══════════════════════════════════════════════════════════
   Datos del Quiz — Integridad
   ══════════════════════════════════════════════════════════ */
describe("Questions Data Integrity", () => {
  it("tiene la cantidad correcta de preguntas", () => {
    expect(QUESTIONS.length).toBe(TOTAL);
    expect(TOTAL).toBeGreaterThanOrEqual(50);
  });

  it("TOTAL es igual a QUESTIONS.length (Bug #14 fix)", () => {
    expect(TOTAL).toBe(QUESTIONS.length);
  });

  it("TIME_PER_QUESTION es 60 segundos", () => {
    expect(TIME_PER_QUESTION).toBe(60);
  });

  it("tiene 4 opciones por pregunta (A, B, C, D)", () => {
    expect(OPTION_LABELS).toEqual(["A", "B", "C", "D"]);
    QUESTIONS.forEach((q, i) => {
      expect(q.opts.length).toBe(4);
    });
  });

  it("cada pregunta tiene un índice correct válido (0-3)", () => {
    QUESTIONS.forEach((q, i) => {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThanOrEqual(3);
    });
  });

  it("cada pregunta tiene texto no vacío", () => {
    QUESTIONS.forEach((q, i) => {
      expect(q.q.trim().length).toBeGreaterThan(0);
    });
  });

  it("cada opción tiene texto no vacío", () => {
    QUESTIONS.forEach((q, i) => {
      q.opts.forEach((opt, j) => {
        expect(opt.trim().length).toBeGreaterThan(0);
      });
    });
  });
});

/* ══════════════════════════════════════════════════════════
   Flujo del Quiz — Simulación completa
   ══════════════════════════════════════════════════════════ */
describe("Quiz Flow Simulation", () => {
  it("simula un estudiante que responde TODO correctamente → 100%", () => {
    const answers = QUESTIONS.map(q => q.correct);
    const { score, pct } = calcScore(answers, QUESTIONS);
    const grade = getGrade(pct);

    expect(score).toBe(TOTAL);
    expect(pct).toBe(100);
    expect(grade.label).toBe("Excelente");
  });

  it("simula un estudiante que responde TODO incorrecto → 0%", () => {
    const answers = QUESTIONS.map(q => (q.correct + 1) % 4);
    const { score, pct } = calcScore(answers, QUESTIONS);
    const grade = getGrade(pct);

    expect(score).toBe(0);
    expect(pct).toBe(0);
    expect(grade.label).toBe("Insuficiente");
  });

  it("simula un estudiante que no responde nada (timeout en todas)", () => {
    const answers = Array(TOTAL).fill(null);
    const { score, pct, unanswered } = calcScore(answers, QUESTIONS);

    expect(score).toBe(0);
    expect(pct).toBe(0);
    expect(unanswered).toBe(TOTAL);
  });

  it("simula un estudiante promedio (~60% correcto)", () => {
    const correctCount = Math.round(TOTAL * 0.6);
    const answers = QUESTIONS.map((q, i) =>
      i < correctCount ? q.correct : (q.correct + 1) % 4
    );
    const { score, pct } = calcScore(answers, QUESTIONS);
    const grade = getGrade(pct);

    expect(score).toBe(correctCount);
    expect(pct).toBe(Math.round((correctCount / TOTAL) * 100));
    expect(grade.label).toBe("Bueno");
  });

  it("simula un estudiante que responde parcialmente (mitad de preguntas)", () => {
    const half = Math.floor(TOTAL / 2);
    const answers = Array(TOTAL).fill(null);
    // Responde correctamente la primera mitad
    for (let i = 0; i < half; i++) {
      answers[i] = QUESTIONS[i].correct;
    }
    const { score, pct, unanswered, wrong } = calcScore(answers, QUESTIONS);

    expect(score).toBe(half);
    expect(unanswered).toBe(TOTAL - half);
    expect(wrong).toBe(0);
    expect(pct).toBe(Math.round((half / TOTAL) * 100));
  });
});

/* ══════════════════════════════════════════════════════════
   Resultado — Estructura correcta
   ══════════════════════════════════════════════════════════ */
describe("Result Object Structure", () => {
  it("genera un resultado válido completo para Firestore", () => {
    const studentInfo = {
      name: "Ana García",
      email: "ana@correo.com",
      institution: "Instituto Central",
      municipality: "Guatemala",
    };
    const answers = QUESTIONS.map(q => q.correct);
    const { score, pct } = calcScore(answers, QUESTIONS);
    const grade = getGrade(pct);

    const result = {
      id: Date.now().toString(),
      ...studentInfo,
      score,
      pct,
      grade: grade.label,
      answers: [...answers],
      timestamp: new Date().toISOString(),
    };

    // Verificar estructura completa
    expect(result.id).toBeTruthy();
    expect(result.name).toBe("Ana García");
    expect(result.email).toBe("ana@correo.com");
    expect(result.institution).toBe("Instituto Central");
    expect(result.municipality).toBe("Guatemala");
    expect(result.score).toBe(TOTAL);
    expect(result.pct).toBe(100);
    expect(result.grade).toBe("Excelente");
    expect(result.answers.length).toBe(TOTAL);
    expect(result.timestamp).toBeTruthy();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
  });
});

/* ══════════════════════════════════════════════════════════
   Edge Cases
   ══════════════════════════════════════════════════════════ */
describe("Edge Cases", () => {
  it("una sola pregunta correcta → porcentaje bajo", () => {
    const answers = Array(TOTAL).fill(null);
    answers[0] = QUESTIONS[0].correct;
    const { score, pct } = calcScore(answers, QUESTIONS);
    expect(score).toBe(1);
    expect(pct).toBe(Math.round((1 / TOTAL) * 100));
  });

  it("TOTAL - 1 correctas → porcentaje alto", () => {
    const answers = QUESTIONS.map(q => q.correct);
    answers[0] = (QUESTIONS[0].correct + 1) % 4; // Una incorrecta
    const { score, pct } = calcScore(answers, QUESTIONS);
    expect(score).toBe(TOTAL - 1);
    expect(pct).toBe(Math.round(((TOTAL - 1) / TOTAL) * 100));
  });

  it("la respuesta correcta del quiz coincide con correct index", () => {
    // Verificar que la primera pregunta ("régimen" → "regímenes") es opción A (index 0)
    expect(QUESTIONS[0].correct).toBe(0);
    expect(QUESTIONS[0].opts[0]).toBe("regímenes");
  });
});
