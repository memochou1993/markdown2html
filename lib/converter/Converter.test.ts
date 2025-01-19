import DOMPurify from 'dompurify';
import highlight from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { JSDOM } from 'jsdom';
import { markedHighlight } from 'marked-highlight';
import { describe, expect, test } from 'vitest';
import Converter from './Converter';

const { window } = new JSDOM();

describe('Converter', () => {
  describe('should convert', () => {
    test('using the instance method', () => {
      const converter = new Converter('# Heading 1', {
        domPurify: DOMPurify(window),
      });

      const actual = converter.toHTML();

      const expected = `<h1>Heading 1</h1>\n`;

      expect(actual).toStrictEqual(expected);
    });

    test('using the static method', () => {
      const actual = Converter.toHTML('# Heading 1', {
        domPurify: DOMPurify(window),
      });

      const expected = `<h1>Heading 1</h1>\n`;

      expect(actual).toStrictEqual(expected);
    });
  });

  test('should convert correctly', () => {
    const markdown = `# Heading 1

Hello, World!

[Link](https://example.com "Link")
`;

    const converter = new Converter(markdown, {
      domPurify: DOMPurify(window),
    });

    const actual = converter.toHTML();

    const expected = `<h1>Heading 1</h1>
<p>Hello, World!</p>
<p><a title="Link" href="https://example.com">Link</a></p>
`;

    expect(actual).toBe(expected);
  });

  test('should convert and sanitize correctly', () => {
    const markdown = `# Heading 1

<a href="https://example.com" target="_blank" onmouseover="alert('XSS Attack!')">Link</a>
`;

    const converter = new Converter(markdown, {
      domPurify: DOMPurify(window),
      domPurifyConfig: {
        ADD_ATTR: [
          'target',
        ],
      },
    });

    const actual = converter.toHTML();

    const expected = `<h1>Heading 1</h1>
<p><a target="_blank" href="https://example.com">Link</a></p>
`;

    expect(actual).toBe(expected);
  });

  test('should convert and render correctly', () => {
    const markdown = `# Heading 1

[Link](https://example.com "Link")
`;

    const converter = new Converter(markdown, {
      domPurify: DOMPurify(window),
    })
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

    const actual = converter.toHTML();

    const expected = `<h1>Heading 1</h1>
<p><a target="_blank" href="https://example.com" title="Link">Link</a></p>
`;

    expect(actual).toBe(expected);
  });

  test('should convert and highlight correctly', () => {
    highlight.registerLanguage('javascript', javascript);

    const markdown = `# Heading 1

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
`;

    const converter = new Converter(markdown, {
      domPurify: DOMPurify(window),
    })
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

    const actual = converter.toHTML();

    const expected = `<h1>Heading 1</h1>
<pre><code class="language-javascript"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">'Hello, World!'</span>);
</code></pre>`;

    expect(actual).toBe(expected);
  });
});
