import DOMPurify from 'dompurify';
import highlight from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { JSDOM } from 'jsdom';
import { markedHighlight } from 'marked-highlight';
import { describe, expect, test } from 'vitest';
import Converter from './Converter';

const { window } = new JSDOM();

describe('Converter', () => {
  test('should convert correctly', () => {
    const data = `# Heading 1

Hello, World!

[Link](https://example.com "Title")
`;

    const converter = new Converter(data, {
      markedExtensions: [
        {
          renderer: {
            link({ href, text }: { href: string; text: string }) {
              return `<a href="${href}" target="_blank">${text}</a>`;
            },
          },
        },
      ],
      domPurify: DOMPurify(window),
      domPurifyOptions: {
        ADD_ATTR: ['target'],
      },
    });

    const actual = converter.toHTML();

    const expected = `<h1>Heading 1</h1>
<p>Hello, World!</p>
<p><a target="_blank" href="https://example.com">Link</a></p>
`;

    expect(actual).toBe(expected);
  });

  test('should convert and sanitize correctly', () => {
    const data = `# Heading 1
<p>
<script>alert('Hello, World!');</script>
</p>
`;

    const converter = new Converter(data, {
      domPurify: DOMPurify(window),
    });

    const actual = converter.toHTML();

    const expected = `<h1>Heading 1</h1>
<p>

</p>
`;

    expect(actual).toBe(expected);
  });

  test('should convert and highlight correctly', () => {
    highlight.registerLanguage('javascript', javascript);

    const data = `
\`\`\`javascript
console.log('Hello, World!');
\`\`\`
`;

    const converter = new Converter(data, {
      markedExtensions: [
        {
          renderer: {
            link({ href, text }: { href: string; text: string }) {
              return `<a href="${href}" target="_blank">${text}</a>`;
            },
          },
        },
        markedHighlight({
          langPrefix: 'language-',
          highlight(code, lang) {
            const options = {
              language: highlight.getLanguage(lang) ? lang : 'javascript',
            };
            return highlight.highlight(code, options).value;
          },
        }),
      ],
      domPurify: DOMPurify(window),
    });

    const actual = converter.toHTML();

    const expected = `<pre><code class="language-javascript"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'Hello, World!'</span>);
</code></pre>`;

    expect(actual).toBe(expected);
  });
});
