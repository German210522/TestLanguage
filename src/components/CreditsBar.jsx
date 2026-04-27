// src/components/CreditsBar.jsx
// Barra de créditos fija — branding Jz.Dev con enlace al portafolio + términos legales

export default function CreditsBar() {
  return (
    <div className="credits-bar" style={{ justifyContent: "center" }}>
      {/* Centro */}
      <div className="credits-center" style={{ position: "static", transform: "none" }}>
        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>© 2026 Todos los derechos reservados</span>
        
        <span className="credits-dot" style={{ margin: "0 8px", opacity: 0.5 }}>•</span>

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
      </div>
    </div>
  );
}
