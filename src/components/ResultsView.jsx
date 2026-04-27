// src/components/ResultsView.jsx
// Pantalla de resultados — responsive para todos los dispositivos

import { getGrade, getFeedback, calcScore } from "../utils/grading";
import { QUIZ_SIZE } from "../data/questions";
import CreditsBar from "./CreditsBar";

export default function ResultsView({ info, answers, onReset, onOpenAuth, onOpenDashboard, currentUser, questions }) {
  const { score, pct, unanswered, wrong } = calcScore(answers, questions);
  const grade    = getGrade(pct);
  const feedback = getFeedback(pct);

  return (
    <>
      <div style={{
        minHeight: "100vh",
        paddingBottom: 64,
        background: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 16px", fontFamily: "'Lato',sans-serif",
      }}>
        <div className="fade-in" style={{
          background: "white", borderRadius: 22, maxWidth: 600, width: "100%",
          overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.6)",
        }}>

          {/* Encabezado con punteo */}
          <div style={{
            background: "linear-gradient(135deg,#1e3a8a,#4f46e5,#7c3aed)",
            padding: "36px 28px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
            <div style={{ position: "absolute", bottom: -40, left: -20, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: "#93c5fd", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
                Evaluación Completada
              </div>
              <div className="results-pct" style={{ fontFamily: "'Playfair Display',serif", fontSize: 72, fontWeight: 900, color: "white", lineHeight: 1 }}>
                {pct}%
              </div>
              <div style={{ fontSize: 15, color: "#bfdbfe", marginTop: 6, fontWeight: 600 }}>
                {score} de {QUIZ_SIZE} respuestas correctas
              </div>
              <div style={{
                marginTop: 14, display: "inline-block",
                background: "rgba(255,255,255,.18)", backdropFilter: "blur(4px)",
                padding: "7px 22px", borderRadius: 20, fontSize: 15, color: "white",
                fontWeight: 800, letterSpacing: .5,
              }}>
                {grade.label}
              </div>
            </div>
          </div>

          {/* Datos del estudiante */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
              Datos del Estudiante
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 18px" }}>
              {[["Nombre", info.name], ["Correo", info.email], ["Institución", info.institution], ["Municipio", info.municipality]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: .8 }}>{l}</div>
                  <div style={{ fontSize: 13.5, color: "#1e293b", fontWeight: 600, marginTop: 1, wordBreak: "break-word" }}>{v || "—"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div style={{ padding: "20px 24px 26px" }}>
            {/* Barra de progreso de punteo */}
            <div style={{ background: "#f1f5f9", borderRadius: 10, height: 9, overflow: "hidden", marginBottom: 18 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: grade.color, borderRadius: 10, transition: "width 1s ease-out" }} />
            </div>

            {/* Tarjetas de stats */}
            <div className="results-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { l: "Correctas",    v: score,      bg: "#f0fdf4", c: "#16a34a" },
                { l: "Incorrectas",  v: wrong,      bg: "#fef2f2", c: "#dc2626" },
                { l: "Sin respuesta",v: unanswered,  bg: "#fffbeb", c: "#d97706" },
              ].map(({ l, v, bg, c }) => (
                <div key={l} style={{ background: bg, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: c, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Retroalimentación */}
            <div style={{
              background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12,
              padding: "13px 16px", fontSize: 13, color: "#475569", lineHeight: 1.65, marginBottom: 18,
            }}>
              <strong style={{ color: "#1e293b" }}>Retroalimentación: </strong>{feedback}
            </div>

            {/* Botones de acción */}
            <div className="results-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                style={{
                  flex: 1, minWidth: 140, padding: "12px",
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white",
                  border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Lato',sans-serif",
                }}
                onClick={onReset}
              >
                ↩ Nueva Evaluación
              </button>

              {currentUser && (
                <button
                  style={{
                    flex: 1, minWidth: 140, padding: "12px", background: "white", color: "#4f46e5",
                    border: "2px solid #4f46e5", borderRadius: 11, fontSize: 14, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Lato',sans-serif",
                  }}
                  onClick={onOpenDashboard}
                >
                  📊 Ver Panel Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <CreditsBar />
    </>
  );
}
