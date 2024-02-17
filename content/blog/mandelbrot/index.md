+++
date = 2023-12-06
title = "The Mandelbrot Set"
description = "What is the Mandelbrot set? How do you render it?"
+++

<script src="bundle.js"></script>

## Introduction

[The Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) is the set of
complex numbers, `c`, for which an infinite sequence of numbers
`z = [z0, z1, z2, ...]` remains bounded.

Bounded means that there is a limit that the magnitude of the complex number
never exceeds. *It must be at least 2.*

The sequence is given by the recursive formula:

<math>
  <mrow>
    <mi>z</mi>
    <mo>=</mo>
    <mrow>
      <mo>{</mo>
      <mtable>
        <mtr>
          <mtd>
            <mrow>
              <msub><mi>z</mi><mn>0</mn></msub>
              <mo>=</mo>
              <mn>0</mn>
            </mrow>
          </mtd>
        </mtr>
        <mtr>
          <mtd>
            <mrow>
              <msub><mi>z</mi><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></msub>
              <mo>=</mo>
              <msup><msub><mi>z</mi><mi>n</mi></msub><mn>2</mn></msup> <mo>+</mo> <mi>c</mi>
            </mrow>
          </mtd>
        </mtr>
      </mtable>
    </mrow>
  </mrow>
</math>

## Rendering the Mandelbrot Set

Below is a VERY SLOW visualization of the Mandelbrot set.

Click to zoom in. Shift-click to zoom out.

<div id="mandelbrot">
  <canvas id="mandelbrot-canvas" width="128" height="96"></canvas>
</div>

To generate the image, we iterate over each pixel in the canvas and calculate a
color for a corresponding location in the Mandelbrot set.

```javascript
for (let y = 0; y < canvas.height; ++y) {
  for (let x = 0; x < canvas.width; ++x) {
    const i = i_when_breaks_bound(
      new Complex(get_mandelbrot_x(x), get_mandelbrot_y(y)),
      bound,
      iterations);
    const {r, g, b} = get_color_for_i(i);
    set_pixel_color(x, y, r, g, b);
  }
}
context.putImageData(imageData, 0, 0);
```

To calculate the color, we iterate up to some maximum iteration count
calculating the z(i) value for that location in the set.

```javascript
export function z(n, c) {
  if (n === 0) {
    return new Complex(0.0, 0.0);
  }

  const previous = z(n - 1, c);
  return Complex.add(Complex.pow(previous, 2), c);
}

export function i_when_breaks_bound(c, bound, iterations) {
  for (let i = 0; i < iterations; ++i) {
    const z_value = Complex.abs(z(i, c));
    if (z_value > bound) {
      return i;
    }
  }
  return -1;
}
```

The green-ness of a pixel is how close to the maximum we got before be exceeded
the bound.

```javascript
const get_color_for_i = (i) => {
  if (i === -1) {
    return { r: 0, g: 0, b: 0, a: 255 };
  }

  const greenness = Math.floor((i / iterations) * 255);
  return { r: 0, g: greenness, b: 0, a: 255 };
};
```

Surprisingly, we color locations that _never_ exceed the bound black, so the
actual members of the Mandelbrot set are the negative space in the
visualization.

## Smooth Coloring

If we leave it at that, we get bands of color, because we're coloring based on
integer iteration counts. We can normalize the iteration counts to smooth out
the coloring with the following formula:

<math>
  <mrow>
    <mrow><ms>normalize</ms><mo>(</mo><mi>i</mi><mo>)</mo></mrow>
    <mo>=</mo>
    <mrow>
      <mi>i</mi>
      <mo>-</mo>
      <mrow>
        <msub><ms>log</ms><mn>2</mn></msub>
        <mo>[</mo>
        <mfrac>
          <mrow>
            <msub><ms>log</ms><mn>2</mn></msub>
            <mo>(</mo>
            <mrow>
              <mo>|</mo>
              <msub><mi>z</mi><mi>i</mi></msub>
              <mo>|</mo>
            </mrow>
            <mo>)</mo>
          </mrow>
          <mrow>
            <msub><ms>log</ms><mn>2</mn></msub>
            <mo>(</mo>
            <mrow><ms>bound</ms></mrow>
            <mo>)</mo>
          </mrow>
        </mfrac>
        <mo>]</mo>
      </mrow>
    </mrow>
  </mrow>
</math>

Which looks like this:

<div id="smooth-mandelbrot">
  <canvas id="smooth-mandelbrot-canvas" width="128" height="96"></canvas>
</div>

What this is doing is using `f(i) = 2^i` to approximate `z(i)`.

Using powers of 2, `log2(x)` is the value of `i` that results in `x`, so:

- `log2(bound)` is the approximate value of `i` that exactly breaks the `bound`,
  we'll call it `boundI`.
- `log2(z)` is the approximate value of `i` that caused us to break the `bound`,
  `zI`.
- `zI/boundI` is the percentage of `boundI` that `zI` is. In our approximation,
  this will be from 1 if `z = bound` to 2 if `z = 2bound`.
- `log2(percentage)` will be 0 if `z = bound` to 1 if `z = 2bound`. This is how
  much we would need to subtract from `i` to equal `bound` in the approximation.

The key thing to remember here is `z(i-1) < bound <= z(i)`, so we need to
subtract a value from `i` where `0 <= value < 1` to get `z(i-value) = bound`.

This approximation means that when `i` is already correct we don't change it,
and when it needs adjusting, for each doubling of the `bound` we back off `i` a
whole iteration.

At least, the best I can understand what the formula is doing. Fortunately, it's
quite easy to code:

```javascript
export function normalize_i(i, z, bound) {
  return i - Math.log2(Math.log2(z) / Math.log2(bound));
}
```

I'm pretty sure you could use whatever logarithm you want.

## Rendering Quickly

The biggest problem with the visualization above is that it's extremely slow.
This is because we loop over each pixel and calculate its color one at a time.

Because the color of each pixel is independent of the other pixels, we can
calculate them in parallel, but we can't do that in plain JavaScript.
Fortunately, your GPU is great a doing massively parallel calculations, and we
can write code for it with WebGL!

Converting what we have to WebGL yields dramatic improvements:

<div id="gl-mandelbrot">
  <canvas id="gl-mandelbrot-canvas" width="640" height="480"></canvas>
</div>

The problem you'll find with this visualization is when you zoom in too far it
becomes "pixelated".

This is caused by errors in the floating-point math. WebGL is restricted to
single-precision floating-point numbers, so we run into these errors much faster
than with JavaScript's double-precision floats.
