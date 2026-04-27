// src/components/TermsPrivacy.jsx
// Modal de Términos de Servicio y Política de Privacidad

import { useState } from "react";

export default function TermsPrivacy({ initialTab = "info", onClose }) {
  const [tab, setTab] = useState(initialTab);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, fontFamily: "'Lato',sans-serif",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fade-in"
        style={{
          background: "white", borderRadius: 18, maxWidth: 680, width: "100%",
          maxHeight: "85vh", display: "flex", flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,.5)", overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#1e3a8a,#4f46e5)",
          padding: "22px 26px", display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#93c5fd", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
              Información Legal
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "white", fontFamily: "'Playfair Display',serif" }}>
              {tab === "terms" ? "Términos de Servicio" : tab === "privacy" ? "Política de Privacidad" : "Más Información"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.15)", border: "none", color: "white",
              width: 36, height: 36, borderRadius: 10, fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs - Ocultos de momento */}
        {/* 
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0" }}>
          {[
            { id: "info", label: "ℹ️ Resolución de Dudas" },
            { id: "terms", label: "📋 Términos" },
            { id: "privacy", label: "🔒 Privacidad" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1, padding: "12px 16px", border: "none",
                background: tab === id ? "white" : "#f8fafc",
                color: tab === id ? "#4f46e5" : "#64748b",
                fontWeight: tab === id ? 800 : 600,
                fontSize: 12.5, cursor: "pointer",
                borderBottom: tab === id ? "3px solid #4f46e5" : "3px solid transparent",
                fontFamily: "'Lato',sans-serif",
                transition: "all .2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        */}

        {/* Content */}
        <div style={{
          padding: "22px 28px", overflowY: "auto", flex: 1,
          fontSize: 13.5, color: "#334155", lineHeight: 1.75,
        }}>
          {tab === "terms" ? <TermsContent /> : tab === "privacy" ? <PrivacyContent /> : <InfoContent />}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 26px", borderTop: "1px solid #e2e8f0",
          display: "flex", justifyContent: "flex-end",
        }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: "10px 28px" }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Contenido: Términos de Servicio ────────────────── */
function TermsContent() {
  const h3Style = { fontSize: 15, fontWeight: 800, color: "#0f172a", marginTop: 20, marginBottom: 8, fontFamily: "'Playfair Display',serif" };
  const pStyle = { marginBottom: 12 };

  return (
    <>
      <p style={{ ...pStyle, color: "#94a3b8", fontSize: 12 }}>
        Última actualización: Abril 2026
      </p>

      <h3 style={h3Style}>1. Aceptación de los Términos</h3>
      <p style={pStyle}>
        Al acceder y utilizar la plataforma <strong>Evaluación de Lenguaje — Español</strong>
        (en adelante, "la Plataforma"), usted acepta cumplir con estos Términos de Servicio.
        Si no está de acuerdo con alguno de estos términos, no utilice la Plataforma.
      </p>

      <h3 style={h3Style}>2. Descripción del Servicio</h3>
      <p style={pStyle}>
        La Plataforma es una herramienta de evaluación académica diseñada para medir competencias
        en Lenguaje Español a nivel diversificado. Incluye:
      </p>
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <li>Evaluaciones de opción múltiple con temporizador</li>
        <li>Registro y almacenamiento de resultados</li>
        <li>Panel administrativo para docentes y administradores</li>
        <li>Exportación de datos en formato CSV</li>
      </ul>

      <h3 style={h3Style}>3. Uso Aceptable</h3>
      <p style={pStyle}>El usuario se compromete a:</p>
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <li>Proporcionar información veraz y actualizada al registrarse</li>
        <li>No compartir credenciales de acceso con terceros</li>
        <li>No intentar manipular, copiar o alterar el contenido de las evaluaciones</li>
        <li>No realizar ingeniería inversa sobre el software</li>
        <li>Utilizar la Plataforma exclusivamente con fines educativos autorizados</li>
      </ul>

      <h3 style={h3Style}>4. Propiedad Intelectual</h3>
      <p style={pStyle}>
        Todo el contenido de la Plataforma, incluyendo pero no limitándose al código fuente,
        diseño, preguntas, textos y materiales educativos, están protegidos por derechos de autor
        y son propiedad exclusiva del desarrollador. Queda prohibida su reproducción total o
        parcial sin autorización expresa por escrito.
      </p>

      <h3 style={h3Style}>5. Integridad Académica</h3>
      <p style={pStyle}>
        Las evaluaciones incluyen medidas de aleatorización y control temporal para garantizar
        la integridad del proceso evaluativo. Cualquier intento de fraude o copia resultará en
        la invalidación de los resultados y posibles sanciones académicas según la normativa
        institucional aplicable.
      </p>

      <h3 style={h3Style}>6. Limitación de Responsabilidad</h3>
      <p style={pStyle}>
        La Plataforma se proporciona "tal cual". No garantizamos la disponibilidad ininterrumpida
        del servicio ni la ausencia de errores técnicos. En ningún caso seremos responsables
        por daños indirectos, incidentales o consecuentes derivados del uso de la Plataforma.
      </p>

      <h3 style={h3Style}>7. Modificaciones</h3>
      <p style={pStyle}>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
        serán efectivos al publicarse en la Plataforma. El uso continuado después de dichos
        cambios constituye su aceptación.
      </p>

      <h3 style={h3Style}>8. Contacto</h3>
      <p style={pStyle}>
        Para consultas sobre estos términos, puede contactarnos a:{" "}
        <strong style={{ color: "#4f46e5" }}>safecamgm@gmail.com</strong>
      </p>
    </>
  );
}

