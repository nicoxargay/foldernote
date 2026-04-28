# 📒 FolderNote

App de notas con estética de carpeta escolar. Organizá tus apuntes en secciones y hojas, escribí con formato enriquecido o dibujá a mano, y personalizá los colores y la tipografía.

---

## Características

- **Secciones y hojas** — Creá múltiples secciones (materias, temas, etc.) cada una con sus propias hojas navegables.
- **Editor enriquecido** — Títulos, subtítulos, negrita, cursiva, subrayado, tachado, resaltado, color de texto y listas.
- **Modo dibujo** — Canvas con lápiz, borrador, 5 colores, control de grosor y limpieza. El dibujo se guarda por hoja.
- **Tipo de hoja** — Elegí rayado o cuadriculado para cada hoja individualmente.
- **Temas de color** — 5 temas de acento (naranja, azul, rojo, verde, violeta) en modo oscuro.
- **Fuentes manuscritas** — 5 tipografías simuladas a mano (Caveat, Patrick Hand, Indie Flower, Shadows Into Light, Kalam).
- **Tapa personalizada** — Portada con el nombre del usuario, editable.
- **Autenticación** — Registro e inicio de sesión con Supabase Auth.
- **Persistencia** — Las notas se guardan en Supabase. Las preferencias de tema y fuente se guardan en `localStorage`.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| React + Vite | Framework y bundler |
| Tailwind CSS v4 | Estilos utilitarios |
| Supabase | Auth y base de datos (PostgreSQL) |
| Canvas API | Modo dibujo con Pointer Events |
| @fontsource | Fuentes manuscritas self-hosted |

---

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/nicoxargay/foldernote.git
cd foldernote

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completar con las claves de tu proyecto Supabase

# 4. Iniciar en desarrollo
npm run dev
```

---

## Variables de entorno

Creá un archivo `.env` en la raíz con:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

---

## Base de datos (Supabase)

Ejecutá el siguiente SQL en el editor de Supabase para crear la tabla de notas:

```sql
create table notas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  seccion_id text not null,
  contenido text,
  updated_at timestamptz default now(),
  unique (user_id, seccion_id)
);

alter table notas enable row level security;

create policy "usuarios ven sus notas"
  on notas for all
  using (auth.uid() = user_id);
```

---

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

---

## Autor

**Nicolas Xargay** — [@nicoxargay](https://github.com/nicoxargay)
