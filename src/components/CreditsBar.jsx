// src/components/CreditsBar.jsx
// Barra de créditos fija — branding Jz.Dev con enlace al portafolio

export default function CreditsBar() {
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
        <span className="credits-brand-label">Desarrollo web</span>
      </div>

      {/* Centro */}
      <div className="credits-center">
        <span className="credits-center-title">Evaluación de Lenguaje</span>
        <span className="credits-dot">•</span>
        <span style={{ color: "#64748b" }}>Español Latinoamericano</span>
      </div>

      {/* Enlace portafolio */}
      <a
        href="https://german210522.github.io/PersonalWeb2/index.html#home"
        target="_blank"
        rel="noopener noreferrer"
        className="credits-link"
      >
        Ver portafolio →
      </a>
    </div>
  );
}
