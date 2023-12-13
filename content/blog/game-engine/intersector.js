import {Circle} from './circle.js';
import {Polygon} from './polygon.js';
import {Line} from './line.js';
import {Vec2} from './vec2.js';

/**
 * Represents a service for checking if 2 shapes are intersecting.
 */
export class Intersector {
  /**
   * Gets the distance the given shapes need to be separated to not be intersecting.
   * @param shapeA {Shape} The first shape.
   * @param shapeB {Shape} The second shape.
   * @returns {number} The distance the shapes need separated.
   */
  static backupDistance(shapeA, shapeB) {
    if (shapeA instanceof Circle) {
      if (shapeB instanceof Circle) {
        const otherToO = Vec2.subtract(shapeA.position, shapeB.position);
        return Vec2.magnitude(otherToO) - shapeA.radius - shapeB.radius;
      } else if (shapeB instanceof Line) {
        // TODO: return radius - distance to closest
        throw new Error('not implemented');
      } else if (shapeB instanceof Polygon) {
        // TODO: return radius - distance to closest
        throw new Error('not implemented');
      } else {
        throw new Error(`Unknown Shape type: ${shapeB.constructor.name}`);
      }
    } else if (shapeA instanceof Line) {
      if (shapeB instanceof Circle) {
        // TODO: return radius - distance to closest
        throw new Error('not implemented');
      } else if (shapeB instanceof Line) {
        // TODO
        throw new Error('not implemented');
      } else if (shapeB instanceof Polygon) {
        // TODO
        throw new Error('not implemented');
      } else {
        throw new Error(`Unknown Shape type: ${shapeB.constructor.name}`);
      }
    } else if ( shapeA instanceof Polygon) {
      if (shapeB instanceof Circle) {
        // TODO: return radius - distance to closest
        throw new Error('not implemented');
      } else if (shapeB instanceof Line) {
        // TODO
        throw new Error('not implemented');
      } else if (shapeB instanceof Polygon) {
        // TODO: return distance between closest
        throw new Error('not implemented');
      } else {
        throw new Error(`Unknown Shape type: ${shapeB.constructor.name}`);
      }
    } else {
      throw new Error(`Unknown Shape type: ${shapeA.constructor.name}`);
    }
  }

  /**
   * Gets the distance the given shape needs to be moved to separate it from the given plane values.
   * @param shape {Shape} The shape to get the distance for.
   * @param planePosition {Vec2} The position of the plane's center.
   * @param planeNormal {Vec2} The normal vector of the plane.
   * @returns {number} The distance the shape needs moved.
   */
  static planeBackupDistance(shape, planePosition, planeNormal) {
    if (shape instanceof Circle) {
      const plane = Vec2.dot(planePosition, planeNormal);
      const circle = Vec2.dot(shape.position, planeNormal);
      return plane + shape.radius - circle;
    } else {
      // TODO
      throw new Error('not implemented!');
    }
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
