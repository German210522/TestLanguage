// src/components/TimerRing.jsx
// Anillo SVG animado que muestra el tiempo restante por pregunta

import { TIME_PER_QUESTION } from "../data/questions";

export default function TimerRing({ timeLeft }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const color =
    timeLeft > 20 ? "#6366f1" :
    timeLeft > 10 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ position: "relative", width: 76, height: 76, flexShrink: 0 }}>
      <svg width="76" height="76" style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx="38" cy="38" r={r} fill="none" stroke="#1e3a8a" strokeWidth="6" />
        <circle
          cx="38" cy="38" r={r}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - timeLeft / TIME_PER_QUESTION)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .9s linear, stroke .3s" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1, fontFamily: "'Lato',sans-serif" }}>
          {timeLeft}
        </span>
        <span style={{ fontSize: 8, color: "#64748b", letterSpacing: 1.5, marginTop: 1, fontFamily: "'Lato',sans-serif", textTransform: "uppercase" }}>
          seg
        </span>
      </div>
    </div>
  );
}
