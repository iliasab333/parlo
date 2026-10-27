#!/usr/bin/env node
/**
 * Generates every app icon from the one mark defined below.
 *
 * Run it after changing the mark or the accent colour:
 *   node scripts/icons.mjs
 *
 * The outputs are committed, so a deploy never depends on this script
 * or on sharp — which is only here because Next.js hoists it, and is
 * not a declared dependency of ours.
 *
 * The mark is two speech bubbles knocked out of a solid accent plate.
 * It was picked over the alternatives by rendering each at 16px and
 * looking: a dark plate disappears against dark browser chrome, and a
 * transparent one loses its lighter bubble on a light background. A
 * solid accent block survives both, which is what a favicon has to do.
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WEB = join(ROOT, "apps/web");

/** Must track --color-accent and --color-ink-950 in app/globals.css. */
const ACCENT = "#34d399";
const INK = "#0b0f14";

/** Rounded-rect speech bubble with a tail, as a single path. */
function bubble(w, h, r, tail) {
  const body =
    `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r}` +
    ` A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r}` +
    ` V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  // Both tails must wind the same way round as the body. The body is
  // clockwise, and a counter-clockwise tail cancels against it under
  // fill-rule nonzero — which punches a hole through the overlap
  // instead of merging the two, and slices the tail off the bubble.
  const tails = {
    bl: `M ${r * 2.3} ${h - 2} L ${r * 0.1} ${h + r * 1.2} L ${r * 0.6} ${h - 2} Z`,
    br: `M ${w - r * 0.6} ${h - 2} L ${w - r * 0.1} ${h + r * 1.2} L ${w - r * 2.3} ${h - 2} Z`,
  };
  return `${body} ${tails[tail]}`;
}

const BACK = [8, 10, 32, 22, 7, "bl"];
const FRONT = [24, 25, 32, 22, 7, "br"];

/**
 * @param rx    plate corner radius; 0 for full-bleed (iOS and Android
 *              apply their own mask and would otherwise round twice).
 * @param scale bubble group scale about the centre, to pull the mark
 *              inside a mask's safe zone.
 */
function mark({ rx = 15, scale = 1 } = {}) {
  const at = ([x, y, w, h, r, tail], attrs) =>
    `<g transform="translate(${x},${y})"><path d="${bubble(w, h, r, tail)}" ${attrs}/></g>`;
  // The front bubble is stroked in the plate colour first, so a gap
  // separates it from the one behind instead of the two merging into
  // one blob at small sizes.
  const group =
    at(BACK, `fill="${INK}"`) +
    at(FRONT, `fill="${ACCENT}" stroke="${ACCENT}" stroke-width="6" stroke-linejoin="round"`) +
    at(FRONT, `fill="${INK}"`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">` +
    `<rect width="64" height="64" rx="${rx}" fill="${ACCENT}"/>` +
    `<g transform="translate(32,32) scale(${scale}) translate(-32,-32)">${group}</g>` +
    `</svg>`;
}

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/**
 * ICO containing uncompressed 32-bit BMPs. PNG-in-ICO is smaller but
 * only the BMP form is universally understood, and this file exists
 * precisely to serve the browsers that ignore icon.svg.
 */
async function ico(svg, sizes) {
  const images = await Promise.all(sizes.map(async (size) => {
    const { data } = await sharp(Buffer.from(svg))
      .resize(size, size).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    const header = Buffer.alloc(40);
    header.writeUInt32LE(40, 0);
    header.writeInt32LE(size, 4);
    header.writeInt32LE(size * 2, 8); // XOR bitmap plus the AND mask.
    header.writeUInt16LE(1, 12);
    header.writeUInt16LE(32, 14);

    // BMP rows run bottom-up, and the channel order is BGRA.
    const xor = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const src = (y * size + x) * 4;
        const dst = ((size - 1 - y) * size + x) * 4;
        xor[dst] = data[src + 2];
        xor[dst + 1] = data[src + 1];
        xor[dst + 2] = data[src];
        xor[dst + 3] = data[src + 3];
      }
    }
    // Alpha already carries transparency, but the 1bpp mask is still
    // part of the format and its rows pad to 4 bytes.
    const maskRow = Math.ceil(size / 32) * 4;
    return { size, data: Buffer.concat([header, xor, Buffer.alloc(maskRow * size)]) };
  }));

  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map((img) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(img.size === 256 ? 0 : img.size, 0);
    e.writeUInt8(img.size === 256 ? 0 : img.size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(img.data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += img.data.length;
    return e;
  });

  return Buffer.concat([dir, ...entries, ...images.map((i) => i.data)]);
}

const write = (rel, buf) => {
  const path = join(WEB, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buf);
  console.log(`  ${rel}  ${(buf.length / 1024).toFixed(1)} kB`);
};

const rounded = mark();

console.log("icons");
// Served to anything modern; scales to any size the browser asks for.
write("app/icon.svg", Buffer.from(rounded));
write("app/favicon.ico", await ico(rounded, [16, 32, 48]));
// iOS ignores both the manifest and SVG icons, and masks the corners
// itself — so this one is full-bleed with the mark pulled in.
write("app/apple-icon.png", await png(mark({ rx: 0, scale: 0.9 }), 180));
write("public/icon-192.png", await png(rounded, 192));
write("public/icon-512.png", await png(rounded, 512));
// Android crops to a circle inscribed in the centre 80%.
write("public/icon-maskable-512.png", await png(mark({ rx: 0, scale: 0.72 }), 512));
