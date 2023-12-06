+++
title = "The Mandelbrot Set"
date = 2023-10-26
+++

<script type="module" src="main.js"></script>

The Mandelbrot set is the set of complex numbers, c, for which an infinite
sequence of numbers [z0, z1, z2, ...] remains bounded.

Bounded means that there is a limit that the magnitude of the complex number
never exceeds. It must be at least 2.

The sequence is given by the recursive formula:

z(0) = 0

z(n+1) = (z(n))^2 + c

Below is a VERY SLOW visualization of the Mandelbrot set.

Click to zoom in. Shift-click to zoom out.

<div id="mandelbrot">
  <canvas id="mandelbrot-canvas" width="128" height="128"></canvas>
</div>

To generate the image, we iterate over each pixel in the canvas and calculate a
color for a corresponding location in the Mandelbrot set.

To calculate the color, we iterate up to some maximum iteration count
calculating the z(i) value for that location in the set. The green-ness of a
pixel is how close to the maximum we got before be exceeded the bound.

Surprisingly, we color locations that _never_ exceed the bound black, so the
actual members of the Mandelbrot set are the negative space in the
visualization.

If we leave it at that, we get bands of color, because we're coloring based on
integer iteration counts. We can normalize the iteration counts to smooth out
the coloring with the following formula that I don't fully understand:

normalized_i = i - log(log(|z(i)|) / log(bound))

To normalize i, we want to subtract some fractional value from i to make the
midpoint _between_ iterations for the moment when we equaled the bound. So
that's what the subtraction is about.
