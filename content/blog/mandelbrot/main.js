import {h, render} from 'https://esm.sh/preact';
import {Mandelbrot} from './Mandelbrot.js';

render(h(Mandelbrot, {canvasId: 'mandelbrot-canvas', renderType: 'js'}), document.getElementById('mandelbrot'));
render(h(Mandelbrot, {canvasId: 'gl-mandelbrot-canvas', renderType: 'gl', iterations: 256}), document.getElementById('gl-mandelbrot'));
