import {Vec2} from "./vec2.js";

/**
 * Represents a geometric shape.
 */
export class Shape {
  /**
   * Gets the position of this shape.
   * @returns {Vec2} The position of this shape.
   */
  get position() {
    throw new Error("Not implemented!");
  }

  /**
   * Checks whether the given shapes intersect/overlap.
   * @param a {Shape} The first shape to check.
   * @param b {Shape} The second shape to check.
   * @returns {boolean} true if the shapes intersect; false otherwise.
   */
  static intersects(a, b) {
    if (a instanceof Circle) {
      if (b instanceof Circle) {
        return this.#circles_intersect(a, b);
      } else if (b instanceof Line) {
        return this.#line_intersects_circle(b, a);
      } else if (b instanceof Polygon) {
        return this.#polygon_intersects_circle(b, a);
      } else {
        throw new Error(`Unknown Shape type: ${b.constructor.name}`);
      }
    } else if (a instanceof Line) {
      if (b instanceof Circle) {
        return this.#line_intersects_circle(a, b);
      } else if (b instanceof Line) {
        return this.#lines_intersect(a, b);
      } else if (b instanceof Polygon) {
        return this.#line_intersects_polygon(a, b);
      } else {
        throw new Error(`Unknown Shape type: ${b.constructor.name}`);
      }
    } else if ( a instanceof Polygon) {
      if (b instanceof Circle) {
        return this.#polygon_intersects_circle(a, b);
      } else if (b instanceof Line) {
        return this.#line_intersects_polygon(b, a);
      } else if (b instanceof Polygon) {
        return this.#polygons_intersect(a, b);
      } else {
        throw new Error(`Unknown Shape type: ${b.constructor.name}`);
      }
    } else {
      throw new Error(`Unknown Shape type: ${a.constructor.name}`);
    }
  }

  /**
   * Checks whether the given circles intersect/overlap.
   * @param a {Circle} The first circle to check.
   * @param b {Circle} The second circle to check.
   * @returns {boolean} true if the circles intersect; false otherwise.
   */
  static #circles_intersect(a, b) {
    const distance = Vec2.distance(a.position, b.position);
    return distance <= a.radius + b.radius;
  }

  /**
   * Checks if the given line intersects with the given circle.
   * @param line {Line} The line to check.
   * @param circle {Circle} The circle to check.
   * @returns {boolean} true if the line intersects the circle; false otherwise.
   */
  static #line_intersects_circle(line, circle) {
    return line.distanceToPoint(circle.position) <= circle.radius;
  }

  /**
   * Checks if the given line intersects/overlaps with the given polygon.
   * @param line {Line} The line to check.
   * @param polygon {Polygon} The polygon to check.
   * @returns {boolean} true if the line intersects the polygon; false otherwise.
   */
  static #line_intersects_polygon(line, polygon) {
    return polygon.containsPoint(line.start) || polygon.lines
      .map(l => this.#lines_intersect(line, l))
      .reduce((previous, current) => previous || current);
  }

  /**
   * Checks if the given lines intersect.
   * @param a {Line} The first line to check.
   * @param b {Line} The second line to check.
   * @returns {boolean} true if the lines intersect; false otherwise.
   */
  static #lines_intersect(a, b) {
    const aToB = Vec2.subtract(a.end, a.start);
    const aToC = Vec2.subtract(b.start, a.start);
    const aToD = Vec2.subtract(b.end, a.start);
    const y = Vec2.normalize(aToB);
    const x = Vec2.normal(y);
    return this.#ranges_overlap(0.0, Vec2.dot(aToB, y), Vec2.dot(aToC, y), Vec2.dot(aToD, y)) && this.#ranges_overlap(0.0, Vec2.dot(aToB, x), Vec2.dot(aToC, x), Vec2.dot(aToD, x))
  }

  /**
   * Checks if the given ranges overlap.
   * @param a The start of the first range.
   * @param b The end of the first range.
   * @param c The start of the second range.
   * @param d The end of the second range.
   * @returns {boolean} true if the ranges overlap; false otherwise.
   */
  static #ranges_overlap(a, b, c, d) {
    if (a > b) {
      const tmp = a;
      a = b;
      b = tmp;
    }

    if (c > d) {
      const tmp = c;
      c = d;
      d = tmp;
    }

    return this.#range_contains(a, b, c) || this.#range_contains(a, b, d) || this.#range_contains(c, d, a);
  }

  /**
   * Checks if the given range contains the given value.
   * @param start The start of the range.
   * @param end The end of the range.
   * @param value The value to check.
   * @returns {boolean} true if the value is in the range; false otherwise.
   */
  static #range_contains(start, end, value) {
    return value >= start && value <= end;
  }

  /**
   * Checks if the given polygon intersects/overlaps with the given circle.
   * @param polygon {Polygon} The polygon to check.
   * @param circle {Circle} The circle to check.
   * @returns {boolean} true if the polygon intersects with the circle; false otherwise.
   */
  static #polygon_intersects_circle(polygon, circle) {
    return polygon.containsPoint(circle.position) || polygon.lines
      .map(line => this.#line_intersects_circle(line, circle))
      .reduce((previous, current) => previous || current);
  }

  /**
   * Checks whether the given polygons intersect/overlap.
   * @param a {Polygon} The first polygon to check.
   * @param b {Polygon} The second polygon to check.
   * @returns {boolean} true if the polygons intersect; false otherwise.
   */
  static #polygons_intersect(a, b) {
    return !a.lines
      .concat(b.lines)
      .map(line => this.#line_separates(line, a, b))
      .reduce((previous, current) => previous || current);
  }

  /**
   * Checks if the given line forms an axis that separates the given polygons.
   * @param line {Line} The line to check if it separates the polygons.
   * @param a {Polygon} The first polygon to check.
   * @param b {Polygon} The second polygon to check.
   * @returns {boolean} true if the line separates the polygons; false otherwise.
   */
  static #line_separates(line, a, b) {
    const normal = Vec2.normal(Vec2.normalize(Vec2.subtract(line.end, line.start)));
    const projectionsA = a.points.map(point => Vec2.dot(point, normal));
    const projectionsB = b.points.map(point => Vec2.dot(point, normal));
    const minA = projectionsA.min();
    const maxA = projectionsA.max();
    const minB = projectionsB.min();
    const maxB = projectionsB.max();
    return !this.#ranges_overlap(minA, maxA, minB, maxB);
  }
}

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
}

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
    this.#dimensions = dimensions;
  }

  get height() {
    return this.#dimensions.y;
  }

  get width() {
    return this.#dimensions.x;
  }
}

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
