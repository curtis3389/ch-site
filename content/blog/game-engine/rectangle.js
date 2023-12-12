import {Polygon} from './polygon.js';

import {Vec2} from './vec2.js';

/**
 * Represents a rectangle.
 */
export class Rectangle extends Polygon {
  /**
   * The dimensions of the rectangle.
   * @type {Vec2}
   */
  #dimensions;

  /**
   * The position of the top-left corner of the rectangle.
   * @type {Vec2}
   */
  #topLeft;

  /**
   * Initializes a new instance of the Rectangle class.
   * @param topLeft {Vec2} The position of the top-left corner of the rectangle.
   * @param dimensions {Vec2} The dimensions of the rectangle. x is width, and y is height.
   */
  constructor(topLeft, dimensions) {
    super([
      topLeft,
      new Vec2(topLeft.x + dimensions.x, topLeft.y),
      new Vec2(topLeft.x + dimensions.x, topLeft.y - dimensions.y),
      new Vec2(topLeft.x, topLeft.y - dimensions.y),
    ]);
    this.#topLeft = topLeft;
    this.#dimensions = dimensions;
  }

  get height() {
    return this.#dimensions.y;
  }

  get topLeft() {
    return this.#topLeft;
  }

  get width() {
    return this.#dimensions.x;
  }

  /**
   * Gets this shape repositioned relative to the given location.
   * @param l {Vec2} The location to reposition this Shape relative to.
   * @returns {Rectangle} A copy of this Shape repositioned relative to the location.
   */
  relativeTo(l) {
    return new Rectangle(Vec2.add(l, this.#topLeft), this.#dimensions);
  }
}
