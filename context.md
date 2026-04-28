# FolderNote — Contexto del Proyecto

## ¿Qué es?
FolderNote es una app web para tomar apuntes con estética de carpeta/cuaderno real.
Simula una carpeta física con hojas rayadas o cuadriculadas, dividida en secciones
personalizables (materias, temas, proyectos, lo que sea). Es más visual y creativa
que un Word o Notion, y más accesible que GoodNotes (no requiere iPad ni stylus).

## Problema que resuelve
Las apps de notas existentes son o muy complejas (Notion) o dependen de hardware
caro (iPad + Apple Pencil). FolderNote ofrece la experiencia visual de un cuaderno
real desde cualquier navegador, con teclado o mouse/stylus.

## Usuario objetivo
Estudiantes y cualquier persona que quiera tomar apuntes de forma organizada y
con una experiencia más cercana al papel que a un editor de texto.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Estilos | TailwindCSS |
| Dibujo a mano | Canvas API (nativa del browser) |
| Auth + Base de datos | Supabase |
| Deploy | Vercel |

---

## Funcionalidades del MVP

### ✅ Incluidas
- Crear una carpeta con nombre personalizado
- Dividir la carpeta en secciones (agregar, renombrar, reordenar)
- Navegación por pestañas entre secciones
- Hojas con fondo rayado o cuadriculado (elegible por sección)
- Escritura con teclado sobre la hoja
- Escritura/dibujo a mano con mouse o stylus (Canvas API)
- Registro e inicio de sesión con email y contraseña (Supabase Auth)
- Guardado automático en la nube (Supabase Database)

### ❌ Fuera del MVP (para versiones futuras)
- Imágenes y adjuntos
- Colaboración en tiempo real
- Exportar a PDF
- App mobile
- Múltiples carpetas
- Búsqueda dentro de las notas
- Temas visuales avanzados

---

## Estructura de carpetas del proyecto

```
foldernote/
├── public/
├── src/
│   ├── components/
│   │   ├── Folder/         # Carpeta principal con sus pestañas
│   │   ├── Section/        # Una sección/materia individual
│   │   ├── Sheet/          # La hoja (rayada o cuadriculada)
│   │   ├── Canvas/         # Dibujo a mano libre
│   │   └── Auth/           # Login y registro
│   ├── hooks/              # Custom hooks de React
│   ├── lib/
│   │   └── supabase.js     # Cliente de Supabase
│   ├── pages/              # Vistas principales
│   ├── App.jsx
│   └── main.jsx
├── .env                    # Variables de entorno (Supabase keys)
├── CONTEXT.md              # Este archivo
└── package.json
```

---

## Decisiones ya tomadas (no cambiar sin discutir)
- El dibujo usa Canvas API nativa, sin librerías externas de dibujo
- El backend es Supabase solamente — no hay servidor propio
- El frontend se deployea en Vercel
- No hay SSR — es una SPA (Single Page Application)
- Primero web, mobile viene después

---

## Cómo trabajar con este proyecto

**Regla principal:** construir de a un feature a la vez. Cada prompt resuelve
una sola cosa. Antes de seguir al próximo, el código generado debe entenderse.

**Orden sugerido de desarrollo:**
1. Setup inicial (Vite + React + Tailwind)
2. Estructura de carpetas y componentes vacíos
3. UI de la carpeta con pestañas de secciones
4. Hoja con fondo rayado/cuadriculado
5. Escritura con teclado sobre la hoja
6. Canvas para dibujo a mano
7. Supabase Auth (registro + login)
8. Guardado de notas en Supabase
9. Carga de notas al iniciar sesión
10. Pulido visual y detalles de UX

---

## Notas para el agente (Claude Code)
- Siempre explicá brevemente qué hace cada archivo o función que creás
- Si tomás una decisión de arquitectura, comentala en el código
- Usá comentarios en español para que el dueño del proyecto entienda
- Ante la duda, preguntá antes de implementar algo grande