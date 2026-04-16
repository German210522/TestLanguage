// src/hooks/useQuiz.js
// Hook personalizado que encapsula toda la lógica del cuestionario

import { useState, useEffect, useRef, useCallback } from "react";
import { QUESTIONS, TOTAL, TIME_PER_QUESTION } from "../data/questions";
import { calcScore, getGrade } from "../utils/grading";
import { addResult } from "../utils/storage";

/**
 * Fases posibles de la aplicación:
 * "landing" → "quiz" → "results" → "dashboard"
 */
export function useQuiz() {
  const [phase, setPhase]         = useState("landing");
  const [studentInfo, setStudentInfo] = useState({ name: "", email: "", institution: "", municipality: "" });
  const [answers, setAnswers]     = useState(() => Array(TOTAL).fill(null));
  const [locked, setLocked]       = useState(() => Array(TOTAL).fill(false));
  const [qIdx, setQIdx]           = useState(0);
  const [timeLeft, setTimeLeft]   = useState(TIME_PER_QUESTION);
  const [timesUp, setTimesUp]     = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth]   = useState(false);

  /* ── Guardar resultado y avanzar a results ─────────── */
  const finishRef = useRef(null);
  finishRef.current = useCallback(() => {
    const { score, pct } = calcScore(answers, QUESTIONS);
    const grade = getGrade(pct);
    // Ejecutamos en segundo plano sin bloquar la UI
    addResult({
      id: Date.now().toString(),
      ...studentInfo,
      score,
      pct,
      grade: grade.label,
      answers: [...answers],
      timestamp: new Date().toISOString(),
    }).catch(e => console.error("[quiz] Error guardando resultado:", e));
    try { localStorage.setItem("last_sub", Date.now().toString()); } catch(e){}
    setPhase("results");
  }, [answers, studentInfo]);

  /* ── Avanzar pregunta (o terminar) ─────────────────── */
  const advanceRef = useRef(null);
  advanceRef.current = useCallback(() => {
    if (qIdx >= TOTAL - 1) finishRef.current();
    else setQIdx(i => i + 1);
  }, [qIdx]);

  /* ── Resetear timer al cambiar pregunta ─────────────── */
  useEffect(() => {
    if (phase !== "quiz") return;
    setTimeLeft(TIME_PER_QUESTION);
    setTimesUp(false);
  }, [qIdx, phase]);

  /* ── Countdown ──────────────────────────────────────── */
  useEffect(() => {
    if (phase !== "quiz" || timesUp) return;
    if (timeLeft <= 0) {
      setTimesUp(true);
      // Auto-avanza siempre, incluyendo la última pregunta
      setTimeout(() => advanceRef.current(), 1500);
      return;
    }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, phase, timesUp]);

  /* ── Seleccionar respuesta ──────────────────────────── */
  const handleSelect = (optionIndex) => {
    if (locked[qIdx] || timesUp) return;
    setAnswers(prev => { const a = [...prev]; a[qIdx] = optionIndex; return a; });
    setLocked(prev  => { const l = [...prev]; l[qIdx] = true;        return l; });
    // Auto-avance despues de mostrar la validación visual, excepto en la ultima pregunta
    if (qIdx < TOTAL - 1) {
      setTimeout(() => {
        advanceRef.current();
      }, 1500);
    }
  };

  /* ── Iniciar evaluación ─────────────────────────────── */
  const handleStart = (info) => {
    const lastSub = localStorage.getItem("last_sub");
    if (lastSub && Date.now() - parseInt(lastSub) < 60 * 1000) {
      alert("Por seguridad del sistema, debes esperar 1 minuto antes de procesar una nueva evaluación desde este dispositivo.");
      return;
    }
    setStudentInfo(info);
    setPhase("quiz");
  };

  /* ── Reset completo ─────────────────────────────────── */
  const handleReset = () => {
    setPhase("landing");
    setQIdx(0);
    setAnswers(Array(TOTAL).fill(null));
    setLocked(Array(TOTAL).fill(false));
    setStudentInfo({ name: "", email: "", institution: "", municipality: "" });
  };

  /* ── Auth ───────────────────────────────────────────── */
  const handleLogin  = useCallback((user) => { setCurrentUser(user); setShowAuth(false); setPhase("dashboard"); }, []);
  const handleLogout = useCallback(()     => { setCurrentUser(null); setPhase("landing"); }, []);

  return {
    phase,
    studentInfo,
    answers,
    locked,
    qIdx,
    timeLeft,
    timesUp,
    currentUser,
    showAuth,
    setShowAuth,
    handleStart,
    handleSelect,
    handleAdvance: () => advanceRef.current(),
    handleReset,
    handleLogin,
    handleLogout,
    setPhase,
  };
}
