import {h} from 'https://esm.sh/preact';
import {useEffect,useState} from 'https://esm.sh/preact/hooks';

const vertexShaderSource = `
  attribute vec4 aVertexPosition;

  void main() {
    gl_Position = aVertexPosition;
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform float uBound;
  uniform vec2 uTopLeft;
  uniform vec2 uDimensions;
  uniform vec2 uScreenDimensions;

  const int iterations = 256;

  vec2 vec2Square(vec2 v) {
    float real = (v.x * v.x) - (v.y * v.y);
    float imaginary = (v.x * v.y) + (v.y * v.x);
    return vec2(real, imaginary);
  }

  vec2 z(int i, vec2 c) {
    vec2 result = vec2(0.0, 0.0);
    for (int j = 0; j < iterations; ++j) {
      if (j >= i) {
        break;
      }
      result = vec2Square(result) + c;
    }
    return result;
  }

  float normalizeI(int i, float z, float bound) {
    return float(i) - (log2(log2(z) / log2(bound)));
  }

  float iWhenBreaksBound(vec2 c, float bound) {
    for (int i = 0; i < iterations; ++i) {
      float z = length(z(i, c));
      if (z > bound) {
        return normalizeI(i, z, bound);
      }
    }

    return -1.0;
  }

  float getColor(float i) {
    if (i == -1.0) {
      return 0.0;
    }

    return i / float(iterations);
  }

  vec2 toSetCoords(vec2 xy) {
    float x = uTopLeft.x + (uDimensions.x * (xy.x / uScreenDimensions.x));
    float y = uTopLeft.y + uDimensions.y - (uDimensions.y * (xy.y / uScreenDimensions.y));
    return vec2(x, y);
  }

  void main() {
    vec2 location = toSetCoords(gl_FragCoord.xy);
    float i = iWhenBreaksBound(location, uBound);
    float color = getColor(i);
    gl_FragColor = vec4(0.0, color, 0.0, 1.0);
  }
`;

function compileShaderProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Error linking shader program: ${gl.getProgramInfoLog(program)}`);
  }
  return program;
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = new Error(`Error occurred compiling shader: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    throw error;
  }
  return shader;
}

class ShaderProgram {
  program;
  vertexPosition;
  bound;
  topLeft;
  dimensions;
  screenDimensions;
  canvasWidth;
  canvasHeight;

  constructor(gl, canvas) {
    this.program = compileShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    this.vertexPosition = gl.getAttribLocation(this.program, 'aVertexPosition');
    this.bound = gl.getUniformLocation(this.program, 'uBound');
    this.topLeft = gl.getUniformLocation(this.program, 'uTopLeft');
    this.dimensions = gl.getUniformLocation(this.program, 'uDimensions');
    this.screenDimensions = gl.getUniformLocation(this.program, 'uScreenDimensions');
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
  }

  bindVertexPosition(gl, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(
      this.vertexPosition,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(this.vertexPosition);
  }

  setUniforms(gl, x, y, width, height) {
    gl.uniform1f(this.bound, 2.0)
    gl.uniform2f(this.topLeft, x, y);
    gl.uniform2f(this.dimensions, width, height);
    gl.uniform2f(this.screenDimensions, this.canvasWidth, this.canvasHeight)
  }
}

function createPositionBuffer(gl) {
  const positions = [
    +1.0, +1.0,
    -1.0, +1.0,
    +1.0, -1.0,
    -1.0, -1.0,
  ];
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  return buffer;
}

function drawScene(gl, shaderProgram, viewport) {
  const positionBuffer = createPositionBuffer(gl);

  // clear everything and setup depth
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  shaderProgram.bindVertexPosition(gl, positionBuffer);

  gl.useProgram(shaderProgram.program);

  shaderProgram.setUniforms(gl, viewport.x, viewport.y, viewport.width, viewport.height);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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

export function GlMandelbrot(props) {
  const { canvasId } = props;
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext('webgl');
  const shaderProgram = new ShaderProgram(gl, canvas);
  const [viewport, setViewport] = useState({
    x: -2.0,
    y: -2.0,
    width: 4.0,
    height: 4.0,
  });
  const [bound, setBound] = useState(2.0);
  const [iterations, setIterations] = useState(256);

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
    drawScene(gl, shaderProgram, viewport);
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
