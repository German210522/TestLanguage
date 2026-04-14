// src/components/QuizView.jsx
// Vista del cuestionario — responsive para móvil, tablet y escritorio

import TimerRing from "./TimerRing";
import CreditsBar from "./CreditsBar";
import { QUESTIONS, TOTAL, OPTION_LABELS } from "../data/questions";

export default function QuizView({ qIdx, answers, locked, timeLeft, timesUp, onSelect, onAdvance }) {
  const q      = QUESTIONS[qIdx];
  const sel    = answers[qIdx];
  const isLock = locked[qIdx] || timesUp;

  const optClass = i => {
    if (!isLock) return "opt-btn";
    if (sel === i) return i === q.correct ? "opt-btn correct" : "opt-btn wrong";
    if (i === q.correct) return "opt-btn reveal";
    return "opt-btn dim";
  };

  const badgeBg = i => {
    if (!isLock) return "#e0e7ff";
    if (sel === i) return i === q.correct ? "#16a34a" : "#dc2626";
    if (i === q.correct) return "#16a34a";
    return "#e2e8f0";
  };

  const badgeColor = i => {
    if (!isLock) return "#4338ca";
    if (sel === i || i === q.correct) return "white";
    return "#94a3b8";
  };

  return (
    <>
      <div style={{
        minHeight: "100vh",
        paddingBottom: 64,
        background: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "16px 12px", fontFamily: "'Lato',sans-serif",
      }}>
        {/* Barra de progreso */}
        <div style={{ width: "100%", maxWidth: 720, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <span style={{ color: "#7c86a1", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
              Pregunta {qIdx + 1} de {TOTAL}
            </span>
            <span style={{ color: "#7c86a1", fontSize: 12 }}>
              {answers.filter(a => a !== null).length} respondida{answers.filter(a => a !== null).length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="pbar">
            <div className="pfill" style={{ width: `${(qIdx / TOTAL) * 100}%` }} />
          </div>
        </div>

        {/* Card de pregunta */}
        <div className="slide-up quiz-card" key={qIdx} style={{
          background: "white", borderRadius: 20, maxWidth: 720, width: "100%",
          boxShadow: "0 30px 80px rgba(0,0,0,.55)", overflow: "hidden",
        }}>

          {/* Encabezado del card */}
          <div className="quiz-card-header" style={{
            background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "14px 22px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white",
                width: 38, height: 38, borderRadius: 11, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, flexShrink: 0,
              }}>
                {qIdx + 1}
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>
                  Evaluación de Lenguaje
                </div>
                <div style={{ fontSize: 11.5, color: "#64748b" }}>Español Latinoamericano</div>
              </div>
            </div>
            <TimerRing timeLeft={timeLeft} />
          </div>

          {/* Cuerpo del card */}
          <div className="quiz-card-body" style={{ padding: "22px 26px 26px" }}>
            {timesUp && sel === null && (
              <div style={{
                background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 10,
                padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#92400e", fontWeight: 600,
              }}>
                ⏱ Tiempo agotado — avanzando automáticamente…
              </div>
            )}

            <p className="quiz-question-text" style={{
              fontSize: 17, fontWeight: 600, color: "#0f172a", lineHeight: 1.55,
              marginBottom: 22, fontFamily: "'Playfair Display',serif",
            }}>
              {q.q}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {q.opts.map((opt, i) => (
                <button
                  key={i}
                  className={optClass(i)}
                  disabled={isLock}
                  onClick={() => onSelect(i)}
                >
                  <span className="badge" style={{ background: badgeBg(i), color: badgeColor(i) }}>
                    {isLock && sel === i && i === q.correct ? "✓"
                     : isLock && sel === i && i !== q.correct ? "✗"
                     : OPTION_LABELS[i]}
                  </span>
                  <span>{opt}</span>
                  {isLock && i === q.correct && sel !== i && (
                    <span style={{ marginLeft: "auto", color: "#16a34a", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                      ✓ Correcta
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Botón final: Aparece si se seleccionó respuesta o se acabó el tiempo en la última pregunta */}
            {(sel !== null || timesUp) && qIdx === TOTAL - 1 && (
              <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end", animation: "fadeIn 0.4s ease" }}>
                <button 
                  className="btn-primary" 
                  onClick={onAdvance}
                  style={{ boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)", padding: "12px 24px" }}
                >
                  Confirmar y Ver Resultados →
                </button>
              </div>
            )}
        </div>
      </div>
      <CreditsBar />
    </>
  );
}
