import createDOMPurify, { DOMPurify, Config as DOMPurifyConfig } from 'dompurify';
import { Marked, MarkedExtension } from 'marked';

interface ConverterOptions {
  marked?: Marked;
  markedExtensions?: MarkedExtension[];
  domPurify?: DOMPurify;
  domPurifyOptions?: DOMPurifyConfig;
}

class Converter {
  private data: string;

  private marked: Marked;

  private domPurify: DOMPurify;

  constructor(data: string, options: ConverterOptions = {}) {
    this.data = data;
    this.marked = options.marked ?? new Marked();
    this.marked.use(...(options.markedExtensions ?? []));
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
      .parse(this.data)
      .toString();

    return this.domPurify.sanitize(html);
  }
}

export default Converter;
