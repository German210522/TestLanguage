// src/components/CreditsBar.jsx
// Barra de créditos fija — branding Jz.Dev con enlace al portafolio + términos legales

export default function CreditsBar({ onOpenTerms }) {
  return (
    <div className="credits-bar">
      {/* Marca */}
      <div className="credits-brand">
        <a
          href="https://german210522.github.io/PersonalWeb2/index.html#home"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <span className="credits-brand-logo">Jz.Dev</span>
        </a>
      </div>

      {/* Centro */}
      <div className="credits-center">
        <span className="credits-center-title">Evaluación de Lenguaje</span>
        <span className="credits-dot">•</span>
        <span style={{ color: "#64748b" }}>Español</span>
        <span className="credits-dot">•</span>
        <span style={{ color: "#94a3b8", fontSize: 10 }}>© 2026 Todos los derechos reservados</span>
        {onOpenTerms && (
          <>
            <span className="credits-dot">•</span>
            <button
              onClick={() => onOpenTerms("info")}
              style={{
                background: "none", border: "none", color: "#818cf8",
                fontSize: 11, cursor: "pointer", fontFamily: "'Lato',sans-serif",
                fontWeight: 600, padding: 0, textDecoration: "underline",
              }}
            >
              Más Información
            </button>
          </>
        )}
      </div>

    </div>
  );
}
