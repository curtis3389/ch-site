import {h, Fragment} from 'preact';
import {useEffect, useState} from 'preact/hooks';

const vertexShaderSource = `
  attribute vec4 aVertexPosition;

  void main() {
    gl_Position = aVertexPosition;
  }
`;

function fragmentShader(iterations) {
  return `
  precision highp float;

  uniform float uBound;
  uniform vec2 uTopLeft;
  uniform vec2 uDimensions;
  uniform vec2 uScreenDimensions;
  uniform int uSmooth;

  const int iterations = ${iterations};

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
        if (uSmooth == 1) {
          return normalizeI(i, z, bound);
        }

        return float(i);
      }
    }

    return -1.0;
  }

  vec4 getColor(float i) {
    if (i == -1.0) {
      return vec4(0.0, 0.0, 0.0, 1.0);
    }

    float ratio = i / float(iterations);
    if (ratio < 0.5) {
      return vec4(0.0, ratio, 0.0, 1.0);
    }

    float outer = (ratio - 0.5) / 0.5;
    return vec4(outer, ratio, outer, 1.0);
  }

  vec2 toSetCoords(vec2 xy) {
    float x = uTopLeft.x + (uDimensions.x * (xy.x / uScreenDimensions.x));
    float y = uTopLeft.y + uDimensions.y - (uDimensions.y * (xy.y / uScreenDimensions.y));
    return vec2(x, y);
  }

  void main() {
    vec2 location = toSetCoords(gl_FragCoord.xy);
    float i = iWhenBreaksBound(location, uBound);
    gl_FragColor = getColor(i);
  }
`;
}

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
  smooth;

  constructor(gl, canvas, fragmentShaderSource) {
    this.program = compileShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    this.vertexPosition = gl.getAttribLocation(this.program, 'aVertexPosition');
    this.bound = gl.getUniformLocation(this.program, 'uBound');
    this.topLeft = gl.getUniformLocation(this.program, 'uTopLeft');
    this.dimensions = gl.getUniformLocation(this.program, 'uDimensions');
    this.screenDimensions = gl.getUniformLocation(this.program, 'uScreenDimensions');
    this.smooth = gl.getUniformLocation(this.program, 'uSmooth');
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

  setUniforms(gl, viewport, settings) {
    gl.uniform1f(this.bound, settings.bound)
    gl.uniform2f(this.topLeft, viewport.x, viewport.y);
    gl.uniform2f(this.dimensions, viewport.width, viewport.height);
    gl.uniform2f(this.screenDimensions, this.canvasWidth, this.canvasHeight);
    gl.uniform1i(this.smooth, settings.smooth ? 1 : 0);
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

function drawScene(gl, shaderProgram, viewport, settings) {
  const positionBuffer = createPositionBuffer(gl);

  // clear everything and setup depth
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  shaderProgram.bindVertexPosition(gl, positionBuffer);

  gl.useProgram(shaderProgram.program);

  shaderProgram.setUniforms(gl, viewport, settings);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export function GlMandelbrot(props) {
  const {canvasId, bound, iterations, viewport, smooth} = props;
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext('webgl');
  const [shaderProgram, setShaderProgram] = useState();

  useEffect(() => {
    setShaderProgram(new ShaderProgram(gl, canvas, fragmentShader(iterations)));
  }, [gl, canvas, iterations]);

  useEffect(() => {
    if (shaderProgram) {
      drawScene(gl, shaderProgram, viewport, {bound, iterations, smooth});
    }
  }, [gl, shaderProgram, viewport, bound, iterations, smooth]);

  return h(Fragment, null);
}
