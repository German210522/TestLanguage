# 📝 Evaluación de Lenguaje — Español Latinoamericano

Aplicación web de evaluación académica con panel administrativo, gráficas y gestión de usuarios.  
**Stack:** React 18 + Vite + Recharts · **Deploy gratuito:** Vercel

---

## 🗂 Estructura del Proyecto

```
evaluacion-lenguaje/
├── index.html                  ← Entrada HTML
├── vite.config.js              ← Configuración de Vite
├── vercel.json                 ← Rutas SPA para Vercel
├── package.json
└── src/
    ├── main.jsx                ← Bootstrap de React
    ├── App.jsx                 ← Componente raíz (orquesta fases)
    ├── data/
    │   └── questions.js        ← 50 preguntas + constantes
    ├── utils/
    │   ├── grading.js          ← Calificación, feedback, validación
    │   ├── storage.js          ← Abstracción de persistencia (usuarios + resultados)
    │   └── exportCsv.js        ← Exportación de resultados a CSV
    ├── hooks/
    │   └── useQuiz.js          ← Lógica completa del cuestionario (hook)
    ├── styles/
    │   └── globals.css         ← Estilos globales, animaciones, credits bar
    └── components/
        ├── App.jsx             ← (ver src/App.jsx)
        ├── CreditsBar.jsx      ← Barra de créditos fija (siempre visible)
        ├── TimerRing.jsx       ← Anillo SVG animado de temporizador
        ├── AuthModal.jsx       ← Modal de login para docentes/admin
        ├── LandingView.jsx     ← Pantalla de inicio + formulario estudiante
        ├── QuizView.jsx        ← Pantalla de cuestionario
        ├── ResultsView.jsx     ← Pantalla de resultados
        └── Dashboard.jsx       ← Panel admin (resumen, estudiantes, usuarios)
```

---

## 🚀 Cómo subir a internet GRATIS (Vercel)

### PASO 1 — Requisitos previos (instalar una sola vez)

1. Instalar **Node.js 18+**: https://nodejs.org
2. Instalar **Git**: https://git-scm.com
3. Crear cuenta gratuita en **GitHub**: https://github.com
4. Crear cuenta gratuita en **Vercel**: https://vercel.com (puedes entrar con tu cuenta de GitHub)

---

### PASO 2 — Preparar el proyecto localmente

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Instalar dependencias
npm install

# Probar en local (opcional, para verificar que todo funciona)
npm run dev
# → Abre http://localhost:5173 en tu navegador
```

---

### PASO 3 — Subir a GitHub

```bash
# Inicializar repositorio Git
git init
git add .
git commit -m "feat: evaluación de lenguaje v1.0"

# Crear repositorio en GitHub (hazlo en github.com → New repository)
# Luego conecta y sube:
git remote add origin https://github.com/TU_USUARIO/evaluacion-lenguaje.git
git branch -M main
git push -u origin main
```

---

### PASO 4 — Deploy en Vercel (5 minutos, gratis)

1. Entra a https://vercel.com e inicia sesión con GitHub
2. Clic en **"Add New Project"**
3. Selecciona tu repositorio `evaluacion-lenguaje`
4. Vercel detecta automáticamente que es un proyecto **Vite/React**
5. Deja todo por defecto y clic en **"Deploy"**
6. En ~2 minutos tendrás tu URL pública: `https://evaluacion-lenguaje.vercel.app`

> ✅ Vercel redeployará automáticamente cada vez que hagas `git push`

---

## 👤 Acceso al panel administrativo

| Campo    | Valor       |
|----------|-------------|
| Usuario  | `admin`     |
| Password | `Admin2025!`|

> ⚠️ **Cambia la contraseña por defecto** después del primer acceso creando un nuevo usuario admin y eliminando el por defecto.

---

## 📦 Sobre la persistencia de datos

La aplicación usa `window.storage` (API de persistencia de Claude.ai).  
**Para producción real con usuarios reales**, reemplaza las funciones en `src/utils/storage.js` por:

- **Firebase Firestore** (gratis hasta ciertos límites) — recomendado para empezar
- **Supabase** (PostgreSQL gratuito) — si prefieres SQL
- **PocketBase** (self-hosted gratuito)

El archivo `storage.js` está diseñado como una capa de abstracción: solo necesitas reemplazar las funciones `get()` y `set()` internas por llamadas a tu backend preferido.

---

## ✏️ Personalizar créditos

Edita `src/components/CreditsBar.jsx` y reemplaza:
- `href="https://github.com/tu-usuario"` → tu GitHub real
- `href="https://tu-portafolio.dev"` → tu portafolio real
- El texto `Tu Nombre / Portafolio` → tu nombre real

---

## 🎨 Tecnologías usadas

- **React 18** — UI reactiva
- **Vite 5** — Bundler ultrarrápido
- **Recharts** — Gráficas de barras y pastel
- **Google Fonts** — Playfair Display + Lato
- **Vercel** — Hosting gratuito con CDN global

---

## 📄 Licencia

MIT — Libre para uso educativo y personal.
