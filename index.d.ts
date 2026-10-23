export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface OklchColor {
  L: number;
  C: number;
  h: number;
}

export interface TailwindMatch {
  name: string;
  hex: string;
  distance: number;
}

export interface ColorNotations {
  r: number;
  g: number;
  b: number;
  hex: string;
  rgbStr: string;
  hsl: HslColor;
  hslStr: string;
  oklch: OklchColor;
  oklchStr: string;
  tailwind: TailwindMatch;
}

export interface ParsedColor extends RgbColor {
  hex: string;
}

export interface ShadeStop {
  step: string;
  hex: string;
}

export interface ColorHarmonies {
  base: string;
  complementary: string;
  analogous1: string;
  analogous2: string;
  triadic1: string;
  triadic2: string;
}

export interface ContrastResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

export interface PaletteSwatch {
  hex: string;
  count: number;
  percentage: number;
}

export declare function clamp(val: number, min: number, max: number): number;
export declare function rgbToHex(r: number, g: number, b: number): string;
export declare function hexToRgb(hex: string): RgbColor | null;
export declare function rgbToHsl(r: number, g: number, b: number): HslColor;
export declare function hslToRgb(h: number, s: number, l: number): RgbColor;
export declare function rgbToOklch(r: number, g: number, b: number): OklchColor;
export declare function oklchToRgb(L: number, C: number, h: number): RgbColor;
export declare function formatAllColorNotations(r: number, g: number, b: number): ColorNotations;
export declare function parseColorInput(input: string): ParsedColor | null;
export declare function findClosestTailwindShade(r: number, g: number, b: number): TailwindMatch;
export declare function generateShadesScale(r: number, g: number, b: number): ShadeStop[];
export declare function generateHarmonies(r: number, g: number, b: number): ColorHarmonies;
export declare function relativeLuminance(r: number, g: number, b: number): number;
export declare function computeContrastRatio(fgHex: string, bgHex: string): ContrastResult;
export declare function autoFixContrastForAA(fgHex: string, bgHex: string, targetRatio?: number): string;
export declare function extractDominantPaletteFromRgba(
  data: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
  maxColors?: number
): PaletteSwatch[];
export declare function exportPaletteToCssVars(colors: Array<string | { hex: string }>): string;
export declare function exportPaletteToJson(colors: unknown[]): string;
