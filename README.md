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

```ts
import { parse, convert } from 'hueful';

const result = parse('#ff8800');
// { space: 'rgb', value: [255, 136, 0] }

const oklch = convert('rgb', 'oklch', result.value);
// [0.744, 0.181, 56.458]
```

## License

MIT
