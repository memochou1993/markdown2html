import { Converter } from '../dist';
import './style.css';

const output = Converter.toHTML('# Hello, World! \n <a href="/" target="_blank" onmouseover="alert(\'XSS Attack!\')">It works!</a>', {
  domPurifyConfig: {
    ADD_ATTR: [
      'target',
    ],
  },
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = output;
