# Markdown2HTML

A simple Markdown to HTML converter that transforms Markdown content into sanitized HTML code.

## Usage

### Using with ES Modules

To get started with ES Modules, simply import the module and use it in your code:

```js
import { Converter } from '@memochou1993/markdown2html';

const output = Converter.toHTML('# Hello, World!');

// Output:
// <h1>Hello, world!</h1>
```

### Using with UMD Modules

Alternatively, if you're using UMD modules, include the script in your HTML file and use it in your code:

```html
<script src="https://unpkg.com/@memochou1993/markdown2html/dist/index.umd.js"></script>
<script>
const output = window.Markdown2HTML.Converter.toHTML('# Hello, world!');

// Output:
// <h1>Hello, world!</h1>
</script>
```

## Development

To start a local development server, run:

```bash
npm run dev
```

## Testing

To run the tests for this package, run:

```bash
npm run test
```
