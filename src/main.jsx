// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Purgado agresivo de Service Workers y cachés antiguos para forzar la sincronización
if ('caches' in window) {
  caches.keys().then((names) => {
    names.forEach(name => caches.delete(name));
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
