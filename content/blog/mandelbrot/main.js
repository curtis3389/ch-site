import {h, render} from 'https://esm.sh/preact';
import {Mandelbrot} from './Mandelbrot.js';
import {GlMandelbrot} from "./GlMandelbrot.js";

render(h(Mandelbrot, {canvasId: 'mandelbrot-canvas'}), document.getElementById('mandelbrot'));
render(h(GlMandelbrot, {canvasId: 'gl-mandelbrot-canvas'}), document.getElementById('gl-mandelbrot'));
