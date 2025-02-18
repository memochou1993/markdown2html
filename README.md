# Markdown2HTML

A simple Markdown to HTML converter that transforms Markdown content into HTML code, which is sanitized to prevent XSS attacks.

# Demo

[JSON2Markdown Renderer](https://memochou1993.github.io/json2markdown-converter/)

## Getting Started

### Using with ES Modules

To get started with ES Modules, simply import the module and use it in your code:

```js
import { Converter } from '@memochou1993/markdown2html';

const output = Converter.toHTML('# Hello, World!');

// Output:
// <h1>Hello, World!</h1>
```

### Using with UMD Modules

Alternatively, if you're using UMD modules, include the script in your HTML file and use it in your code:

```html
<script src="https://unpkg.com/marked/marked.min.js"></script>
<script src="https://unpkg.com/dompurify/dist/purify.min.js"></script>
<script src="https://unpkg.com/@memochou1993/markdown2html/dist/index.umd.js"></script>
<script>
const output = window.Markdown2HTML.Converter.toHTML('# Hello, World!');

// Output:
// <h1>Hello, World!</h1>
</script>
```

## Usage

### Basic Usage

The `Converter` can be initialized with Markdown content and then converted to HTML code using the `toHTML` method.

```js
const markdown = `# Heading 1`;

const converter = new Converter(markdown);

const output = converter.toHTML();

// Output:
// <h1>Heading 1</h1>
```

### XSS Sanitizer

The `Converter` can sanitize potentially unsafe HTML content while converting it into valid HTML code. It uses `DOMPurify` for sanitization, and you can configure it to allow specific attributes or elements as needed.

```js
const markdown = `# Heading 1

<a href="https://example.com" target="_blank" onmouseover="alert('XSS Attack!')">Link</a>
`;

const converter = new Converter(markdown, {
  domPurifyConfig: {
    ADD_ATTR: [
      'target',
    ],
  },
});

const output = converter.toHTML();

// Output:
// <h1>Heading 1</h1>
// <p><a target="_blank" href="https://example.com">Link</a></p>
```

### Renderer

The `Converter` supports customizing the rendering of Markdown elements using the `setMarkedExtensions` method. This allows you to override specific renderers, such as `link`, to generate tailored HTML output. Combined with `DOMPurify`, the output can be both secure and precisely formatted.

```js
const markdown = `# Heading 1

[Link](https://example.com "Link")
`;

const converter = new Converter(markdown)
  .setMarkedExtensions([
    {
      renderer: {
        link({ href, title, text }) {
          return `<a title="${title}" href="${href}" target="_blank">${text}</a>`;
        },
      },
    },
  ])
  .setDOMPurifyConfig({
    ADD_ATTR: [
      'target',
    ],
  });

const output = converter.toHTML();

// Output:
// <h1>Heading 1</h1>
// <p><a target="_blank" href="https://example.com" title="Link">Link</a></p>
```

### Syntax Highlighter

The `Converter` supports adding syntax highlighting to Markdown code blocks with the `setMarkedExtensions` method. By integrating the `marked-highlight` and `highlight.js` libraries, you can customize the appearance of code blocks and apply language-specific styles.

```js
import 'highlight.js/styles/default.min.css';
import { markedHighlight } from 'marked-highlight';
import highlight from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

highlight.registerLanguage('javascript', javascript);

const markdown = `# Heading 1

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
`;

const converter = new Converter(markdown)
  .setMarkedExtensions([
    markedHighlight({
      langPrefix: 'language-',
      highlight(code, lang) {
        const options = {
          language: highlight.getLanguage(lang) ? lang : 'javascript',
        };
        return highlight.highlight(code, options).value;
      },
    }),
  ]);

const output = converter.toHTML();

// Output:
// <h1>Heading 1</h1>
// <pre><code class="language-javascript"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'Hello, World!'</span>);
// </code></pre>
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
