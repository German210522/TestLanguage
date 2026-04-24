// src/hooks/useQuiz.js
// Hook personalizado que encapsula toda la lógica del cuestionario

import { useState, useEffect, useRef, useCallback } from "react";
import { QUESTIONS, QUIZ_SIZE, TIME_PER_QUESTION } from "../data/questions";
import { prepareQuiz } from "../utils/shuffleQuiz";
import { calcScore, getGrade } from "../utils/grading";
import { addResult, createPendingResult, completeResult, compressAnswers } from "../utils/storage";

/**
 * Fases posibles de la aplicación:
 * "landing" → "quiz" → "results" → "dashboard"
 */
export function useQuiz() {
  const [phase, setPhase]         = useState("landing");
  const [studentInfo, setStudentInfo] = useState({ name: "", email: "", institution: "", municipality: "" });
  const [answers, setAnswers]     = useState(() => Array(QUIZ_SIZE).fill(null));
  const [locked, setLocked]       = useState(() => Array(QUIZ_SIZE).fill(false));
  const [qIdx, setQIdx]           = useState(0);
  const [timeLeft, setTimeLeft]   = useState(TIME_PER_QUESTION);
  const [timesUp, setTimesUp]     = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth]   = useState(false);

  // Preguntas aleatorizadas para la sesión actual
  const [quizQuestions, setQuizQuestions] = useState(() => prepareQuiz(QUESTIONS, QUIZ_SIZE));

  // Ref para guardar el ID del documento pendiente ("En Proceso")
  const pendingDocRef = useRef(null);

  /* ── Guardar resultado y avanzar a results ─────────── */
  const finishRef = useRef(null);
  finishRef.current = useCallback(() => {
    const { score, pct } = calcScore(answers, quizQuestions);
    const grade = getGrade(pct);

    const resultData = {
      score,
      pct,
      grade: grade.label,
      answers: compressAnswers(answers),
    };

    // Si tenemos un doc pendiente, lo actualizamos a "Finalizado"
    // Si no (falló la creación), creamos uno nuevo completo
    if (pendingDocRef.current) {
      completeResult(pendingDocRef.current, resultData)
        .then(() => console.log("[quiz] Resultado actualizado a Finalizado"))
        .catch(e => {
          console.error("[quiz] Error completando resultado, creando nuevo:", e);
          // Fallback: crear doc nuevo si la actualización falla
          addResult({
            ...studentInfo,
            ...resultData,
            status: "Finalizado",
            timestamp: new Date().toISOString(),
          }).catch(e2 => console.error("[quiz] Error en fallback:", e2));
        });
    } else {
      addResult({
        ...studentInfo,
        ...resultData,
        status: "Finalizado",
        timestamp: new Date().toISOString(),
      }).catch(e => console.error("[quiz] Error guardando resultado:", e));
    }

    try { localStorage.setItem("last_sub", Date.now().toString()); } catch(e){}
    pendingDocRef.current = null;
    setPhase("results");
  }, [answers, studentInfo, quizQuestions]);

  /* ── Avanzar pregunta (o terminar) ─────────────────── */
  const advanceRef = useRef(null);
  advanceRef.current = useCallback(() => {
    if (qIdx >= QUIZ_SIZE - 1) finishRef.current();
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
    if (qIdx < QUIZ_SIZE - 1) {
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

    // Generar nueva aleatorización: 50 preguntas aleatorias del banco de 57, con opciones mezcladas
    const shuffled = prepareQuiz(QUESTIONS, QUIZ_SIZE);
    setQuizQuestions(shuffled);
    setAnswers(Array(QUIZ_SIZE).fill(null));
    setLocked(Array(QUIZ_SIZE).fill(false));
    setQIdx(0);

    setPhase("quiz");

    // Crear registro "En Proceso" en Firestore (visible en tiempo real para admin)
    createPendingResult(info)
      .then(docId => {
        pendingDocRef.current = docId;
        console.log("[quiz] Registro 'En Proceso' creado:", docId);
      })
      .catch(e => {
        console.warn("[quiz] No se pudo crear registro pendiente:", e);
        // El examen continúa normal — al finalizar se crea un doc nuevo
      });
  };

  /* ── Reset completo ─────────────────────────────────── */
  const handleReset = () => {
    setPhase("landing");
    setQIdx(0);
    setAnswers(Array(QUIZ_SIZE).fill(null));
    setLocked(Array(QUIZ_SIZE).fill(false));
    setStudentInfo({ name: "", email: "", institution: "", municipality: "" });
    // Preparar nueva aleatorización para la próxima sesión
    setQuizQuestions(prepareQuiz(QUESTIONS, QUIZ_SIZE));
    pendingDocRef.current = null;
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
    quizQuestions,
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

