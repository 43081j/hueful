# 🎨 hueful

<p align="center">
  <img src="https://raw.githubusercontent.com/43081j/hueful/main/logo.jpg" alt="hueful logo" width="256">
</p>

> A library for converting, formatting and parsing CSS colours.

## Install

```sh
npm i -S hueful
```

## Usage

Colours are represented as plain tuples of `[c0, c1, c2, alpha?]` in a given
colour space.

### `parse(input)`

Parses any supported CSS colour string, returning the detected space and its
value (or `null` if invalid).

```ts
import { parse } from 'hueful';

parse('#ff8800');
// { space: 'rgb', value: [255, 136, 0] }

parse('oklch(0.7 0.15 30 / 0.5)');
// { space: 'oklch', value: [0.7, 0.15, 30, 0.5] }

parse('rebeccapurple');
// { space: 'rgb', value: [102, 51, 153] }
```

### `convert(from, to, color)`

Converts a colour between any two spaces, preserving alpha.

```ts
import { convert } from 'hueful';

convert('rgb', 'oklch', [255, 136, 0]);
// [0.744, 0.181, 56.458]
```

### Using a colour space directly

Each space is exported as a namespace with its own `parse` and `format`
functions (plus some space-specific helpers).

```ts
import { rgb, hsl, oklch } from 'hueful';

oklch.parse('oklch(0.7 0.15 30)');
// [0.7, 0.15, 30]

rgb.format(255, 136, 0); // 'rgb(255 136 0)'
```

Named colours are also available as RGB tuples via the `names` export:

```ts
import { names } from 'hueful';

names.rebeccapurple; // [102, 51, 153]
```

## Manipulation

These functions work across all spaces. They take the space of the input
colour and return a colour in that same space.

```ts
import { lighten, mix } from 'hueful';

lighten('oklch', [0.5, 0.1, 30], 0.2);
// [0.6, 0.1, 30]

mix('rgb', [255, 0, 0], [0, 0, 255]);
// [140.362, 83.033, 162.308]
```

| Function                                | Description                                                |
| --------------------------------------- | ---------------------------------------------------------- |
| `lighten(space, color, amount)`         | Increases OKLCH lightness by a ratio of its current value. |
| `darken(space, color, amount)`          | Decreases OKLCH lightness by a ratio of its current value. |
| `saturate(space, color, amount)`        | Increases OKLCH chroma by a ratio of its current value.    |
| `desaturate(space, color, amount)`      | Decreases OKLCH chroma by a ratio of its current value.    |
| `grayscale(space, color)`               | Removes all chroma, keeping perceived lightness.           |
| `rotateHue(space, color, degrees)`      | Rotates the OKLCH hue by the given number of degrees.      |
| `mix(space, a, b, weight?)`             | Mixes two colours in OKLab. `weight` is the share of `b`.  |
| `fadeIn(color, amount)`                 | Increases alpha by a ratio of its current value.           |
| `fadeOut(color, amount)`                | Decreases alpha by a ratio of its current value.           |

## Analysis

```ts
import { contrast, contrastLevel, isDark } from 'hueful';

contrast('rgb', [255, 136, 0], [255, 255, 255]); // 2.393
contrastLevel('rgb', [0, 0, 0], [255, 255, 255]); // 'AAA'
isDark('rgb', [255, 136, 0]); // false
```

| Function                       | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| `luminance(space, color)`      | WCAG relative luminance.                                       |
| `contrast(space, a, b)`        | WCAG 2 contrast ratio between two colours.                     |
| `contrastLevel(space, a, b)`   | WCAG 2 level (`'AAA'`, `'AA'` or `null`).                      |
| `isDark(space, color)`         | Whether the colour contrasts more against white than black.    |
| `isLight(space, color)`        | Whether the colour contrasts at least as much against black.   |

## License

MIT
