// Tarjeta para compartir (1200×630, la que muestran WhatsApp, Telegram, Mastodon o el correo):
// fondo de papel, el título en Archivo Narrow, la foto con tejado sobre la barra roja y la marca, como la portada.
// Se genera al crear la web; no hace ninguna petición a otros dominios.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import satori from "satori";
import { decompress } from "wawoff2";
import type { Imagen } from "./sitio";
import { MARCA } from "../configuracion.mjs";

const raiz = process.cwd();
const ANCHO = 1200, ALTO = 630;

let fuentes: { name: string; data: ArrayBuffer; weight: 500 | 700; style: "normal" }[] | undefined;
async function cargarFuentes() {
  if (fuentes) return fuentes;
  const ttf = async (archivo: string) => {
    const datos = await decompress(fs.readFileSync(path.join(raiz, "public/fuentes", archivo)));
    return datos.buffer.slice(datos.byteOffset, datos.byteOffset + datos.byteLength) as ArrayBuffer;
  };
  fuentes = [
    { name: "Archivo Narrow", data: await ttf("archivo-narrow-latin-700-normal.woff2"), weight: 700, style: "normal" },
    { name: "IBM Plex Mono", data: await ttf("ibm-plex-mono-latin-500-normal.woff2"), weight: 500, style: "normal" },
  ];
  return fuentes;
}

// La foto, en gris y con tono de papel, recortada con tejado a dos aguas (como la portada)
const FOTO_W = 520, FOTO_H = 450;
async function fotoDatos(img: Imagen): Promise<string> {
  let tubo = sharp(path.join(raiz, "imagenes", img.file));
  const r = (img as Imagen & { recorte?: { izq: number; arr: number } }).recorte;
  if (r) tubo = sharp(await tubo.extract({ left: r.izq, top: r.arr, width: img.width, height: img.height }).toBuffer());
  if (!img.color) tubo = tubo.grayscale().linear(1.04, 6).tint({ r: 244, g: 234, b: 214 });
  const base = await tubo.resize({ width: FOTO_W, height: FOTO_H, fit: "cover", position: "top" }).png().toBuffer();
  const tejado = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${FOTO_W}" height="${FOTO_H}">
       <polygon points="0,${FOTO_H * 0.15} ${FOTO_W / 2},0 ${FOTO_W},${FOTO_H * 0.15} ${FOTO_W},${FOTO_H} 0,${FOTO_H}" fill="#fff"/>
     </svg>`,
  );
  const png = await sharp(base).composite([{ input: tejado, blend: "dest-in" }]).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

// El icono del logotipo: tejado sobre la barra roja
const icono = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
     <polyline points="8,62 50,24 92,62" fill="none" stroke="#27221D" stroke-width="11" stroke-linejoin="miter"/>
     <rect x="8" y="74" width="84" height="12" fill="#C8412F"/>
   </svg>`,
).toString("base64")}`;

const caja = (style: Record<string, unknown>, children?: unknown) => ({ type: "div", props: { style: { display: "flex", ...style }, children } });

// Paleta «casa de papel»: fondo marfil, tinta cálida, rojo solo en grafismos
export async function tarjetaJpg(opciones: { rotulo: string; titulo: string; img: Imagen }): Promise<Buffer> {
  const { rotulo, titulo, img } = opciones;
  const tam = titulo.length > 80 ? 44 : titulo.length > 55 ? 52 : 62;
  const arbol = caja({ position: "relative", width: ANCHO, height: ALTO, background: "#FAF5EB" }, [
    { type: "img", props: { src: await fotoDatos(img), width: FOTO_W, height: FOTO_H, style: { position: "absolute", left: 616, top: 48, width: FOTO_W, height: FOTO_H } } },
    caja({ position: "absolute", left: 616, top: 48 + FOTO_H + 12, width: FOTO_W, height: 16, background: "#C8412F" }),
    caja({ position: "absolute", left: 64, top: 64, width: 500, height: ALTO - 128, flexDirection: "column", justifyContent: "space-between" }, [
      caja({ flexDirection: "column" }, [
        caja({ fontFamily: "IBM Plex Mono", fontWeight: 500, fontSize: 20, letterSpacing: 3, color: "#A5301F", textTransform: "uppercase" }, rotulo),
        caja({ marginTop: 22, fontFamily: "Archivo Narrow", fontWeight: 700, fontSize: tam, lineHeight: 0.98, color: "#27221D", textTransform: "uppercase" }, titulo),
      ]),
      caja({ alignItems: "center" }, [
        { type: "img", props: { src: icono, width: 52, height: 52, style: { width: 52, height: 52, marginRight: 14 } } },
        caja({ fontFamily: "Archivo Narrow", fontWeight: 700, fontSize: 38, color: "#27221D", textTransform: "uppercase" }, MARCA),
      ]),
    ]),
  ]);
  const svg = await satori(arbol as never, { width: ANCHO, height: ALTO, fonts: await cargarFuentes() });
  return sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
}
