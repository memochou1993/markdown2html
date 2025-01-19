import createDOMPurify, { DOMPurify, Config as DOMPurifyConfig } from 'dompurify';
import { Marked, MarkedExtension } from 'marked';

interface ConverterOptions {
  marked?: Marked;
  markedExtensions?: MarkedExtension[];
  domPurify?: DOMPurify;
  domPurifyConfig?: DOMPurifyConfig;
}

class Converter {
  private markdown: string;

  private marked: Marked;

  private domPurify: DOMPurify;

  constructor(markdown: string, options: ConverterOptions = {}) {
    this.markdown = markdown;
    this.marked = options.marked ?? new Marked();
    this.setMarkedExtensions(options.markedExtensions);
    this.domPurify = options.domPurify ?? createDOMPurify();
    this.setDOMPurifyConfig(options.domPurifyConfig);
  }

  public setMarkedExtensions(extensions?: MarkedExtension[]): this {
    if (extensions) this.marked.use(...extensions);
    return this;
  }

  public setDOMPurifyConfig(config?: DOMPurifyConfig): this {
    if (config) this.domPurify.setConfig(config);
    return this;
  }

  /**
   * Converts the provided Markdown content into HTML code.
   */
  public static toHTML(markdown: string, options: ConverterOptions = {}): string {
    return new Converter(markdown, options).toHTML();
  }

  /**
   * Converts the provided Markdown content into HTML code.
   */
  public toHTML(domPurifyConfig: DOMPurifyConfig = {}): string {
    const html = this.marked
      .parse(this.markdown)
      .toString();

    return this.domPurify.sanitize(html, domPurifyConfig);
  }
}

export default Converter;
