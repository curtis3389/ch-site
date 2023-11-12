import * as math from "https://esm.sh/mathjs";

/**
 * Calculates nth z function value for the given complex number c.
 * @param n {number} The nth value of z to calculate.
 * @param c {math.complex} The complex number to calculate z for.
 * @returns {math.complex|number} The value of the z function.
 */
export function z(n, c) {
  if (n === 0) {
    return 0;
  }

  const previous = z(n - 1, c);
  return math.add(math.pow(previous, 2), c);
}

/**
 * Normalizes the given iteration count, i, for the value z that exceeds the given bound.
 * This produces smooth coloring.
 * @param i {number} The iteration that z exceeded the bound.
 * @param z {math.complex} The value of z that exceeded the bound.
 * @param bound {number} The bound that was exceeded.
 * @returns {number} The normalized iteration count.
 */
export function normalize_i(i, z, bound) {
  return i - math.log2(math.divide(
    math.log2(math.abs(z)),
    math.log2(bound)))
}

/**
 * Finds the iteration, i, when the value of the z function exceeds the given bound for the given complex number c.
 * @param c {math.complex} The complex number to calculate the z function with.
 * @param bound {number} The bound to use. Must be at least 2.
 * @param iterations {number} The maximum iterations to search.
 * @returns {number} The iteration that z exceeded the bound, or -1 if not found.
 */
export function i_when_breaks_bound(c, bound, iterations) {
  for (let i = 0; i < iterations; ++i) {
    const z_value = math.abs(z(i, c));
    if (z_value > bound) {
      return normalize_i(i, z_value, bound);
    }
  }
  return -1;
}

/**
 * Renders the Mandelbrot set visualization on the given canvas for a viewport of the set with its top-left corner at
 * the given (x, y) coordinates of the given with and height for the given bound and maximum iterations.
 * @param canvas {HTMLCanvasElement} The canvas to render the visualization in.
 * @param x {math.bignumber} The x coordinate of the top-left corner of the viewport of the set.
 * @param y {math.bignumber} The y coordinate of the top-left corner of the viewport of the set.
 * @param w {math.bignumber} The width of the viewport of the set.
 * @param h {math.bignumber} The height of the viewport of the set.
 * @param bound {number} The bound to use to check membership in the set.
 * @param iterations {number} The maximum iterations to calculate the z function for each pixel.
 */
export function render_mandelbrot(canvas, x, y, w, h, bound, iterations) {
  const canvas_width = canvas.width;
  const canvas_height = canvas.height;
  const pixel_width = math.divide(w, canvas_width);
  const pixel_height = math.divide(h, canvas_height);
  const pixel_x_offset = math.divide(pixel_width, 2);
  const pixel_y_offset = math.divide(pixel_height, 2);
  const get_mandelbrot_x = (canvas_x) => math.subtract(
    math.add(
      x,
      math.multiply(w, canvas_x / canvas_width)),
    pixel_x_offset);
  const get_mandelbrot_y = (canvas_y) => math.subtract(
    math.add(
      y,
      math.multiply(h, canvas_y / canvas_height)),
    pixel_y_offset);

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
    const g = Math.floor(i / iterations * 255);
    return {
      r: 0,
      g: g,
      b: 0,
      a: 255,
    };
  }

  for (let y = 0; y < canvas.height; ++y) {
    for (let x = 0; x < canvas.width; ++x) {
      const i = i_when_breaks_bound(math.complex(get_mandelbrot_x(x), get_mandelbrot_y(y)), bound, iterations);
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

/**
 * Runs the Mandelbrot visualization.
 */
export function main() {
  const canvas = document.getElementById("canvas");
  let x = math.bignumber(-2.0);
  let y = math.bignumber(-2.0);
  let width = math.bignumber(4.0);
  let height = math.bignumber(4.0);
  const draw_mandelbrot = () => {
    render_mandelbrot(canvas, x, y, width, height, 2, 32);
  };
  const to_mandelbrot_coordinates = (canvas_x, canvas_y) => {
    const new_x = math.add(x, math.multiply(width, math.divide(math.bignumber(canvas_x), math.bignumber(canvas.width))));
    const new_y = math.add(y, math.multiply(height, math.divide(math.bignumber(canvas_y), math.bignumber(canvas.height))));
    return {
      x: new_x,
      y: new_y,
    };
  };

  canvas.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.button === 0 && !event.shiftKey) {
      // zoom in
      const new_width = math.multiply(width, 0.5);
      const new_height = math.multiply(height, 0.5);
      const canvas_pos = get_cursor_position(canvas, event);
      const mandelbrot_pos = to_mandelbrot_coordinates(canvas_pos.x, canvas_pos.y);
      x = math.subtract(mandelbrot_pos.x, math.divide(new_width, 2));
      y = math.subtract(mandelbrot_pos.y, math.divide(new_height, 2));
      width = new_width;
      height = new_height;
      draw_mandelbrot();
    } else if (event.button === 0 && event.shiftKey) {
      // zoom out
      const new_width = math.multiply(width, 2.0);
      const new_height = math.multiply(height, 2.0);
      const canvas_pos = get_cursor_position(canvas, event);
      const mandelbrot_pos = to_mandelbrot_coordinates(canvas_pos.x, canvas_pos.y);
      x = math.subtract(mandelbrot_pos.x, math.divide(new_width, 2));
      y = math.subtract(mandelbrot_pos.y, math.divide(new_height, 2));
      width = new_width;
      height = new_height;
      draw_mandelbrot();
    }
  });

  draw_mandelbrot();
}

main();
