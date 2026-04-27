// src/components/LandingView.jsx
// Pantalla de inicio: formulario de datos del estudiante — responsive + sin botón duplicado

import { useState } from "react";
import { validateStudentForm } from "../utils/grading";
import CreditsBar from "./CreditsBar";

const FIELD_CFG = [
  { k: "name",         l: "Nombre completo",       t: "text",  ph: "Ej. María López García",       max: 100 },
  { k: "email",        l: "Correo electrónico",     t: "email", ph: "Ej. maria@correo.com",          max: 120 },
  { k: "phone",        l: "Número de teléfono",     t: "tel",   ph: "Ej. 45678912",                 max: 8 },
  { k: "institution",  l: "Institución educativa",  t: "text",  ph: "Ej. Instituto Nacional de...", max: 120 },
  { k: "municipality", l: "Municipio",              t: "text",  ph: "Ej. Huehuetenango",            max: 80  },
];

export default function LandingView({ onStart, onOpenAuth, onOpenTerms }) {
  const [info, setInfo]     = useState({ name: "", email: "", phone: "", institution: "", municipality: "", career: "", customCareer: "" });
  const [errors, setErrors] = useState({});

  const handleStart = () => {
    const e = validateStudentForm(info);
    setErrors(e);
    if (!Object.keys(e).length) onStart(info);
  };

  const lbl = {
    display: "block", fontSize: 11.5, fontWeight: 700, color: "#374151",
    marginBottom: 5, letterSpacing: .3, textTransform: "uppercase",
  };

  return (
    <>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        paddingTop: 40, paddingBottom: 84, paddingLeft: 16, paddingRight: 16,
        fontFamily: "'Lato',sans-serif",
      }}>
        <div className="fade-in" style={{
          background: "white", borderRadius: 22, maxWidth: 560, width: "100%",
          overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.6)",
        }}>

          {/* ── Header del card ───────────────────────────────── */}
          <div
            className="landing-card-header"
            style={{
              background: "linear-gradient(135deg,#1e3a8a 0%,#4f46e5 60%,#7c3aed 100%)",
              padding: "32px 28px", position: "relative", overflow: "hidden",
            }}
          >
            {/* Círculo decorativo de fondo */}
            <div style={{
              position: "absolute", top: -30, right: -30, width: 120, height: 120,
              borderRadius: "50%", background: "rgba(255,255,255,.05)",
            }} />
            <div style={{
              position: "absolute", bottom: -40, left: -20, width: 150, height: 150,
              borderRadius: "50%", background: "rgba(255,255,255,.04)",
            }} />

            <div style={{ textAlign: "center", position: "relative" }}>
              {/* Logo institucional */}
              <img
                src="/usac_logo.png"
                alt="USAC - CUNOROC"
                style={{
                  width: 240, height: "auto", borderRadius: 14,
                  marginBottom: 16, filter: "brightness(1.15)",
                  border: "2px solid rgba(255,255,255,.15)",
                }}
              />
              {/* Etiqueta superior */}
              <div style={{
                fontSize: 10, letterSpacing: 3, color: "#93c5fd", fontWeight: 700,
                textTransform: "uppercase", marginBottom: 10,
              }}>
                Evaluación General · Nivel Diversificado
              </div>

              {/* Título */}
              <h1
                className="landing-title"
                style={{
                  fontFamily: "'Playfair Display',serif", fontSize: 30,
                  color: "white", lineHeight: 1.15, marginBottom: 6,
                }}
              >
                Evaluación de Lenguaje
              </h1>
              <p style={{ color: "#bfdbfe", fontSize: 14 }}>Español</p>

              {/* Stats pills */}
              <div
                className="landing-stats"
                style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 18, flexWrap: "wrap" }}
              >
                {[["50","Preguntas"],["1 min","Por pregunta"],["Opción","Múltiple"]].map(([n,l]) => (
                  <div
                    key={l}
                    className="landing-stat-box"
                    style={{
                      background: "rgba(255,255,255,.14)", backdropFilter: "blur(4px)",
                      borderRadius: 10, padding: "8px 18px", textAlign: "center",
                      border: "1px solid rgba(255,255,255,.1)",
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>{n}</div>
                    <div style={{ fontSize: 10, color: "#c7d2fe", letterSpacing: .5 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Body del formulario ────────────────────────────── */}
          <div className="landing-card-body" style={{ padding: "26px 30px 30px" }}>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.65, marginBottom: 22 }}>
              Completa tus datos antes de comenzar. Cada pregunta tiene límite de{" "}
              <strong style={{ color: "#4f46e5" }}>60 segundos</strong>. Al seleccionar
              una respuesta, se bloqueará automáticamente.
            </p>

            {/* Campos */}
            {FIELD_CFG.map(({ k, l, t, ph, max }) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={lbl}>{l}</label>
                <input
                  type={t}
                  placeholder={ph}
                  value={info[k]}
                  maxLength={max}
                  className={errors[k] ? "inp-err" : ""}
                  onChange={e => setInfo(p => ({ ...p, [k]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleStart()}
                />
                {errors[k] && (
                  <p style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>⚠ {errors[k]}</p>
                )}
              </div>
            ))}

            {/* Selector de Carrera */}
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>¿Qué carrera aspira seguir?</label>
              <select
                className={errors.career ? "inp-err" : ""}
                style={{
                  width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #cbd5e1",
                  fontSize: 14, fontFamily: "'Lato',sans-serif", background: "#f8fafc", outline: "none",
                  transition: "all .2s ease"
                }}
                value={info.career}
                onChange={e => setInfo(p => ({ ...p, career: e.target.value }))}
              >
                <option value="">-- Selecciona una opción --</option>
                <option value="Profesorado en Pedagogía">Profesorado en Pedagogía</option>
                <option value="Licenciatura en Pedagogía y Administración Educativa">Licenciatura en Pedagogía y Administración Educativa</option>
                <option value="Ciencias Jurídicas y Sociales (Derecho)">Ciencias Jurídicas y Sociales (Derecho)</option>
                <option value="Trabajo Social">Trabajo Social</option>
                <option value="Ingeniería Agrónoma">Ingeniería Agrónoma</option>
                <option value="-Otros-">-Otros-</option>
              </select>
              {errors.career && (
                <p style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>⚠ {errors.career}</p>
              )}
            </div>

            {info.career === "-Otros-" && (
              <div className="fade-in" style={{ marginBottom: 14 }}>
                <label style={lbl}>Especifica tu carrera</label>
                <input
                  type="text"
                  placeholder="Ej. Medicina"
                  value={info.customCareer || ""}
                  maxLength={100}
                  className={errors.customCareer ? "inp-err" : ""}
                  onChange={e => setInfo(p => ({ ...p, customCareer: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleStart()}
                />
                {errors.customCareer && (
                  <p style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>⚠ {errors.customCareer}</p>
                )}
              </div>
            )}

            {/* Botón principal */}
            <button
              style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white",
                border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Lato',sans-serif", marginTop: 8,
                transition: "opacity .2s, transform .15s",
                letterSpacing: .3,
              }}
              onClick={handleStart}
              onMouseOver={e => e.currentTarget.style.opacity = ".9"}
              onMouseOut={e  => e.currentTarget.style.opacity = "1"}
            >
              Comenzar Evaluación →
            </button>
            {/* Enlace de dudas */}
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={() => onOpenTerms("info")}
                style={{
                  background: "#f8fafc", 
                  border: "1px solid #e2e8f0", 
                  color: "#4f46e5", 
                  fontSize: 12.5,
                  padding: "10px 20px",
                  borderRadius: 14,
                  cursor: "pointer", 
                  fontFamily: "'Lato',sans-serif",
                  transition: "all .2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,.03)"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.color = "#4338ca";
                  e.currentTarget.style.borderColor = "#c7d2fe";
                  e.currentTarget.style.background = "#eff6ff";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.color = "#4f46e5";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#f8fafc";
                }}
              >
                <span>ℹ️</span>
                <span>¿Tienes dudas? Más Información</span>
              </button>
            </div>
            {/* Aviso de términos y privacidad - Oculto de momento */}
            {/* 
            <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 12, lineHeight: 1.6 }}>
              Al continuar, aceptas nuestros{" "}
              <button
                onClick={() => onOpenTerms("terms")}
                style={{
                  background: "none", border: "none", color: "#4f46e5",
                  fontSize: 11, cursor: "pointer", textDecoration: "underline",
                  fontFamily: "'Lato',sans-serif", padding: 0, fontWeight: 600,
                }}
              >
                Términos de Servicio
              </button>
              {" "}y{" "}
              <button
                onClick={() => onOpenTerms("privacy")}
                style={{
                  background: "none", border: "none", color: "#4f46e5",
                  fontSize: 11, cursor: "pointer", textDecoration: "underline",
                  fontFamily: "'Lato',sans-serif", padding: 0, fontWeight: 600,
                }}
              >
                Política de Privacidad
              </button>
            </p>
            */}
            {/* Enlace de acceso docente (Botón más prominente para móvil) */}
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={onOpenAuth}
                style={{
                  background: "#f8fafc", 
                  border: "1px solid #e2e8f0", 
                  color: "#64748b", 
                  fontSize: 12.5,
                  padding: "10px 20px",
                  borderRadius: 14,
                  cursor: "pointer", 
                  fontFamily: "'Lato',sans-serif",
                  transition: "all .2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(0,0,0,.03)"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.color = "#4f46e5";
                  e.currentTarget.style.borderColor = "#c7d2fe";
                  e.currentTarget.style.background = "#eff6ff";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.color = "#64748b";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#f8fafc";
                }}
              >
                <span>🔐</span>
                <span>Área de Docentes y Administración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <CreditsBar />
    </>
  );
}
