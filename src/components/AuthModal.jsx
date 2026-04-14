// src/components/AuthModal.jsx
// Modal de autenticación para docentes y personal administrativo

import { useState } from "react";
import { findUser } from "../utils/storage";

export default function AuthModal({ onClose, onLogin }) {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.username || !form.password) { setErr("Completa todos los campos."); return; }
    setLoading(true);
    setErr("");
    const user = await findUser(form.username, form.password);
    setLoading(false);
    if (user) onLogin(user);
    else setErr("Credenciales incorrectas o cuenta inactiva.");
  };

  const lbl = {
    display: "block", fontSize: 11, fontWeight: 700, color: "#374151",
    marginBottom: 5, letterSpacing: .3, textTransform: "uppercase",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.65)",
      backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 1000, padding: 20,
    }}>
      <div className="fade-in" style={{
        background: "white", borderRadius: 20, width: "100%", maxWidth: 380,
        overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,.45)",
      }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#4f46e5,#7c3aed)", padding: "28px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔐</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", color: "white", fontSize: 22, marginBottom: 4 }}>
            Acceso Personal
          </h3>
          <p style={{ color: "#bfdbfe", fontSize: 12.5 }}>Docentes y personal administrativo</p>
        </div>

        {/* Body */}
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Usuario</label>
            <input
              type="text" placeholder="Nombre de usuario" value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Contraseña</label>
            <input
              type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && submit()}
            />
          </div>

          {err && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8,
              padding: "9px 13px", fontSize: 12.5, color: "#dc2626", marginBottom: 14,
            }}>
              ⚠ {err}
            </div>
          )}

          <button className="btn-primary" style={{ width: "100%", padding: "12px" }} onClick={submit} disabled={loading}>
            {loading ? "Verificando…" : "Ingresar al Panel →"}
          </button>
          <button className="btn-ghost" style={{ width: "100%", marginTop: 10 }} onClick={onClose}>
            Cancelar
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 14 }}>
            Contacta al administrador del sistema si tienes problemas de acceso.
          </p>
        </div>
      </div>
    </div>
  );
}
