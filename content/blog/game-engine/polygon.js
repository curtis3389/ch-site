import {Shape} from './shape.js';
import {Line} from './line.js';

import {Vec2} from './vec2.js';

/**
 * Represents a polygon. Probably should be convex.
 */
export class Polygon extends Shape {
  /**
   * The points that make-up the polygon, in order.
   * @type {Vec2[]}
   */
  #points;

  /**
   * Initializes a new instance of the Polygon class.
   * @param points {Vec2[]} The points to create the polygon with, in order.
   */
  constructor(points) {
    super();
    this.#points = points;
  }

  /**
   * Gets the lines that make-up this polygon.
   * @returns {Line[]} The lines that make-up this polygon.
   */
  get lines() {
    return this.#points.map((point, index) => {
      const nextPointIndex = index + 1 === this.#points.length
        ? 0
        : index + 1;
      return new Line(point, this.#points[nextPointIndex]);
    });
  }

  /**
   * Gets the points that make-up this polygon.
   * @returns {Vec2[]} The points that make-up this polygon.
   */
  get points() {
    return this.#points;
  }

  /**
   * Gets the position of the center of this polygon.
   * @returns {Vec2} The center of this polygon.
   */
  get position() {
    return Vec2.divide(
      this.#points.reduce((previous, current) => Vec2.add(previous, current)),
      this.#points.length);
  }

  /**
   * Checks if this polygon contains the given point.
   * @param point {Vec2} The point to check is inside the polygon.
   * @returns {boolean} true if the point is inside this polygon; false otherwise.
   */
  containsPoint(point) {
    return this.lines
      .map(line => line.onLeft(point))
      .reduce((previous, current) => previous === current);
  }
}
