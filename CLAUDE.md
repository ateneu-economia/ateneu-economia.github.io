# Ateneu d’Economia (web estática)

Web bilingüe (castellano / valenciano) del **Ateneu d’Economia**, el proyecto
de Jordi Vila, profesor de Economía de secundaria, sobre investigación en
didáctica de la economía, propuestas de aula, materiales y datos.
Lema: «Aprender economía haciendo economía» / «Aprendre economia fent economia».
Logotipo: el nombre en Archivo Narrow con un tejado (el *oîkos*) y la barra roja.
Estética (23-11-2026, propuesta «casa de papel»): paleta cálida de papel (marfil
`#FAF5EB`, manila `#F1E6CF`, tinta `#27221D`, rojo `#C8412F` solo en grafismos y
`#A5301F` para texto). Portada: `src/components/Presentacion.astro` (lema y foto
con tejado sobre la barra roja) y banda «D’on ve el nom». Pie claro sobre manila.
Menú (23-11-2026): **Investigación** (didáctica `didactica`, Publicaciones,
Datos y código), **En el aula** (propuestas de aula `aula`, Materiales),
**Observatorio ↗** (la web del alumnado, `HERRAMIENTAS_URL`) y **Sobre mí**.
Intervención (opinión, coyuntura) y el Cuaderno sindical se retiraron el
23-11-2026: sus categorías siguen en el esquema, pero `CATEGORIAS_RETIRADAS`
(src/lib/sitio.ts) impide publicar sus artículos y no tienen páginas.
Antes (hasta el 23-11-2026) la web era «Econplebs», anónima y de economía
política; la dirección provisional y el repositorio conservan ese nombre.

## Reglas

- **Autoría.** La web y los artículos los firma Jordi Vila (`AUTOR` en
  src/configuracion.mjs); la marca es `MARCA`. El anonimato se levantó el
  23-11-2026 por decisión del autor. Ningún otro dato personal (dirección,
  teléfono, centro de trabajo, alumnado) aparece en la web.
- **Sin terceros.** Nada de Google Fonts, analítica, CDN ni incrustados. Las
  fuentes van en el propio proyecto.
- **Web de herramientas del alumnado (Observatorio).** La web la enlaza con
  «Observatorio ↗» mediante `HERRAMIENTAS_URL` (decisión del autor, 31-10-2026,
  que deja sin efecto la regla de no enlazarlas). Vaciar esa variable quita el enlace.
- **Imágenes solo del banco**, con crédito y enlace a la ficha. Fotos en gris;
  obras y carteles en color (ya adaptado a la paleta).
- **Diseño (antes, estética industrial del tema 4.0, W-19; colores sustituidos el 23-11-2026 por la paleta cálida de arriba):** hormigón `#E6E7E3`,
  esmalte `#EFEFEC`, grafito `#1F2224` / `#16181A`, rojo `#C8412F` solo como
  acento (texto en rojo `#B03826` y gris `#5F6361` por contraste AA).
  Archivo Narrow en mayúsculas (titulares), Source Serif 4 (lectura),
  IBM Plex Mono (rótulos), IBM Plex Sans (interfaz). Sin sombras ni esquinas
  redondeadas. Movimiento breve y nulo con `prefers-reduced-motion`.
- **Accesibilidad** WCAG 2.1 AA.
- **El autor no programa.** Explica en castellano sencillo; cualquier cambio de
  contenido debe poder hacerse editando Markdown. Los textos de la interfaz
  van siempre en los dos idiomas.
- **Contenido de muestra:** los artículos con `sample: true` son de prueba y
  no se publican en producción sin que el autor lo diga.

## Publicar

El espacio `Web-personal/` del vault de Obsidian se eliminó el 23-11-2026.
Hasta que el autor decida dónde escribe los textos, se los pasa a Claude (o
los deja en `contenido/`), y Claude comprueba el frontmatter, genera, revisa y
prepara el cambio. Procedimiento técnico: `docs/PUBLICAR.md` (scripts
`npm run publicar` y `npm run comprobar`).

## Antes de dar algo por terminado

- Generar la web y abrir las páginas tocadas en escritorio y móvil.
- Comprobar que no hay peticiones a otros dominios.

## Estructura del proyecto

- `contenido/`: todo lo que se edita a mano (Markdown). Artículos y páginas en
  `es/` y `ca/`; `publicaciones/`, `recursos/` y `agenda/` llevan un `_LEEME.md`
  con la plantilla. Publicaciones y Agenda no se muestran mientras estén vacías.
- `src/configuracion.mjs`: único archivo de ajustes (correo público,
  `HERRAMIENTAS_URL`, mostrar muestras).
- `src/lib/sitio.ts`: textos de la interfaz en los dos idiomas y direcciones.
- `src/pages/[...ruta].astro` genera todas las páginas; las plantillas están en
  `src/vistas/` y las piezas en `src/components/`.
- Generar: `npm run build` (Astro + índice del buscador Pagefind en `dist/`).
  Node está en `~/.local/node/bin` (añadirlo al PATH).
