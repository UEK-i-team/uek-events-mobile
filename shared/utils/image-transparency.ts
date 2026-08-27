const HEADER_FETCH_TIMEOUT_MS = 4000;
const HEADER_BYTE_RANGE = "bytes=0-1023";

const alphaCache = new Map<string, Promise<boolean>>();

function isJpegUrl(url: string): boolean {
  return /\.jpe?g($|\?)/i.test(url);
}

function isLikelyTransparentByExtension(url: string): boolean {
  if (isJpegUrl(url)) return false;
  return /\.(png|webp|gif|svg)($|\?)/i.test(url);
}

function isPngSignature(buf: Uint8Array): boolean {
  return (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  );
}

function isJpegSignature(buf: Uint8Array): boolean {
  return buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8;
}

function bufferContainsAscii(buf: Uint8Array, text: string): boolean {
  const target = text.split("").map((char) => char.charCodeAt(0));

  if (buf.length < target.length) return false;

  for (let i = 0; i <= buf.length - target.length; i += 1) {
    let matches = true;

    for (let j = 0; j < target.length; j += 1) {
      if (buf[i + j] !== target[j]) {
        matches = false;
        break;
      }
    }

    if (matches) return true;
  }

  return false;
}

function parsePngHasAlpha(buf: Uint8Array): boolean {
  if (!isPngSignature(buf) || buf.length < 26) return false;

  const colorType = buf[25];

  if (colorType === 4 || colorType === 6) return true;
  if (colorType === 3) return bufferContainsAscii(buf, "tRNS");

  return false;
}

function parseWebpHasAlpha(buf: Uint8Array): boolean {
  if (buf.length < 21) return false;

  const isRiff =
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46;
  const isWebp =
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50;

  if (!isRiff || !isWebp) return false;

  const chunkType =
    String.fromCharCode(buf[12], buf[13], buf[14], buf[15]);

  if (chunkType !== "VP8X" || buf.length < 21) return false;

  return (buf[20] & 0x10) !== 0;
}

function parseHeaderHasAlpha(buf: Uint8Array): boolean {
  if (isJpegSignature(buf)) return false;
  if (parsePngHasAlpha(buf)) return true;
  if (parseWebpHasAlpha(buf)) return true;

  return false;
}

async function fetchImageHeader(url: string): Promise<Uint8Array> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HEADER_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { Range: HEADER_BYTE_RANGE },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image header: ${response.status}`);
    }

    return new Uint8Array(await response.arrayBuffer());
  } finally {
    clearTimeout(timeoutId);
  }
}

async function detectImageHasAlphaInternal(url: string): Promise<boolean> {
  if (isJpegUrl(url)) return false;

  try {
    const header = await fetchImageHeader(url);
    return parseHeaderHasAlpha(header);
  } catch {
    return isLikelyTransparentByExtension(url);
  }
}

export function detectImageHasAlpha(url: string): Promise<boolean> {
  const cached = alphaCache.get(url);
  if (cached) return cached;

  const detectionPromise = detectImageHasAlphaInternal(url);
  alphaCache.set(url, detectionPromise);

  return detectionPromise;
}
