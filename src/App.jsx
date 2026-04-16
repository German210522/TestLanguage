// src/App.jsx
// Componente raíz — orquesta fases y componentes

import { useEffect } from "react";
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
