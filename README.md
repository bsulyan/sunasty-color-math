# sunasty-color-math

Zero-dependency JavaScript and TypeScript library for sRGB, HEX, HSL, and perceptual OKLCH color conversions, WCAG 2.1 contrast calculation, automatic AA lightness adjustment, Tailwind CSS token matching, and RGBA buffer palette quantization.

Extracted from the core engine powering the [Sunasty Color Picker](https://sunasty.com/color-picker/) and the [Sunasty Developer Tools](https://sunasty.com/dev/) suite.

## Features

- **Perceptual OKLCH & sRGB**: Forward (`rgbToOklch`) and inverse (`oklchToRgb`) Oklab/OKLCH transformations alongside `rgbToHex`, `hexToRgb`, `rgbToHsl`, and `hslToRgb`.
- **Unified Color Parser**: `parseColorInput` accepts `#RGB`, `#RRGGBB`, `rgb(...)`, `hsl(...)`, and `oklch(...)` strings.
- **WCAG 2.1 Contrast & Auto-Fix**: `computeContrastRatio` evaluates AA/AAA compliance for normal and large text; `autoFixContrastForAA` solves for the nearest lightness value that satisfies a target contrast ratio (4.5:1 by default) while preserving hue and saturation.
- **Design System Generators**: `findClosestTailwindShade`, `generateShadesScale` (9-stop 50-900 scale), and `generateHarmonies` (complementary, analogous, triadic).
- **RGBA Palette Quantizer**: `extractDominantPaletteFromRgba` clusters raw `ImageData` pixel buffers into dominant swatches and exports to CSS custom properties (`exportPaletteToCssVars`) or JSON (`exportPaletteToJson`).

## Installation

Via npm:

```bash
npm install sunasty-color-math
```

Or import directly in browsers and Deno via ESM CDN (jsDelivr):

```js
import {
  rgbToHex,
  rgbToOklch,
  computeContrastRatio,
  autoFixContrastForAA,
} from 'https://cdn.jsdelivr.net/npm/sunasty-color-math@1.0.1/+esm';
```

## Usage

### Color Conversion and Notations

```js
import {
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  formatAllColorNotations,
  parseColorInput,
} from 'sunasty-color-math';

const notations = formatAllColorNotations(37, 99, 235);
console.log(notations.hex);       // "#2563EB"
console.log(notations.hslStr);    // "hsl(221, 83%, 53%)"
console.log(notations.oklchStr);  // "oklch(0.55 0.19 260)"
console.log(notations.tailwind);  // { name: "blue-600", hex: "#2563EB", distance: 0 }

const parsed = parseColorInput('oklch(0.55 0.19 260)');
console.log(parsed);              // { r: 37, g: 99, b: 234, hex: "#2563EA" }
```

### WCAG 2.1 Contrast Verification and Automatic Lightness Adjustment

```js
import { computeContrastRatio, autoFixContrastForAA } from 'sunasty-color-math';

const check = computeContrastRatio('#94A3B8', '#FFFFFF');
console.log(check);
// { ratio: 2.56, aaNormal: false, aaLarge: false, aaaNormal: false, aaaLarge: false }

const accessibleFg = autoFixContrastForAA('#94A3B8', '#FFFFFF', 4.5);
console.log(accessibleFg); // "#596B82"
console.log(computeContrastRatio(accessibleFg, '#FFFFFF').ratio); // 4.56
```

### Shade Scales, Harmonies, and RGBA Quantization

```js
import {
  generateShadesScale,
  generateHarmonies,
  extractDominantPaletteFromRgba,
  exportPaletteToCssVars,
} from 'sunasty-color-math';

const scale = generateShadesScale(37, 99, 235);
// [{ step: "50", hex: "#EDF2FE" }, ..., { step: "900", hex: "#071A4B" }]

const harmonies = generateHarmonies(37, 99, 235);
// { base: "#2563EB", complementary: "#EBAD25", analogous1: "#25C7EB", ... }

// Extract dominant palette from a Canvas 2D ImageData buffer:
const swatches = extractDominantPaletteFromRgba(imageData.data, imageData.width, imageData.height, 8);
console.log(exportPaletteToCssVars(swatches));
```

## Web Utilities

- Interactive browser color picker, OKLCH converter, and contrast checker: [https://sunasty.com/color-picker/](https://sunasty.com/color-picker/)
- Client-side developer utilities and formatters: [https://sunasty.com/dev/](https://sunasty.com/dev/)
- Chrome/Chromium MV3 extension repository: [https://github.com/bsulyan/sunasty-color-picker](https://github.com/bsulyan/sunasty-color-picker)

## License

MIT
