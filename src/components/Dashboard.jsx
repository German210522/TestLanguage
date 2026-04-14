// src/components/Dashboard.jsx
// Panel administrativo: resumen, tabla de estudiantes y gestión de usuarios

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { subscribeResults, deleteResult, subscribeUsers, addUser, toggleUserActive, deleteUser } from "../utils/storage";
import { TOTAL as QUESTIONS_TOTAL } from "../data/questions";
import { exportResultsCSV } from "../utils/exportCsv";
import CreditsBar from "./CreditsBar";

/* ── Subcomponente: tarjeta de gráfica ──────────────────── */
function CardChart({ title, children }) {
  return (
    <div style={{ background: "white", borderRadius: 14, padding: "20px", border: "1px solid #e2e8f0" }}>
      <h4 style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 16, textTransform: "uppercase", letterSpacing: .8 }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

export default function Dashboard({ currentUser, onLogout }) {
  const [tab, setTab]           = useState("overview");
  const [results, setResults]   = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterInst, setFilterInst] = useState("");
  const [newUser, setNewUser]   = useState({ name: "", username: "", password: "", role: "docente" });
  const [userErr, setUserErr]   = useState("");
  const [refresh, setRefresh]   = useState(0);

  const reload = () => setRefresh(k => k + 1);

  const lbl = {
    display: "block", fontSize: 11, fontWeight: 700, color: "#374151",
    marginBottom: 5, letterSpacing: .3, textTransform: "uppercase",
  };

  useEffect(() => {
    let unmounted = false;
    
    const unsubResults = subscribeResults((data) => {
      if (!unmounted) {
        setResults(data);
        setLoading(false);
      }
    }, (err) => {
      if (!unmounted) {
        setLoading(false);
        if (err.message.includes("permission")) {
          alert("Error de Permisos: Ve a Firebase Console -> Firestore -> Reglas y pon 'allow read: if true;' en la colección results.");
        }
      }
    });

    const unsubUsers = subscribeUsers((data) => {
      if (!unmounted) setUsers(data);
    }, (err) => {
      if (!unmounted) setLoading(false);
    });

    return () => {
      unmounted = true;
      unsubResults();
      unsubUsers();
    };
  }, []);

  /* ── Estadísticas ───────────────────────────────────── */
  const total       = results.length;
  const avgPct      = total ? Math.round(results.reduce((a, r) => a + r.pct, 0) / total) : 0;
  const approved    = results.filter(r => r.pct >= 60).length;
  const failed      = total - approved;
  const approvedPct = total ? Math.round((approved / total) * 100) : 0;

  /* ── Datos para gráficas ────────────────────────────── */
  const distData = Array.from({ length: 10 }, (_, i) => ({
    name: `${i * 10}–${i === 9 ? 100 : i * 10 + 9}`,
    count: results.filter(r => r.pct >= i * 10 && (i === 9 ? r.pct <= 100 : r.pct < (i + 1) * 10)).length,
  }));

  const pieApprove = [
    { name: `Aprobados (${approvedPct}%)`,        value: approved, color: "#22c55e" },
    { name: `Reprobados (${100 - approvedPct}%)`,  value: failed,   color: "#ef4444" },
  ].filter(d => d.value > 0);

  const gradeData = [
    { name: "Excelente ≥90%",   value: results.filter(r => r.pct >= 90).length,              color: "#16a34a" },
    { name: "Muy bueno ≥75%",   value: results.filter(r => r.pct >= 75 && r.pct < 90).length, color: "#2563eb" },
    { name: "Bueno ≥60%",       value: results.filter(r => r.pct >= 60 && r.pct < 75).length, color: "#d97706" },
    { name: "Regular ≥50%",     value: results.filter(r => r.pct >= 50 && r.pct < 60).length, color: "#ea580c" },
    { name: "Insuficiente <50%", value: results.filter(r => r.pct <  50).length,               color: "#dc2626" },
  ].filter(d => d.value > 0);

  const instMap = {};
  results.forEach(r => {
    if (!instMap[r.institution]) instMap[r.institution] = { sum: 0, n: 0 };
    instMap[r.institution].sum += r.pct;
    instMap[r.institution].n++;
  });
  const instData = Object.entries(instMap)
    .map(([name, { sum, n }]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, avg: Math.round(sum / n), n }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 8);

  /* ── Tabla filtrada ─────────────────────────────────── */
  const institutions = [...new Set(results.map(r => r.institution))].sort();
  const filtered = results
    .filter(r => {
      const s = search.toLowerCase();
      return (
        (!s || [r.name, r.email, r.institution, r.municipality].some(v => v.toLowerCase().includes(s))) &&
        (!filterInst || r.institution === filterInst)
      );
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  /* ── Gestión de usuarios ────────────────────────────── */
  const handleAddUser = async () => {
    setUserErr("");
    if (!newUser.name || !newUser.username || !newUser.password) { setUserErr("Completa todos los campos."); return; }
    if (newUser.password.length < 6) { setUserErr("Contraseña mínima: 6 caracteres."); return; }
    if (users.find(u => u.username === newUser.username)) { setUserErr("Ese usuario ya existe."); return; }
    await addUser(newUser);
    setNewUser({ name: "", username: "", password: "", role: "docente" });
    // reload() no es necesario ya que onSnapshot actualizará la tabla automáticamente.
  };

  const handleToggle = async id => { await toggleUserActive(id); reload(); };
  const handleDeleteUser = async id => {
    if (currentUser.id !== "superadmin") { alert("Solo el Super Administrador puede eliminar usuarios."); return; }
    if (id === "superadmin" || id === "1") { alert("No puedes eliminar al Super Administrador."); return; }
    if (id === currentUser.id) { alert("No puedes eliminarte a ti mismo."); return; }
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      reload();
    } catch (e) {
      alert(e.message);
    }
  };
  const handleDeleteResult = async id => {
    if (!confirm("¿Eliminar este registro?")) return;
    await deleteResult(id);
    reload();
  };

  const navItems = [
    { id: "overview",  icon: "📊", label: "Resumen" },
    { id: "students",  icon: "👥", label: "Estudiantes" },
    ...(currentUser.role === "admin" ? [{ id: "users", icon: "⚙️", label: "Usuarios" }] : []),
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", fontFamily: "'Lato',sans-serif", color: "#64748b", gap: 12 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 24, height: 24, border: "3px solid #e2e8f0", borderTopColor: "#4f46e5", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      Cargando datos…
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Lato',sans-serif", paddingBottom: 52 }}>
        {/* ── Sidebar */}
        <div className="db-sidebar" style={{
          width: 220, flexShrink: 0, background: "#0f172a", display: "flex",
          flexDirection: "column", padding: "20px 14px", position: "sticky",
          top: 0, height: "100vh", overflowY: "auto",
        }}>
          <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #1e293b" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", color: "white", fontSize: 17, marginBottom: 2 }}>Panel Administrativo</div>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: 1.2, textTransform: "uppercase" }}>Evaluación de Lenguaje</div>
          </div>

          {navItems.map(({ id, icon, label }) => (
            <button key={id} className={`db-nav-btn${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span className="db-sidebar-label">{label}</span>
            </button>
          ))}

          <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid #1e293b" }}>
            <div className="db-sidebar-label" style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>Conectado como</div>
            <div className="db-sidebar-label" style={{ color: "white", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{currentUser.name}</div>
            <div className="db-sidebar-label" style={{ fontSize: 10, color: "#818cf8", textTransform: "uppercase", letterSpacing: .6, marginBottom: 14 }}>{currentUser.role}</div>
            {/* The logout button text is hidden on mobile inside db-sidebar-label, so we provide an icon explicitly visible on mobile */}
            <button className="btn-ghost" style={{ width: "100%", fontSize: 12, color: "#94a3b8", borderColor: "#1e293b", padding: "8px 0" }} onClick={onLogout} title="Cerrar sesión">
              <span className="db-sidebar-label">← Cerrar sesión</span>
              <span className="db-sidebar-icon" style={{ display: "none" }}>🚪</span>
            </button>
          </div>
        </div>

        {/* ── Content */}
        <div style={{ flex: 1, background: "#f1f5f9", overflowY: "auto", minWidth: 0 }}>
          {/* Top bar */}
          <div className="db-topbar" style={{
            background: "white", borderBottom: "1px solid #e2e8f0", padding: "16px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          }}>
            <div>
              <h2 style={{ fontSize: 19, fontWeight: 900, color: "#0f172a", fontFamily: "'Playfair Display',serif" }}>
                {tab === "overview" ? "Resumen General" : tab === "students" ? "Registros de Estudiantes" : "Gestión de Usuarios"}
              </h2>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
                {total} examen{total !== 1 ? "es" : ""} registrado{total !== 1 ? "s" : ""}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ padding: "9px 18px", fontSize: 13, color: "#16a34a", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 6 }}>●</span> En vivo
              </div>
              <button 
                className="btn-sm-danger" 
                onClick={onLogout} 
                style={{ padding: "9px 16px", fontSize: 13, border: "none", borderRadius: "9px" }}
              >
                Cerrar Sesión ✕
              </button>
            </div>
          </div>

          <div className="db-content" style={{ padding: "24px 28px", paddingBottom: 60 }}>

            {/* ══ TAB: RESUMEN */}
            {tab === "overview" && (
              <div className="fade-in">
                <div className="db-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 22 }}>
                  {[
                    { label: "Total exámenes",   val: total,                            icon: "📝", c: "#4f46e5", bg: "#eef2ff" },
                    { label: "Promedio general",  val: avgPct + "%",                     icon: "📈", c: "#0891b2", bg: "#ecfeff" },
                    { label: "Aprobados ≥60%",   val: `${approved} (${approvedPct}%)`,  icon: "✅", c: "#16a34a", bg: "#f0fdf4" },
                    { label: "Reprobados <60%",   val: `${failed} (${total ? 100 - approvedPct : 0}%)`, icon: "❌", c: "#dc2626", bg: "#fef2f2" },
                  ].map(({ label, val, icon, c, bg }) => (
                    <div key={label} style={{ background: "white", borderRadius: 14, padding: "18px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div>
                      <div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: .6 }}>{label}</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: c, lineHeight: 1.2, marginTop: 2 }}>{total > 0 ? val : "–"}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {total === 0 ? (
                  <div style={{ background: "white", borderRadius: 14, padding: "56px", textAlign: "center", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 52, marginBottom: 14 }}>📊</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#475569" }}>Sin datos todavía</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>Los gráficos aparecerán cuando los estudiantes completen exámenes.</div>
                  </div>
                ) : (
                  <>
                    <div className="db-charts-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      <CardChart title="Distribución de punteos (%)">
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={distData} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={v => [v, "Estudiantes"]} />
                            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardChart>
                      <CardChart title="Aprobados vs. Reprobados">
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie data={pieApprove} cx="50%" cy="45%" innerRadius={55} outerRadius={85}
                              dataKey="value" paddingAngle={3}
                              label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                              {pieApprove.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                            <Tooltip formatter={v => [v, "Estudiantes"]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardChart>
                    </div>
                    <div className="db-charts-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <CardChart title="Distribución por calificación">
                        <ResponsiveContainer width="100%" height={230}>
                          <PieChart>
                            <Pie data={gradeData} cx="50%" cy="45%" outerRadius={85} dataKey="value" paddingAngle={2}>
                              {gradeData.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                            <Tooltip formatter={v => [v, "Estudiantes"]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardChart>
                      <CardChart title="Promedio por institución (%)">
                        {instData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={230}>
                            <BarChart data={instData} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} />
                              <YAxis type="category" dataKey="name" width={115} tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
                              <Tooltip formatter={v => [v + "%", "Promedio"]} />
                              <Bar dataKey="avg" fill="#0891b2" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 13 }}>Sin datos de instituciones</div>
                        )}
                      </CardChart>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ══ TAB: ESTUDIANTES */}
            {tab === "students" && (
              <div className="fade-in">
                <div style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #e2e8f0", marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={{ flex: 2, minWidth: 200 }}>
                    <label style={lbl}>Buscar</label>
                    <input type="text" placeholder="Nombre, correo, institución, municipio…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={lbl}>Filtrar por institución</label>
                    <select value={filterInst} onChange={e => setFilterInst(e.target.value)}>
                      <option value="">Todas</option>
                      {institutions.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                    </select>
                  </div>
                  <button className="btn-outline" onClick={() => exportResultsCSV(filtered)} disabled={filtered.length === 0}>
                    ⬇ Exportar CSV ({filtered.length})
                  </button>
                </div>

                <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          {["#", "Nombre", "Correo", "Institución", "Municipio", "Punteo", "%", "Calificación", "Fecha", ""].map(h => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.length === 0 ? (
                          <tr><td colSpan={10} style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Sin resultados</td></tr>
                        ) : filtered.map((r, i) => (
                          <tr key={r._docId || r.id}>
                            <td style={{ color: "#94a3b8", fontSize: 12 }}>{i + 1}</td>
                            <td style={{ fontWeight: 600 }}>{r.name}</td>
                            <td style={{ color: "#64748b" }}>{r.email}</td>
                            <td>{r.institution}</td>
                            <td>{r.municipality}</td>
                            <td style={{ fontWeight: 700 }}>{r.score}/{QUESTIONS_TOTAL}</td>
                            <td>
                              <span style={{ fontWeight: 800, fontSize: 14, color: r.pct >= 60 ? "#16a34a" : "#dc2626" }}>{r.pct}%</span>
                            </td>
                            <td>
                              <span style={{ padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: r.pct >= 90 ? "#f0fdf4" : r.pct >= 75 ? "#eff6ff" : r.pct >= 60 ? "#fffbeb" : "#fef2f2", color: r.pct >= 90 ? "#16a34a" : r.pct >= 75 ? "#2563eb" : r.pct >= 60 ? "#d97706" : "#dc2626" }}>
                                {r.grade}
                              </span>
                            </td>
                            <td style={{ color: "#64748b", fontSize: 11, whiteSpace: "nowrap" }}>
                              {new Date(r.timestamp).toLocaleString("es-GT")}
                            </td>
                            <td>
                              <button className="btn-sm-danger" onClick={() => handleDeleteResult(r.id)}>✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ══ TAB: USUARIOS (solo admin) */}
            {tab === "users" && currentUser.role === "admin" && (
              <div className="fade-in">
                {/* Crear usuario */}
                <div style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: "1px solid #e2e8f0", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>➕ Crear nuevo usuario</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 14 }}>
                    {[["name","Nombre completo","text"],["username","Usuario","text"],["password","Contraseña","password"]].map(([k, l, t]) => (
                      <div key={k}>
                        <label style={lbl}>{l}</label>
                        <input type={t} placeholder={l} value={newUser[k]} onChange={e => setNewUser(p => ({ ...p, [k]: e.target.value }))} />
                      </div>
                    ))}
                    <div>
                      <label style={lbl}>Rol</label>
                      <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                        <option value="docente">Docente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </div>
                  {userErr && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", fontSize: 12.5, color: "#dc2626", marginBottom: 12 }}>⚠ {userErr}</div>}
                  <button className="btn-primary" onClick={handleAddUser}>Crear Usuario</button>
                </div>

                {/* Lista de usuarios */}
                <div style={{ background: "white", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                      <thead>
                        <tr>{["#", "Nombre", "Usuario", "Rol", "Estado", "Acciones"].map(h => <th key={h}>{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id}>
                            <td style={{ color: "#94a3b8", fontSize: 12 }}>{i + 1}</td>
                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                            <td><code style={{ background: "#f1f5f9", padding: "2px 7px", borderRadius: 5, fontSize: 12 }}>{u.username}</code></td>
                            <td>
                              <span style={{ padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: u.role === "admin" ? "#eef2ff" : "#f0fdf4", color: u.role === "admin" ? "#4f46e5" : "#16a34a" }}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: 12, fontWeight: 700, color: u.active ? "#16a34a" : "#dc2626" }}>
                                {u.active ? "● Activo" : "○ Inactivo"}
                              </span>
                            </td>
                            <td style={{ display: "flex", gap: 6, padding: "9px 14px" }}>
                              {(u.id !== "1" && u.id !== "superadmin") ? (
                                <>
                                  <button className={u.active ? "btn-sm-neutral" : "btn-sm-success"} onClick={() => handleToggle(u.id)}>
                                    {u.active ? "Desactivar" : "Activar"}
                                  </button>
                                  {u.id !== currentUser.id && currentUser.id === "superadmin" && (
                                    <button className="btn-sm-danger" onClick={() => handleDeleteUser(u.id)}>Eliminar</button>
                                  )}
                                </>
                              ) : (
                                <span style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic" }}>Super Admin (protegido)</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreditsBar />
    </>
  );
}


