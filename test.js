import test from 'node:test';
import assert from 'node:assert/strict';

import {
  clamp,
  rgbToHex,
  hexToRgb,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  formatAllColorNotations,
  parseColorInput,
  findClosestTailwindShade,
  generateShadesScale,
  generateHarmonies,
  relativeLuminance,
  computeContrastRatio,
  autoFixContrastForAA,
  extractDominantPaletteFromRgba,
  exportPaletteToCssVars,
  exportPaletteToJson,
} from './index.js';

test('sRGB <-> HEX conversion and clamping', () => {
  assert.equal(clamp(300, 0, 255), 255);
  assert.equal(clamp(-10, 0, 255), 0);
  assert.equal(rgbToHex(37, 99, 235), '#2563EB');
  assert.deepEqual(hexToRgb('#2563EB'), { r: 37, g: 99, b: 235 });
  assert.deepEqual(hexToRgb('#fff'), { r: 255, g: 255, b: 255 });
  assert.equal(hexToRgb('invalid'), null);
});

test('sRGB <-> HSL roundtrip', () => {
  const hsl = rgbToHsl(37, 99, 235);
  assert.equal(hsl.h, 221);
  assert.equal(hsl.s, 83);
  assert.equal(hsl.l, 53);

  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  assert.ok(Math.abs(rgb.r - 37) <= 2);
  assert.ok(Math.abs(rgb.g - 99) <= 2);
  assert.ok(Math.abs(rgb.b - 235) <= 2);

  const achromatic = hslToRgb(0, 0, 50);
  assert.deepEqual(achromatic, { r: 128, g: 128, b: 128 });
});

test('sRGB <-> OKLCH forward and inverse conversion', () => {
  const oklch = rgbToOklch(37, 99, 235);
  assert.ok(oklch.L > 0.5 && oklch.L < 0.6);
  assert.ok(oklch.C > 0.15 && oklch.C < 0.25);
  assert.ok(oklch.h > 250 && oklch.h < 270);

  const back = oklchToRgb(oklch.L, oklch.C, oklch.h);
  assert.ok(Math.abs(back.r - 37) <= 6);
  assert.ok(Math.abs(back.g - 99) <= 6);
  assert.ok(Math.abs(back.b - 235) <= 6);
});

test('formatAllColorNotations and parseColorInput', () => {
  const notations = formatAllColorNotations(37, 99, 235);
  assert.equal(notations.hex, '#2563EB');
  assert.equal(notations.rgbStr, 'rgb(37, 99, 235)');
  assert.equal(notations.hslStr, 'hsl(221, 83%, 53%)');
  assert.match(notations.oklchStr, /^oklch\(/);
  assert.equal(notations.tailwind.name, 'blue-600');
  assert.equal(notations.tailwind.distance, 0);

  assert.equal(parseColorInput('#10b981')?.hex, '#10B981');
  assert.equal(parseColorInput('10b981')?.hex, '#10B981');
  assert.equal(parseColorInput('rgb(16, 185, 129)')?.hex, '#10B981');
  assert.equal(parseColorInput('hsl(221, 83%, 53%)')?.hex, '#2463EB');
  assert.ok(parseColorInput('oklch(0.55 0.19 260)')?.hex.startsWith('#'));
  assert.equal(parseColorInput('not-a-color'), null);
});

test('Tailwind matching, 9-step shade scale, and color harmonies', () => {
  const tw = findClosestTailwindShade(15, 23, 42);
  assert.equal(tw.name, 'slate-900');
  assert.equal(tw.distance, 0);

  const shades = generateShadesScale(37, 99, 235);
  assert.equal(shades.length, 9);
  assert.equal(shades[0].step, '50');
  assert.equal(shades[8].step, '900');

  const harmonies = generateHarmonies(37, 99, 235);
  assert.equal(harmonies.base, '#2563EB');
  assert.match(harmonies.complementary, /^#[0-9A-F]{6}$/);
  assert.match(harmonies.triadic1, /^#[0-9A-F]{6}$/);
});

test('WCAG 2.1 luminance, contrast ratio, and AA lightness auto-fix', () => {
  assert.equal(relativeLuminance(0, 0, 0), 0);
  assert.equal(relativeLuminance(255, 255, 255), 1);
  assert.equal(computeContrastRatio('#FFFFFF', '#000000').ratio, 21);
  assert.equal(computeContrastRatio('#2563EB', '#2563EB').ratio, 1);

  const pass = computeContrastRatio('#0F172A', '#FFFFFF');
  assert.equal(pass.aaNormal, true);
  assert.equal(pass.aaaNormal, true);

  const fail = computeContrastRatio('#94A3B8', '#FFFFFF');
  assert.equal(fail.aaNormal, false);

  const fixedOnLight = autoFixContrastForAA('#94A3B8', '#FFFFFF', 4.5);
  assert.ok(computeContrastRatio(fixedOnLight, '#FFFFFF').ratio >= 4.5);

  const fixedOnDark = autoFixContrastForAA('#334155', '#0F172A', 4.5);
  assert.ok(computeContrastRatio(fixedOnDark, '#0F172A').ratio >= 4.5);
});

test('RGBA dominant palette extraction and CSS/JSON exports', () => {
  const width = 20;
  const height = 20;
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const offset = i * 4;
    if (i < 250) {
      rgba[offset] = 15;
      rgba[offset + 1] = 23;
      rgba[offset + 2] = 42;
      rgba[offset + 3] = 255;
    } else {
      rgba[offset] = 37;
      rgba[offset + 1] = 99;
      rgba[offset + 2] = 235;
      rgba[offset + 3] = 255;
    }
  }
  const palette = extractDominantPaletteFromRgba(rgba, width, height, 8);
  assert.ok(palette.length >= 2);
  assert.equal(palette[0].hex, '#0F172A');

  const cssVars = exportPaletteToCssVars(palette);
  assert.match(cssVars, /:root \{/);
  assert.match(cssVars, /--color-1: #0F172A;/);

  const jsonExport = JSON.parse(exportPaletteToJson(palette));
  assert.equal(jsonExport[0].hex, '#0F172A');
});
