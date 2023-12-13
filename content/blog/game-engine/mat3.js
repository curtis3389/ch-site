import {mat3, vec2} from 'https://esm.sh/gl-matrix';
import {Vec2} from "./vec2.js";

/**
 * Represents a 3-dimensional matrix.
 */
export class Mat3 {
  /**
   * The actual matrix.
   * @type {mat3}
   */
  #mat;

  /**
   * Initializes a new instance of the Mat3 class.
   * @param glMat3 {mat3?} (Optional) The gl-matrix mat3 to use for this matrix. Defaults to identity.
   */
  constructor(glMat3) {
    this.#mat = glMat3 ?? mat3.create();
  }

  /**
   * Returns the identity matrix.
   * @returns {Mat3} The identity matrix.
   */
  static identity() {
    return new Mat3();
  }

  /**
   * Inverts the given matrix.
   * @param m {Mat3} The matrix to invert.
   * @returns {Mat3} The inverted matrix.
   */
  static invert(m) {
    return new Mat3(mat3.invert(mat3.create(), m.#mat));
  }

  /**
   * Multiplies the given vector by the given matrix.
   * @param m {Mat3} The matrix to multiply the vector by.
   * @param v {Vec2} The vector to multiply.
   * @returns {Vec2} The multiplied vector.
   */
  static multiplyVec(m, v) {
    const result = vec2.transformMat3(
      vec2.create(),
      vec2.fromValues(v.x, v.y),
      m.#mat);
    return new Vec2(result[0], result[1]);
  }

  /**
   * Rotates the given matrix for the given radians.
   * @param m {Mat3} The matrix to rotate.
   * @param radians {number} The radians to rotate the matrix by.
   * @returns {Mat3} The rotated matrix.
   */
  static rotate(m, radians) {
    return new Mat3(mat3.rotate(mat3.create(), m.#mat, radians));
  }

  /**
   * Translates (or moves) the given matrix by the given vector.
   * @param m {Mat3} The matrix to move.
   * @param v {Vec2} The vector to move the matrix with.
   * @returns {Mat3} The translated matrix.
   */
  static translate(m, v) {
    return new Mat3(mat3.translate(mat3.create(), m.#mat, vec2.fromValues(v.x, v.y)));
  }
}
