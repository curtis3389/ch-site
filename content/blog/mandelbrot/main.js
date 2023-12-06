import {h, render} from 'https://esm.sh/preact';
import {Mandelbrot} from './Mandelbrot.js';

render(h(Mandelbrot, {canvasId: 'mandelbrot-canvas'}), document.getElementById('mandelbrot'));
