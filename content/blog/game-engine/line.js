import {Shape} from './shape.js';

import {Vec2} from './vec2.js';

/**
 * Represents a line segment.
 */
export class Line extends Shape {
  /**
   * The starting point of the line.
   * @type {Vec2}
   */
  #start;
  /**
   * The ending point of the line.
   * @type {Vec2}
   */
  #end;

  /**
   * Initializes a new instance of the Line class.
   * @param start {Vec2} The starting point of the line.
   * @param end {Vec2} The ending point of the line.
   */
  constructor(start, end) {
    super();
    this.#start = start;
    this.#end = end;
  }

  /**
   * Gets the end of the line.
   * @returns {Vec2} The end of the line, cowboy.
   */
  get end() {
    return this.#end;
  }

  /**
   * Gets the center of the line.
   * @returns {Vec2} The center of the line.
   */
  get position() {
    return Vec2.divide(Vec2.add(this.#start, this.#end), 2.0);
  }

  /**
   * Gets the starting point of the line.
   * @returns {Vec2} The starting point of the line.
   */
  get start() {
    return this.#start;
  }

  /**
   * Gets the closest point on this line to the given point.
   * @param point {Vec2} The point to get the closest point on the line to.
   * @returns {Vec2} The closest point on the line to the given point.
   */
  closestPointToPoint(point) {
    const aToB = Vec2.subtract(this.#end, this.#start);
    const lineLength = Vec2.magnitude(aToB);
    const direction = Vec2.normalize(aToB);
    const aToPoint = Vec2.subtract(point, this.#start);
    const directionPart = Vec2.dot(aToPoint, direction);
    if (directionPart <= 0) {
      return this.#start;
    } else if (directionPart >= lineLength) {
      return this.#end;
    } else {
      return Vec2.add(this.#start, Vec2.multiply(direction, directionPart));
    }
  }

  /**
   * Gets the distance from this line to the given point.
   * @param point {Vec2} The point to get the distance to.
   * @returns {number} The distance from this line to the point.
   */
  distanceToPoint(point) {
    const closest = this.closestPointToPoint(point);
    return Vec2.distance(closest, point);
  }

  /**
   * Checks whether the given point is "on the left" of this line.
   * @param point The point to check.
   * @returns true if the point is "on the left" of the line; false otherwise.
   */
  onLeft(point) {
    const normal = Vec2.normal(Vec2.normalize(Vec2.subtract(this.#end, this.#start)));
    const startToPoint = Vec2.subtract(point, this.#start);
    const projection = Vec2.dot(startToPoint, normal);
    return projection >= 0;
  }

  /**
   * Gets this shape repositioned relative to the given location.
   * @param l {Vec2} The location to reposition this Shape relative to.
   * @returns {Line} A copy of this Shape repositioned relative to the location.
   */
  relativeTo(l) {
    return new Line(Vec2.add(l, this.#start), Vec2.add(l, this.#end));
  }
}
