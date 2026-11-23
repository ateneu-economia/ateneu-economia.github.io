// Cómo citar un artículo: texto (estilo APA), BibTeX y RIS (Zotero, Mendeley).
// Autoría: AUTOR (configuracion.mjs); publicación: MARCA. Las direcciones usan SITIO.
import { SITIO, AUTOR_APA, AUTOR_BIB, MARCA } from "../configuracion.mjs";
import { rutaArticulo, fechaISO, type Articulo } from "./sitio";

const MESES = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  ca: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
};
const MESES_BIB = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

export const urlArticulo = (a: Articulo) => new URL(rutaArticulo(a), SITIO).href;

// Nombre de los archivos de cita: /citas/<idioma>-<slug>.bib y .ris
export const rutaCita = (a: Articulo, ext: "bib" | "ris") => `/citas/${a.data.lang}-${a.data.slug}.${ext}`;

// Cita en texto: «Vila, J. (2026, 20 de septiembre). Título. Ateneu d’Economia. https://…»
export function citaTexto(a: Articulo): string {
  const d = a.data.date;
  const dia = `${d.getUTCDate()} de ${MESES[a.data.lang][d.getUTCMonth()]}`;
  // Si el título ya acaba en signo de puntuación, no se añade punto
  const titulo = /[.?!…]$/.test(a.data.title) ? a.data.title : `${a.data.title}.`;
  return `${AUTOR_APA} (${d.getUTCFullYear()}, ${dia}). ${titulo} ${MARCA}. ${urlArticulo(a)}`;
}

// Clave BibTeX: apellido + año + primera palabra larga del slug
export function claveBib(a: Articulo): string {
  const palabra = a.data.slug.split("-").find((p) => p.length > 3) ?? a.data.slug.split("-")[0];
  return `${AUTOR_BIB.split(",")[0].toLowerCase()}${a.data.date.getUTCFullYear()}${palabra}`;
}

const escBib = (s: string) => s.replace(/([&%#_$])/g, "\\$1");

export function citaBib(a: Articulo): string {
  const d = a.data.date;
  const url = urlArticulo(a);
  return `@misc{${claveBib(a)},
  author       = {${AUTOR_BIB}},
  title        = {{${escBib(a.data.title)}}},
  year         = {${d.getUTCFullYear()}},
  month        = ${MESES_BIB[d.getUTCMonth()]},
  date         = {${fechaISO(d)}},
  howpublished = {\\url{${url}}},
  url          = {${url}},
  note         = {${MARCA}},
  language     = {${a.data.lang === "es" ? "spanish" : "catalan"}},
  abstract     = {${escBib(a.data.excerpt)}}
}
`;
}

export function citaRis(a: Articulo): string {
  const d = a.data.date;
  const lineas = [
    "TY  - BLOG",
    `AU  - ${AUTOR_BIB}`,
    `TI  - ${a.data.title}`,
    `PY  - ${d.getUTCFullYear()}`,
    `DA  - ${fechaISO(d).replaceAll("-", "/")}`,
    `T2  - ${MARCA}`,
    `UR  - ${urlArticulo(a)}`,
    `LA  - ${a.data.lang}`,
    ...(a.data.excerpt ? [`AB  - ${a.data.excerpt}`] : []),
    ...a.data.tags.map((t) => `KW  - ${t}`),
    "ER  - ",
  ];
  return lineas.join("\r\n") + "\r\n";
}
