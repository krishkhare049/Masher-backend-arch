export function lightenHexColor(hex: string, amount = 0.1): string {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Lighten with clamping (but avoid full white)
  r = Math.min(240, Math.floor(r + (255 - r) * amount));
  g = Math.min(240, Math.floor(g + (255 - g) * amount));
  b = Math.min(240, Math.floor(b + (255 - b) * amount));

  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
