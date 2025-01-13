import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { MarkedExtension } from 'marked';
import { describe, expect, test } from 'vitest';
import Converter from './Converter';

describe('Converter', () => {
  test('should convert correctly', () => {
    const data = `# Heading 1

Hello, World!

[Link](https://example.com "Title")
`;

    const renderer = {
      link({ href, text }: { href: string; text: string }) {
        return `<a href="${href}" target="_blank">${text}</a>`;
      },
    };

    const converter = new Converter(data, {
      markedExtensions: {
        renderer: renderer as MarkedExtension,
      },
      domPurify: DOMPurify(new JSDOM().window),
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
      domPurify: DOMPurify(new JSDOM().window),
    });

    const actual = converter.toHTML();

    const expected = `<h1>Heading 1</h1>
<p>

</p>
`;

    expect(actual).toBe(expected);
  });
});
