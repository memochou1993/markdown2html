import createDOMPurify, { DOMPurify, Config as DOMPurifyConfig } from 'dompurify';
import { Marked, MarkedExtension } from 'marked';

interface ConverterOptions {
  marked?: Marked;
  markedExtensions?: Record<string, MarkedExtension>;
  domPurify?: DOMPurify;
  domPurifyOptions?: DOMPurifyConfig;
}

class Converter {
  private markdown: string;

  private marked: Marked;

  private domPurify: DOMPurify;

  constructor(markdown: string, options: ConverterOptions = {}) {
    this.markdown = markdown;

    this.marked = options.marked ?? new Marked();
    Object.entries(options.markedExtensions ?? {}).forEach(([key, value]) => {
      this.marked.use({ [key]: value });
    });

    this.domPurify = options.domPurify ?? createDOMPurify();
    this.domPurify.setConfig(options.domPurifyOptions ?? {});
  }

  /**
   * Converts the provided data into HTML format.
   */
  public static toHTML(data: string, options: ConverterOptions = {}): string {
    return new Converter(data, options).toHTML();
  }

  /**
   * Converts the provided data into HTML format.
   */
  public toHTML(): string {
    const html = this.marked
      .parse(this.markdown)
      .toString();

    return this.domPurify.sanitize(html);
  }
}

export default Converter;
