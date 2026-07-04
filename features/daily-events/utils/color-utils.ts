function normalizeHex(color: string): string | null {
  if (!color) return null;
  let hex = color.trim();
  if (!hex.startsWith("#")) return null;
  hex = hex.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (hex.length === 8) {
    hex = hex.slice(0, 6);
  }

  if (hex.length !== 6) return null;
  return hex;
}

function hexToRgb(
  color: string,
): { r: number; g: number; b: number } | null {
  const hex = normalizeHex(color);
  if (!hex) return null;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return { r, g, b };
}

export function darkenHexColor(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const factor = Math.max(0, Math.min(1, 1 - amount));
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

function parseAnyColor(
  color: string,
): { r: number; g: number; b: number } | null {
  const hex = hexToRgb(color);
  if (hex) return hex;

  const match = color.match(/rgba?\(([^)]+)\)/);
  if (match) {
    const parts = match[1].split(",").map((p) => parseFloat(p.trim()));
    if (parts.length >= 3) {
      return { r: parts[0], g: parts[1], b: parts[2] };
    }
  }
  return null;
}

export function desaturateColor(color: string, amount: number): string {
  const rgb = parseAnyColor(color);
  if (!rgb) return color;

  const gray = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  const t = Math.max(0, Math.min(1, amount));

  const r = Math.round(rgb.r * (1 - t) + gray * t);
  const g = Math.round(rgb.g * (1 - t) + gray * t);
  const b = Math.round(rgb.b * (1 - t) + gray * t);

  return `rgb(${r}, ${g}, ${b})`;
}

export function mixColors(
  color: string,
  target: string,
  amount: number,
): string {
  const a = parseAnyColor(color);
  const b = parseAnyColor(target);
  if (!a || !b) return color;

  const t = Math.max(0, Math.min(1, amount));
  const r = Math.round(a.r * (1 - t) + b.r * t);
  const g = Math.round(a.g * (1 - t) + b.g * t);
  const bb = Math.round(a.b * (1 - t) + b.b * t);

  return `rgb(${r}, ${g}, ${bb})`;
}

export function getReadableTextColor(color: string): "#FFFFFF" | "#111111" {
  let rgb = hexToRgb(color);

  if (!rgb) {
    const match = color.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(",").map((p) => parseFloat(p.trim()));
      if (parts.length >= 3) {
        rgb = { r: parts[0], g: parts[1], b: parts[2] };
      }
    }
  }

  if (!rgb) return "#FFFFFF";

  const luminance =
    (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.6 ? "#111111" : "#FFFFFF";
}