/* ── Contenido: Política de Privacidad ─────────────── */
function PrivacyContent() {
  const h3Style = { fontSize: 15, fontWeight: 800, color: "#0f172a", marginTop: 20, marginBottom: 8, fontFamily: "'Playfair Display',serif" };
  const pStyle = { marginBottom: 12 };

  return (
    <>
      <p style={{ ...pStyle, color: "#94a3b8", fontSize: 12 }}>
        Última actualización: Abril 2026
      </p>

      <h3 style={h3Style}>1. Información que Recopilamos</h3>
      <p style={pStyle}>
        Al utilizar la Plataforma, recopilamos la siguiente información personal proporcionada
        voluntariamente por el usuario:
      </p>
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <li><strong>Nombre completo</strong> — para identificación del evaluado</li>
        <li><strong>Correo electrónico</strong> — para contacto y registro</li>
        <li><strong>Institución educativa</strong> — para agrupación estadística</li>
        <li><strong>Municipio</strong> — para análisis geográfico de resultados</li>
        <li><strong>Respuestas y resultados</strong> — para evaluación académica</li>
      </ul>

      <h3 style={h3Style}>2. Uso de la Información</h3>
      <p style={pStyle}>La información recopilada se utiliza exclusivamente para:</p>
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <li>Registrar y calcular los resultados de la evaluación</li>
        <li>Generar estadísticas académicas para docentes y administradores</li>
        <li>Mejorar la calidad del servicio educativo</li>
        <li>Comunicación relacionada con la evaluación</li>
      </ul>

      <h3 style={h3Style}>3. Almacenamiento y Seguridad</h3>
      <p style={pStyle}>
        Los datos se almacenan en servidores seguros de <strong>Google Cloud (Firebase)</strong>
        con cifrado en tránsito y en reposo. Implementamos medidas de seguridad que incluyen:
      </p>
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <li>Cifrado de contraseñas mediante hash SHA-256</li>
        <li>Reglas de seguridad en la base de datos</li>
        <li>Control de acceso basado en roles (docente/administrador)</li>
      </ul>

      <h3 style={h3Style}>4. Compartir Información</h3>
      <p style={pStyle}>
        <strong>No vendemos, intercambiamos ni transferimos</strong> su información personal
        a terceros. Los datos solo son accesibles por los docentes y administradores autorizados
        dentro de la Plataforma para fines estrictamente académicos.
      </p>

      <h3 style={h3Style}>5. Retención de Datos</h3>
      <p style={pStyle}>
        Los datos de evaluaciones se conservan mientras sean necesarios para los fines
        académicos establecidos. Los administradores pueden exportar y eliminar registros
        según las necesidades institucionales.
      </p>

      <h3 style={h3Style}>6. Derechos del Usuario</h3>
      <p style={pStyle}>Usted tiene derecho a:</p>
      <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
        <li>Solicitar acceso a su información personal almacenada</li>
        <li>Solicitar la corrección de datos inexactos</li>
        <li>Solicitar la eliminación de sus datos personales</li>
      </ul>
      <p style={pStyle}>
        Para ejercer estos derechos, contacte al administrador de la Plataforma o envíe
        un correo a: <strong style={{ color: "#4f46e5" }}>safecamgm@gmail.com</strong>
      </p>

      <h3 style={h3Style}>7. Cookies y Almacenamiento Local</h3>
      <p style={pStyle}>
        La Plataforma utiliza almacenamiento local del navegador (localStorage) para guardar
        preferencias de interfaz (tema claro/oscuro) y medidas de seguridad anti-spam.
        No utilizamos cookies de rastreo ni publicidad.
      </p>

      <h3 style={h3Style}>8. Modificaciones</h3>
      <p style={pStyle}>
        Esta política puede actualizarse periódicamente. Cualquier cambio se reflejará en
        esta página con la fecha de actualización correspondiente.
      </p>
    </>
  );
}

/* ── Contenido: Más Información / Dudas ─────────────── */
function InfoContent() {
  const h3Style = { fontSize: 15, fontWeight: 800, color: "#0f172a", marginTop: 20, marginBottom: 8, fontFamily: "'Playfair Display',serif" };
  const pStyle = { marginBottom: 12 };

  return (
    <>
      <h3 style={{ ...h3Style, marginTop: 0 }}>Resolución de Dudas</h3>
      <p style={pStyle}>
        Si tienes algún problema técnico al ingresar tus datos, durante el examen, o si tienes alguna duda sobre las carreras disponibles en la Sede de Santa Eulalia, por favor comunícate con la secretaría para recibir asistencia:
      </p>

      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px", marginTop: 20, marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span>👩‍💼</span> Atención y Soporte
        </h4>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f46e5", fontSize: 16, flexShrink: 0 }}>
            📞
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Teléfono / WhatsApp</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>+502 4577 4961</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a", fontSize: 16, flexShrink: 0 }}>
            ✉️
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Correo Electrónico</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>secretariocunorocse@gmail.com</div>
          </div>
        </div>
      </div>

      <p style={{ ...pStyle, color: "#64748b", fontSize: 12, fontStyle: "italic" }}>
        * Si necesitas mayor orientación sobre tu carrera, puedes visitar la sede física en horarios hábiles.
      </p>
    </>
  );
}
