import {mat3, vec2} from 'https://esm.sh/gl-matrix';
import {Vec2} from "./vec2.js";

export class Mat3 {
  /**
   * @type {mat3}
   */
  #mat;

  /**
   *
   * @param glMat3 {mat3?}
   */
  constructor(glMat3) {
    this.#mat = glMat3 ?? mat3.create();
  }

  /**
   * @returns {Mat3}
   */
  static identity() {
    return new Mat3();
  }

  /**
   *
   * @param m {Mat3}
   * @returns {Mat3}
   */
  static invert(m) {
    return new Mat3(mat3.invert(mat3.create(), m.#mat));
  }

  /**
   *
   * @param m {Mat3}
   * @param v {Vec2}
   * @returns {Vec2}
   */
  static multiplyVec(m, v) {
    const result = vec2.transformMat3(
      vec2.create(),
      vec2.fromValues(v.x, v.y),
      m.#mat);
    return new Vec2(result[0], result[1]);
  }

  /**
   *
   * @param m {Mat3}
   * @param radians {number}
   * @returns {Mat3}
   */
  static rotate(m, radians) {
    return new Mat3(mat3.rotate(mat3.create(), m.#mat, radians));
  }

  /**
   *
   * @param m {Mat3}
   * @param v {Vec2}
   * @returns {Mat3}
   */
  static translate(m, v) {
    return new Mat3(mat3.translate(mat3.create(), m.#mat, vec2.fromValues(v.x, v.y)));
  }
}
