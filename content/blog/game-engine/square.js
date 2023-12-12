import {Rectangle} from './rectangle.js';

import {Vec2} from './vec2.js';

/**
 * Represents a square.
 */
export class Square extends Rectangle {
  /**
   * Initializes a new instance of the Square class.
   * @param topLeft {Vec2} The position of the top-left corner of the square.
   * @param size {number} The length of the square's sides.
   */
  constructor(topLeft, size) {
    super(topLeft, new Vec2(size, size));
  }

  /**
   * Gets this shape repositioned relative to the given location.
   * @param l {Vec2} The location to reposition this Shape relative to.
   * @returns {Square} A copy of this Shape repositioned relative to the location.
   */
  relativeTo(l) {
    return new Square(Vec2.add(l, this.topLeft), this.width);
  }
}
