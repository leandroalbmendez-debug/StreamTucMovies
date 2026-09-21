# StreamTUC

Catálogo de películas y series desarrollado como proyecto académico grupal. Incluye autenticación, catálogo público con datos de TMDB, sistema de comentarios, favoritos, panel de administración (usuarios, comentarios y películas personalizadas) y planes Free/Premium.

## Stack

React + TypeScript + Vite, react-bootstrap, pnpm.

## Cómo correrlo

1. `pnpm install`
2. Crear un archivo `.env` en la raíz con tu propia API key de [TMDB](https://www.themoviedb.org/settings/api): VITE_API_KEY = "tu-api-key-de-tmdb"
3. `pnpm dev`

Si el catálogo no carga ninguna película, lo más probable es que falte el `.env` o que la `VITE_API_KEY` sea inválida/esté vencida — cada persona del equipo necesita su propia key de TMDB, no se comparte una sola.

## Scripts

- `pnpm dev` — entorno de desarrollo
- `pnpm build` — build de producción
- `pnpm preview` — previsualizar el build
- `pnpm exec tsc -b` — chequeo de tipos

## Equipo

Franco David Ruiz Pastorino, Lucas Lencina, Leandro Mendez.