import { Converter } from '../dist';
import './style.css';

const output = Converter.toHTML('# Hello, World!');

document.querySelector<HTMLDivElement>('#app')!.innerHTML = output;
