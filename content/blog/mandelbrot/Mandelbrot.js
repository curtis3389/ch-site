import {h} from 'preact';
import {useEffect,useState} from 'preact/hooks';
import {JsMandelbrot} from './JsMandelbrot.js';
import {GlMandelbrot} from './GlMandelbrot.js';

/**
 * Gets the (x, y) coordinates of the given mouse event in the given canvas.
 * @param canvas The canvas the mouse event was on.
 * @param event The mouse event to get the coordinates of.
 * @returns {{x: number, y: number}} The coordinates of the mouse event.
 */
export function get_cursor_position(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return {
    x: x,
    y: y,
  };
}

function initialViewport(canvas) {
  const aspectRatio = canvas.width / canvas.height;
  const width = aspectRatio >= 1
    ? 4.0
    : aspectRatio * 4.0;
  const height = aspectRatio >= 1
    ? (canvas.height / canvas.width) * 4.0
    : 4.0;
  return {
    x: -width / 2.0,
    y: -height / 2.0,
    width,
    height,
  };
}

export function Mandelbrot(props) {
  const {
    canvasId,
    renderType,
    bound: startingBound,
    iterations: startingIterations,
    smooth: startSmooth,
  } = props;
  const canvas = document.getElementById(canvasId);
  const [viewport, setViewport] = useState(initialViewport(canvas));
  const [bound, setBound] = useState(startingBound ?? 2.0);
  const [iterations, setIterations] = useState(startingIterations ?? 32);
  const [smooth, setSmooth] = useState(startSmooth);

  const to_mandelbrot_coordinates = (canvas_x, canvas_y) => {
    const new_x = viewport.x + (viewport.width * (canvas_x / canvas.width));
    const new_y = viewport.y + (viewport.height * (canvas_y / canvas.height));
    return {
      x: new_x,
      y: new_y,
    };
  };

  const scaleAt = (pos, ratio) => {
    const new_width = viewport.width * ratio;
    const new_height = viewport.height * ratio;
    const new_x = pos.x - (new_width / 2);
    const new_y = pos.y - (new_height / 2);
    setViewport({
      x: new_x,
      y: new_y,
      width: new_width,
      height: new_height,
    });
  };

  const onClick = (event) => {
    event.preventDefault();
    const mandelbrot_pos = () => {
      const canvas_pos = get_cursor_position(canvas, event);
      return to_mandelbrot_coordinates(canvas_pos.x, canvas_pos.y);
    };

    if (event.button === 0 && !event.shiftKey) {
      // zoom in
      scaleAt(mandelbrot_pos(), 0.5);
    } else if (event.button === 0 && event.shiftKey) {
      // zoom out
      scaleAt(mandelbrot_pos(), 2.0);
    }
  };

  const fromEvent = (setValue) => (event) => {
    setValue(event.target.value);
  };
  const onInputBound = fromEvent(setBound);
  const onInputIterations = fromEvent(setIterations);
  const onInputSmooth = (e) => setSmooth(e.target.checked);

  useEffect(() => {
    canvas.addEventListener('click', onClick);
    return () => {
      canvas.removeEventListener('click', onClick);
    };
  }, [canvas, onClick]);

  const mandelbrotProps = {
    canvasId,
    bound,
    iterations,
    smooth,
    viewport,
  };
  return h('div', { class: 'row' }, [
    renderType === 'gl'
      ? h(GlMandelbrot, mandelbrotProps)
      : h(JsMandelbrot, mandelbrotProps),
    h('label', { class: 'four columns' }, [
      'Bound',
      h('input', {type: 'number', value: bound, onInput: onInputBound}),
    ]),
    h('label', { class: 'four columns' }, [
      'Iterations',
      h('input', {type: 'number', value: iterations, onInput: onInputIterations}),
    ]),
    h('label', {class: 'four columns'}, [
      'Smooth',
      h('input', {type: 'checkbox', checked: smooth, onInput: onInputSmooth}),
    ]),
  ]);
}
