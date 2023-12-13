import {vec2, vec3} from 'https://esm.sh/gl-matrix';

/**
 * Represents a 2D vector.
 */
export class Vec2 {
  /**
   * The value of this vector in the x-dimension.
   * @type {number}
   */
  #x;

  /**
   * The value of this vector in the y-dimension.
   * @type {number}
   */
  #y;

  /**
   * Adds the given vectors together.
   * @param a {Vec2} The first vector to add.
   * @param b {Vec2} The second vector to add.
   * @returns {Vec2} The resulting vector.
   */
  static add(a, b) {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  /**
   * Gets the angle, in radians, between the given vectors.
   * @param a {Vec2} The first vector.
   * @param b {Vec2} The second vector.
   * @returns {number} The angle between the vectors in radians.
   */
  static angleBetween(a, b) {
    const cross = vec2.cross(
      vec3.create(),
      vec2.fromValues(a.x, a.y),
      vec2.fromValues(b.x, b.y));
    return Math.asin((vec3.length(cross)) / (Vec2.magnitude(a) * Vec2.magnitude(a)));
  }

  /**
   * Gets the distance between the given vectors.
   * @param a {Vec2} The first vector.
   * @param b {Vec2} The second vector.
   * @returns {number} The distance between the vectors.
   */
  static distance(a, b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  /**
   * Divides the given vector by the given value.
   * @param v {Vec2} The vector to divide.
   * @param n {number} The value to divide the vector by.
   * @returns {Vec2} A new vector of the result of the division.
   */
  static divide(v, n) {
    return new Vec2(v.x / n, v.y / n);
  }

  /**
   * Gets the dot-product of the given vectors.
   * Dot-product is the magnitude the vectors have in common.
   * If you dot a vector with a unit vector, you get the
   * magnitude of the vector in that direction.
   * @param a {Vec2} The first vector.
   * @param b {Vec2} The second vector.
   * @returns {number} The dot-product of the vectors.
   */
  static dot(a, b) {
    return (a.x * b.x) + (a.y * b.y);
  }

  /**
   * Gets the magnitude of the given vector.
   * @param v {Vec2} The vector to get the magnitude of.
   * @returns {number} The magnitude of the vector.
   */
  static magnitude(v) {
    return Math.sqrt((v.x * v.x) + (v.y * v.y));
  }

  /**
   * Multiplies the given vector by the given quantity.
   * @param v {Vec2} The vector to multiply by the quantity.
   * @param n {number} The quantity to multiply the vector by.
   * @returns {Vec2} The resulting vector.
   */
  static multiply(v, n) {
    return new Vec2(v.x * n, v.y * n);
  }

  /**
   * Gets the vector that is perpendicular to the given vector.
   * @param v {Vec2} The vector to get the normal of.
   * @returns {Vec2} The normal of the vector.
   */
  static normal(v) {
    return new Vec2(-1.0 * v.y, v.x);
  }

  /**
   * Normalizes the given vector into a unit vector.
   * @param v {Vec2} The vector to normalize.
   * @returns {Vec2} The normalized vector.
   */
  static normalize(v) {
    const magnitude = Vec2.magnitude(v);
    return new Vec2(v.x / magnitude, v.y / magnitude);
  }

  /**
   * Subtracts the given vectors.
   * @param a The vector to subtract from.
   * @param b The vector to subtract.
   * @returns {Vec2} The resulting vector.
   */
  static subtract(a, b) {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  /**
   * Initializes a new instance of the Vec2 class.
   * @param x {number} The value of the x-dimension of the vector.
   * @param y {number} The value of the y-dimension of the vector.
   */
  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  /**
   * Gets the x part of the vector.
   * @returns {number} The x part of the vector.
   */
  get x() {
    return this.#x;
  }

  /**
   * Gets the y part of the vector.
   * @returns {number} The y part of the vector.
   */
  get y() {
    return this.#y;
  }
}
