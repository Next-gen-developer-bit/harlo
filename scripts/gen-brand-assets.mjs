// Processes the official Harlo Social logo files (public/brand/harlo-mark-dark.png
// and harlo-mark-light.png — full horizontal lockups, transparent background)
// into every derived asset the site needs: trimmed lockups, an icon-only crop,
// favicon/app-icon sizes, and the OG/Twitter share image.
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const brandDir = path.join(publicDir, "brand");
const appDir = path.join(root, "src", "app");

async function pngBuffer(sharpInstance, size) {
  return sharpInstance.resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

// Minimal valid "PNG-in-ICO" writer (supported since Windows Vista / all modern browsers).
function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * count;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const imageBuffers = [];
  for (const buf of pngBuffers) {
    const size = buf.__size >= 256 ? 0 : buf.__size;
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buf.length;
    dirEntries.push(entry);
    imageBuffers.push(buf);
  }
  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

async function main() {
  mkdirSync(publicDir, { recursive: true });

  // 1. Trim transparent padding off both official lockups.
  const darkTrimmed = await sharp(path.join(brandDir, "harlo-mark-dark.png")).trim().toBuffer({ resolveWithObject: true });
  const lightTrimmed = await sharp(path.join(brandDir, "harlo-mark-light.png")).trim().toBuffer({ resolveWithObject: true });

  writeFileSync(path.join(brandDir, "harlo-lockup-dark.png"), darkTrimmed.data);
  writeFileSync(path.join(brandDir, "harlo-lockup-light.png"), lightTrimmed.data);

  // 2. Icon-only crop — the mark is square and sits flush at the left edge
  // of each trimmed lockup, so cropping a (height x height) square off the
  // left isolates it cleanly. Sized independently per variant in case the
  // two source files weren't trimmed to identical dimensions.
  const darkIconBuf = await sharp(darkTrimmed.data)
    .extract({ left: 0, top: 0, width: darkTrimmed.info.height, height: darkTrimmed.info.height })
    .toBuffer();
  const lightIconBuf = await sharp(lightTrimmed.data)
    .extract({ left: 0, top: 0, width: lightTrimmed.info.height, height: lightTrimmed.info.height })
    .toBuffer();
  writeFileSync(path.join(brandDir, "harlo-icon-dark.png"), darkIconBuf);
  writeFileSync(path.join(brandDir, "harlo-icon-light.png"), lightIconBuf);

  // 2b. "Icon + Harlo" crop (no SOCIAL line) for compact placements like the
  // nav, where the full lockup's second line renders too small to read.
  // The wordmark starts at x=491 in both source files; SOCIAL sits below a
  // low-alpha gap around y=281–320, so cropping to y:0–295 and trimming
  // isolates just "Harlo" before recompositing it against the full-height icon.
  async function buildIconHarlo(trimmedBuf, iconBuf, iconSize) {
    const meta = await sharp(trimmedBuf).metadata();
    const harloOnly = await sharp(trimmedBuf)
      .extract({ left: 491, top: 0, width: meta.width - 491, height: 295 })
      .trim()
      .toBuffer({ resolveWithObject: true });
    const gap = 40;
    const vOffset = Math.round((iconSize - harloOnly.info.height) / 2);
    return sharp({
      create: { width: iconSize + gap + harloOnly.info.width, height: iconSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([
        { input: iconBuf, left: 0, top: 0 },
        { input: harloOnly.data, left: iconSize + gap, top: vOffset },
      ])
      .png()
      .toBuffer();
  }

  writeFileSync(
    path.join(brandDir, "harlo-icon-wordmark-dark.png"),
    await buildIconHarlo(darkTrimmed.data, darkIconBuf, darkTrimmed.info.height)
  );
  writeFileSync(
    path.join(brandDir, "harlo-icon-wordmark-light.png"),
    await buildIconHarlo(lightTrimmed.data, lightIconBuf, lightTrimmed.info.height)
  );

  // 3. Favicon (16/32/48) + Next.js icon conventions, from the dark
  // (black-circle) mark — reads clearly against typical light browser chrome.
  const icoSizes = [16, 32, 48];
  const icoPngs = [];
  for (const s of icoSizes) {
    const buf = await pngBuffer(sharp(darkIconBuf), s);
    buf.__size = s;
    icoPngs.push(buf);
  }
  writeFileSync(path.join(appDir, "favicon.ico"), buildIco(icoPngs));
  writeFileSync(path.join(appDir, "icon.png"), await pngBuffer(sharp(darkIconBuf), 512));
  writeFileSync(path.join(appDir, "apple-icon.png"), await pngBuffer(sharp(darkIconBuf).flatten({ background: "#FFFFFF" }), 180));

  // 4. Organization schema logo — full horizontal lockup, dark-on-transparent.
  const logoLockup = await sharp(darkTrimmed.data).resize({ width: 800 }).png().toBuffer();
  writeFileSync(path.join(publicDir, "harlo-logo.png"), logoLockup);

  // 5. Open Graph / Twitter share image — black background, white lockup centred.
  const ogW = 1200, ogH = 630;
  const lockupTargetW = 640;
  const lockupResized = await sharp(lightTrimmed.data).resize({ width: lockupTargetW }).png().toBuffer();
  const lockupMeta = await sharp(lockupResized).metadata();

  const ogTagSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ogW}" height="60">
    <text x="${ogW / 2}" y="30" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.55)">Social media management, without the mess.</text>
  </svg>`;
  const ogTagBuf = await sharp(Buffer.from(ogTagSvg)).png().toBuffer();

  const ogFinal = await sharp({ create: { width: ogW, height: ogH, channels: 3, background: "#0B0B0D" } })
    .composite([
      { input: lockupResized, left: Math.round((ogW - lockupMeta.width) / 2), top: Math.round((ogH - lockupMeta.height) / 2) - 30 },
      { input: ogTagBuf, left: 0, top: Math.round((ogH - lockupMeta.height) / 2) + lockupMeta.height + 10 },
    ])
    .png()
    .toBuffer();

  writeFileSync(path.join(appDir, "opengraph-image.png"), ogFinal);
  writeFileSync(path.join(appDir, "twitter-image.png"), ogFinal);

  console.log("Brand assets generated from official artwork:");
  console.log(" - public/brand/harlo-lockup-{dark,light}.png (trimmed full lockups, incl. SOCIAL)");
  console.log(" - public/brand/harlo-icon-{dark,light}.png (icon-only crops)");
  console.log(" - public/brand/harlo-icon-wordmark-{dark,light}.png (icon + Harlo, no SOCIAL — for compact placements)");
  console.log(" - src/app/favicon.ico, icon.png, apple-icon.png");
  console.log(" - public/harlo-logo.png (JSON-LD)");
  console.log(" - src/app/opengraph-image.png, twitter-image.png");
}

main();
