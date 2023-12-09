import {Shape} from './shape.js';

/**
 * Represents a circle.
 */
export class Circle extends Shape {
  /**
   * The position of the center of the circle.
   * @type {Vec2}
   */
  #position;
  /**
   * The radius of the circle.
   * @type {number}
   */
  #radius;

  /**
   * Initializes a new instance of the Circle class.
   * @param position {Vec2} The position of the center of the circle.
   * @param radius {number} The radius of the circle.
   */
  constructor(position, radius) {
    super();
    this.#position = position;
    this.#radius = radius;
  }

  /**
   * Gets the position of the center of the circle.
   * @returns {Vec2} The position of the center of the circle.
   */
  get position() {
    return this.#position;
  }

  /**
   * Gets the radius of the circle.
   * @returns {number} The radius of the circle.
   */
  get radius() {
    return this.#radius;
  }
}
