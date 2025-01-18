import createDOMPurify, { DOMPurify, Config as DOMPurifyConfig } from 'dompurify';
import { Marked, MarkedExtension } from 'marked';

interface ConverterOptions {
  marked?: Marked;
  markedExtensions?: MarkedExtension[];
  domPurify?: DOMPurify;
  domPurifyConfig?: DOMPurifyConfig;
}

class Converter {
  private data: string;

  private marked: Marked;

  private domPurify: DOMPurify;

  constructor(data: string, options: ConverterOptions = {}) {
    this.data = data;
    this.marked = options.marked ?? new Marked();
    this.setMarkedExtensions(options.markedExtensions ?? []);
    this.domPurify = options.domPurify ?? createDOMPurify();
    this.setDOMPurifyConfig(options.domPurifyConfig ?? {});
  }

  public setMarkedExtensions(extensions: MarkedExtension[]): this {
    this.marked.use(...extensions);
    return this;
  }

  public setDOMPurifyConfig(config: DOMPurifyConfig): this {
    this.domPurify.setConfig(config);
    return this;
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
  public toHTML(domPurifyConfig: DOMPurifyConfig = {}): string {
    const html = this.marked
      .parse(this.data)
      .toString();

    return this.domPurify.sanitize(html, domPurifyConfig);
  }
}

export default Converter;
