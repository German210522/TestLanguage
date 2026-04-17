// src/App.jsx
// Componente raíz — orquesta fases y componentes

import { useEffect, useState } from "react";
import { useQuiz } from "./hooks/useQuiz";
import { initDB } from "./utils/storage";
import { seedDemoData } from "./utils/seedData";

import AuthModal    from "./components/AuthModal";
import LandingView  from "./components/LandingView";
import QuizView     from "./components/QuizView";
import ResultsView  from "./components/ResultsView";
import Dashboard    from "./components/Dashboard";

import "./styles/globals.css";

export default function App() {
  const {
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
    handleAdvance,
    handleReset,
    handleLogin,
    handleLogout,
    setPhase,
  } = useQuiz();

  // Inicializar base de datos + datos demo (fire-and-forget, no bloquea UI)
  useEffect(() => {
    initDB().catch(e => console.warn("[App] initDB falló:", e));
    seedDemoData().catch(e => console.warn("[App] seedData falló:", e));
  }, []);

  // Modo noche (Manejo de estado y persistencia)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Cierre de sesión automático al retroceder en el navegador
  useEffect(() => {
    if (currentUser) {
      window.history.pushState({ p: "dashboard" }, "");
    }
    const onPop = () => {
      if (currentUser) {
        handleLogout();
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [currentUser, handleLogout]);

  return (
    <>
      {/* Botón flotante para Modo Noche */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          position: "fixed", top: 16, right: 16, zIndex: 9999,
          background: darkMode ? "#374151" : "#f1f5f9",
          border: "2px solid", borderColor: darkMode ? "#4b5563" : "#e2e8f0",
          color: darkMode ? "#fbbf24" : "#64748b",
          width: 44, height: 44, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.2s"
        }}
        title="Alternar Modo Noche"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>

      {/* Modal de autenticación — disponible en cualquier fase */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}

      {/* ── Fase: inicio */}
      {phase === "landing" && (
        <LandingView
          onStart={handleStart}
          onOpenAuth={() => setShowAuth(true)}
        />
      )}

      {/* ── Fase: cuestionario */}
      {phase === "quiz" && (
        <QuizView
          qIdx={qIdx}
          answers={answers}
          locked={locked}
          timeLeft={timeLeft}
          timesUp={timesUp}
          onSelect={handleSelect}
          onAdvance={handleAdvance}
        />
      )}

      {/* ── Fase: resultados */}
      {phase === "results" && (
        <ResultsView
          info={studentInfo}
          answers={answers}
          currentUser={currentUser}
          onReset={handleReset}
          onOpenAuth={() => setShowAuth(true)}
          onOpenDashboard={() => setPhase("dashboard")}
        />
      )}

      {/* ── Fase: panel admin */}
      {phase === "dashboard" && currentUser && (
        <Dashboard
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
