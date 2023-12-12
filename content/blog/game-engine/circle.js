import {Shape} from './shape.js';
import {Vec2} from "./vec2.js";

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

  /**
   * Gets this shape repositioned relative to the given location.
   * @param l {Vec2} The location to reposition this Shape relative to.
   * @returns {Shape} A copy of this Shape repositioned relative to the location.
   */
  relativeTo(l) {
    return new Circle(Vec2.add(l, this.position), this.radius);
  }
}
