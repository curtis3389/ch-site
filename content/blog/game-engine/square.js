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
}
