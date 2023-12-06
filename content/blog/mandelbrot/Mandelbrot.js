import {h} from 'https://esm.sh/preact';
import {useEffect,useState} from 'https://esm.sh/preact/hooks';

export class Complex {
  #real;
  #imaginary;

  constructor(real, imaginary) {
    this.#real = real;
    this.#imaginary = imaginary;
  }

  static abs(left) {
    return Complex.#pythagoras(left.real, left.imaginary);
  }

  static #pythagoras(a, b) {
    return Math.sqrt((a * a) + (b * b));
  }

  static add(left, right) {
    return new Complex(
      left.real + right.real,
      left.imaginary + right.imaginary);
  }

  static multiply(left, right) {
    const real = (left.real * right.real) - (left.imaginary * right.imaginary);
    const imaginary = (left.real * right.imaginary) + (left.imaginary * right.real);
    return new Complex(real, imaginary);
  }

  static pow(left, n) {
    let result = new Complex(1.0, 0.0);
    for (let i = 0; i < n; ++i) {
      result = Complex.multiply(result, left);
    }
    return result;
  }

  static subtract(left, right) {
    return new Complex(
      left.real - right.real,
      left.imaginary - right.imaginary);
  }

  get imaginary() {
    return this.#imaginary;
  }

  get real() {
    return this.#real;
  }
}

/**
 * Calculates nth z function value for the given complex number c.
 * @param n {number} The nth value of z to calculate.
 * @param c {Complex} The complex number to calculate z for.
 * @returns {Complex} The value of the z function.
 */
export function z(n, c) {
  if (n === 0) {
    return new Complex(0.0, 0.0);
  }

  const previous = z(n - 1, c);
  return Complex.add(Complex.pow(previous, 2), c);
}

/**
 * Normalizes the given iteration count, i, for the value z that exceeds the given bound.
 * This produces smooth coloring.
 * @param i {number} The iteration that z exceeded the bound.
 * @param z {number} The absolute value of z that exceeded the bound.
 * @param bound {number} The bound that was exceeded.
 * @returns {number} The normalized iteration count.
 */
export function normalize_i(i, z, bound) {
  return i - Math.log2(Math.log2(z) / Math.log2(bound));
}

/**
 * Finds the iteration, i, when the value of the z function exceeds the given bound for the given complex number c.
 * @param c {Complex} The complex number to calculate the z function with.
 * @param bound {number} The bound to use. Must be at least 2.
 * @param iterations {number} The maximum iterations to search.
 * @returns {number} The iteration that z exceeded the bound, or -1 if not found.
 */
export function i_when_breaks_bound(c, bound, iterations) {
  for (let i = 0; i < iterations; ++i) {
    const z_value = Complex.abs(z(i, c));
    if (z_value > bound) {
      return normalize_i(i, z_value, bound);
    }
  }
  return -1;
}

/**
 * Renders the Mandelbrot set visualization on the given canvas for a viewport of the set with its top-left corner at
 * the given (x, y) coordinates of the given with and height or the given bound and maximum iterations.
 * @param canvas {HTMLCanvasElement} The canvas to render thfe visualization in.
 * @param x {number} The x coordinate of the top-left corner of the viewport of the set.
 * @param y {number} The y coordinate of the top-left corner of the viewport of the set.
 * @param w {number} The width of the viewport of the set.
 * @param h {number} The height of the viewport of the set.
 * @param bound {number} The bound to use to check membership in the set.
 * @param iterations {number} The maximum iterations to calculate the z function for each pixel.
 */
export function render_mandelbrot(canvas, x, y, w, h, bound, iterations) {
  const canvas_width = canvas.width;
  const canvas_height = canvas.height;
  const get_mandelbrot_x = (canvas_x) => ((x + (w * (canvas_x / canvas_width))));
  const get_mandelbrot_y = (canvas_y) => ((y + (h * (canvas_y / canvas_height))));

  const context = canvas.getContext("2d");
  const imageData = context.createImageData(canvas_width, canvas_height);
  const set_pixel_color = (x, y, r, g, b, a = 255) => {
    const pixel_index = ((y * canvas_width) + x) * 4;
    imageData.data[pixel_index] = r;
    imageData.data[pixel_index + 1] = g;
    imageData.data[pixel_index + 2] = b;
    imageData.data[pixel_index + 3] = a;
  };
  const get_color_for_i = (i) => {
    if (i === -1) {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 255,
      };
    }
    const quotient = i / iterations;
    const color = Math.floor(quotient * 255);
    // const color = Math.pow(Math.pow(quotient, 2) * 256, 1.5) % 256;

    return {
      r: 0,
      g: color,
      b: 0,
      a: 255,
    };
  }

  for (let y = 0; y < canvas.height; ++y) {
    for (let x = 0; x < canvas.width; ++x) {
      const i = i_when_breaks_bound(new Complex(get_mandelbrot_x(x), get_mandelbrot_y(y)), bound, iterations);
      const {r, g, b} = get_color_for_i(i);
      set_pixel_color(x, y, r, g, b);
    }
  }
  context.putImageData(imageData, 0, 0);
}

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

export function Mandelbrot(props) {
  const { canvasId } = props;
  const canvas = document.getElementById(canvasId);
  const [viewport, setViewport] = useState({
    x: -2.0,
    y: -2.0,
    width: 4.0,
    height: 4.0,
  });
  const [bound, setBound] = useState(2.0);
  const [iterations, setIterations] = useState(32);

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

  useEffect(() => {
    canvas.addEventListener('click', onClick);
    return () => {
      canvas.removeEventListener('click', onClick);
    };
  }, [canvas, onClick]);

  useEffect(() => {
    render_mandelbrot(canvas, viewport.x, viewport.y, viewport.width, viewport.height, bound, iterations);
  }, [canvas, viewport, bound, iterations]);

  return h('div', null, [
    h('label', null, [
      'Bound',
      h('input', {type: 'number', value: bound, onInput: onInputBound}),
    ]),
    h('label', null, [
      'Iterations',
      h('input', {type: 'number', value: iterations, onInput: onInputIterations}),
    ]),
  ]);
}
