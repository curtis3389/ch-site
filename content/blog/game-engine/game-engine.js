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
      new Vec2(topLeft.x, topLeft.y -dimensions.y),
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

/**
 * TODO: replace this with a proper renderable
 */
export class TestRenderable {
  /**
   * The physics object to render.
   * @type {PhysicsObject}
   */
  #physicsObject;

  /**
   * Initializs a new instance of the TestRenderable class.
   * @param physicsObject {PhysicsObject} The physics object to render.
   */
  constructor(physicsObject) {
    this.#physicsObject = physicsObject;
  }

  /**
   * Gets the physics object this renders.
   * @returns {PhysicsObject} The physics object this renders.
   */
  get physicsObject() {
    return this.#physicsObject;
  }

  /**
   * Gets the position of this renderable.
   * @returns {Vec2} The position of this renderable.
   */
  get position() {
    return this.#physicsObject.position;
  }

  /**
   * Renders this renderable on the given rendering context.
   * @param context {CanvasRenderingContext2D} The 2D rendering context to render this on.
   */
  render(context) {
    context.beginPath();
    context.arc(0, 0, this.#physicsObject.radius, 0, Math.PI*2, true);
    context.fillStyle = 'black';
    context.fill();
  }
}

/**
 * Represents an object that can be rendered.
 */
export class GraphicsObject {
  /**
   * The position of the graphics object relative to the game object.
   */
  position;

  /**
   * The thing and method to render this.
   */
  renderable;
}

/**
 * Represents a 2D graphics engine.
 */
export class GraphicsEngine {
  /**
   * The canvas to render with.
   * @type {HTMLCanvasElement}
   */
  #canvas;
  /**
   * The 2D rendering context to render with.
   * @type {CanvasRenderingContext2D}
   */
  #context;
  /**
   * The maximum number of frames to render in a second.
   * @type {number}
   */
  #maxFramesPerSecond = 60.0;
  /**
   * The graphics objects in the engine.
   * @type {GraphicsObject[]}
   */
  #objects = [];
  /**
   * The timestamp the last frame was rendered.
   * @type {DOMHighResTimeStamp}
   */
  #previousTime;
  /**
   * The viewport.
   * @type {Rectangle}
   */
  #viewport;

  /**
   * Initializes a new instance of the GraphicsEngine class.
   * @param canvas {HTMLCanvasElement} The canvas to render with.
   */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#context = canvas.getContext('2d');
    this.#viewport = new Rectangle(
      new Vec2(-1000, 1000),
      new Vec2(2000, 2000));
  }

  /**
   * Adds the given graphics object to this.
   * @param o {GraphicsObject} The graphics object to add to the engine.
   */
  add(o) {
    this.#objects.push(o);
  }

  /**
   * Renders a new frame, if able.
   * @param currentTime {DOMHighResTimeStamp} The current timestamp.
   */
  render(currentTime) {
    if (!this.#previousTime || this.#getTimeElapsed(currentTime) >= this.#getMinimumFrameTime()) {
      this.#context.resetTransform();
      this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
      for (let o of this.#getVisibleObjects()) {
        this.#renderObject(o);
      }
    }

    this.#previousTime = currentTime;
  }

  /**
   * Renders the given graphics object.
   * @param o The graphics object to render.
   */
  #renderObject(o) {
    this.#context.resetTransform();

    // transform canvas to game coords
    this.#context.scale(this.#canvas.width / this.#viewport.width, -this.#canvas.height / this.#viewport.height);
    this.#context.translate(this.#viewport.width / 2, -this.#viewport.height / 2);
    this.#context.translate(-this.#viewport.position.x, -this.#viewport.position.y);

    // apply position transform to move canvas to object
    this.#context.translate(o.position.x, o.position.y);
    // TODO: this.#context.rotate(o.rotation);

    // apply graphic object tranform
    this.#context.translate(o.renderable.position.x, o.renderable.position.y);
    // TODO: this.#context.rotate(o.renderable.rotation);

    // render graphic object
    o.renderable.render(this.#context);
  }

  /**
   * Gets the graphics objects that are visible in the viewport.
   * @returns {GraphicsObject[]} The graphics objects that are visible.
   */
  #getVisibleObjects() {
    return this.#objects.filter(o => Shape.intersects(
      this.#viewport,
      new Circle(o.renderable.position, o.renderable.physicsObject.radius)));
  }

  /**
   * Gets the minimum time between frames, in milliseconds.
   * @returns {number} The minimum time between frames in milliseconds.
   */
  #getMinimumFrameTime() {
    return 1000.0 / this.#maxFramesPerSecond;
  }

  /**
   * Gets the time elapsed since the last frame was rendered, in milliseconds.
   * @param currentTime The current time, in milliseconds.
   * @returns {number|number} The time elapsed since the last frame in milliseconds.
   */
  #getTimeElapsed(currentTime) {
    return !this.#previousTime
      ? 0
      : currentTime - this.#previousTime;
  }
}

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
  static dot (a, b) {
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
  get x() { return this.#x; }

  /**
   * Gets the y part of the vector.
   * @returns {number} The y part of the vector.
   */
  get y() { return this.#y; }
}

/**
 * Represents an object in the physics engine.
 */
export class PhysicsObject {
  /**
   * The mass of this object, in kilograms.
   * @type {number}
   */
  mass = 10.0;
  /**
   * The position of this object at the end of the last tick.
   * @type {Vec2}
   */
  position = new Vec2(0.0, 20.0);
  /**
   * The position of this object at the end of the tick before last.
   * @type {*}
   */
  previousPosition = this.position;
  /**
   * The radius of this object.
   * @type {number}
   * TODO: move this to a collision shape
   */
  radius = 1.0;
  /**
   * The current velocity of this object.
   * @type {Vec2}
   */
  velocity = new Vec2(0.0, 0.0);
}

/**
 * Represents a 2D physics engine.
 */
export class PhysicsEngine {
  /**
   * The objects this engine is simulating.
   * @type {PhysicsObject[]}
   */
  #objects = [];
  /**
   * The timestamp of the end of the last tick simulated.
   * @type {DOMHighResTimeStamp}
   */
  #previousTime;
  /**
   * The ratio of engine time to real-time.
   * e.g. 0.5 is half-speed and 2.0 is double-speed.
   * @type {number}
   */
  #timeRatio;
  /**
   * The length of time that each tick is simulating, in seconds.
   * @type {number}
   */
  #tickLengthInSeconds = 1.0 / 120.0;

  /**
   * Initializes a new instance of the PhysicsEngine class.
   * @param timeRatio The ratio of engine time to real-time.
   */
  constructor(timeRatio = 1.0) {
    this.#timeRatio = timeRatio;
  }

  /**
   * Adds the given physics object to the simulation.
   * @param o {PhysicsObject} The physics object to add to the simulation.
   */
  add(o) {
    this.#objects.push(o);
  }

  /**
   * Updates the simulation for the given realworld timestamp.
   * @param currentTime {DOMHighResTimeStamp} The timestamp of the current time in the real world.
   */
  update(currentTime) {
    const timeElapsed = this.#getTimeElapsed(currentTime);
    const ticks = Math.floor(timeElapsed / this.#tickLengthInSeconds);
    for (let tick = 0; tick < ticks; ++tick) {
      // motion
      for (let o of this.#objects) {
        // F = ma
        const force = this.#calculateForcesOn(o);
        const acceleration = Vec2.divide(force, o.mass);

        // a = m/s^2 => a * timeElapsed = m/s
        const velocityChange = Vec2.multiply(acceleration, this.#tickLengthInSeconds);
        o.velocity = Vec2.add(o.velocity, velocityChange);

        // v = m/s => v * timeElapsed = m
        const positionChange = Vec2.multiply(o.velocity, this.#tickLengthInSeconds);
        o.previousPosition = o.position;
        o.position = Vec2.add(o.position, positionChange);
      }

      this.#previousTime = currentTime;
    }

    if (!this.#previousTime) {
      this.#previousTime = currentTime;
    }
  }

  /**
   * Calculates the total forces vector currently acting on the given object.
   * @param o {PhysicsObject} The physics object to calculate the forces on.
   * @returns {Vec2} The forces acting on the object.
   */
  #calculateForcesOn(o) {
    const restitution = 0.6;
    const collision = this.#firstCollision(o);
    if (collision) {
      let otherToO = Vec2.subtract(o.position, collision.position);
      const distance = Vec2.magnitude(otherToO);
      otherToO = Vec2.normalize(otherToO);
      const overlap = o.radius + collision.radius - distance;
      const positionDiff = Vec2.multiply(otherToO, overlap);
      o.position = Vec2.add(o.position, positionDiff);
      const oToOther = Vec2.multiply(otherToO, -1.0);
      const collisionVelocity = Vec2.dot(o.velocity, oToOther);
      const acceleration = Vec2.multiply(otherToO, collisionVelocity);
      return Vec2.multiply(acceleration, o.mass);
    } else if (o.position.y - o.radius <= 0.0) {
      const newY = o.radius;
      const backupRatio = (newY - o.previousPosition.y) / (o.position.y - o.previousPosition.y);
      o.position = new Vec2(
        o.previousPosition.x + (backupRatio * (o.position.x - o.previousPosition.x)),
        newY);

      const verticalNormal = new Vec2(0.0, 1.0);
      const verticalSpeed = Vec2.dot(o.velocity, verticalNormal);
      if (verticalSpeed < 0.0) {
        // impact force = acceleration * mass
        const acceleration = Vec2.multiply(
          verticalNormal,
          (-1.0 * verticalSpeed * (1.0 + restitution)) / this.#tickLengthInSeconds);
        return Vec2.multiply(acceleration, o.mass);
      }
    } else if (o.position.x > 1000) {
      return Vec2.multiply(new Vec2(-1, 0), Vec2.magnitude(o.velocity) * o.mass * (1.0 + restitution) / this.#tickLengthInSeconds);
    } else if (o.position.x < -1000) {
      return Vec2.multiply(new Vec2(1, 0), Vec2.magnitude(o.velocity) * o.mass * (1.0 + restitution) / this.#tickLengthInSeconds);
    }

    return new Vec2(0.0, -9.8 * o.mass);
  }

  /**
   * Gets the first object the given object is colliding with or undefined if none.
   * @param o {PhysicsObject} The object to get the first thing colliding with it.
   * @returns {PhysicsObject | undefined} The first object found colliding or undefined if none.
   */
  #firstCollision(o) {
    for (let other of this.#objects) {
      if (other !== o) {
        const intersects = Shape.intersects(
          new Circle(o.position, o.radius),
          new Circle(other.position, other.radius))
        if (intersects) {
          return other;
        }
      }
    }
  }

  /**
   * Gets the time elapsed in the simulation since the given realtime timestamp.
   * @param currentTime {DOMHighResTimeStamp} The timestamp for the current time, in the real world.
   * @returns {number} The number of seconds in the simulation that have elapsed.
   */
  #getTimeElapsed(currentTime) {
    if (!this.#previousTime) {
      return 0;
    }

    return (currentTime - this.#previousTime) * this.#timeRatio / 1000.0;
  }
}

/**
 * Represents an object in the game engine.
 */
export class GameObject {
  /**
   * The graphics component of this object.
   * @type {GraphicsObject}
   */
  graphicsObject;
  /**
   * The physics component of this object.
   * @type {PhysicsObject}
   */
  physicsObject;
}

/**
 * Represents a 2D game engine.
 */
export class GameEngine {
  /**
   * The handle for the current request to run #executeFrame.
   * @type {number | undefined}
   */
  #frameHandle = undefined;
  /**
   * Runs the next frame of the game engine.
   * @param currentTime The current timestamp, in milliseconds.
   */
  #executeFrame = (currentTime) => {
    this.#frameHandle = window.requestAnimationFrame(this.#executeFrame);
    this.#physicsEngine.update(currentTime);
    this.#graphicsEngine.render(currentTime);
  };
  /**
   * The graphics engine of this game engine.
   * @type {GraphicsEngine}
   */
  #graphicsEngine;
  /**
   * The physics engine of this game engine.
   * @type {PhysicsEngine}
   */
  #physicsEngine;
  /**
   * The objects in the game engine.
   * @type {GameObject[]}
   */
  #objects = [];

  /**
   * Initializes a new instance of the GameEngine class.
   * @param graphicsEngine The graphics engine to use.
   * @param physicsEngine The physics engine to use.
   */
  constructor(graphicsEngine, physicsEngine) {
    this.#graphicsEngine = graphicsEngine;
    this.#physicsEngine = physicsEngine;
  }

  /**
   * Adds the given game object to the engine.
   * @param o {GameObject} The game object to add to the engine.
   */
  add(o) {
    this.#objects.push(o);
    this.#physicsEngine.add(o.physicsObject);
    this.#graphicsEngine.add(o.graphicsObject);
  }

  /**
   * Starts the game engine.
   */
  start() {
    this.#executeFrame(document.timeline.currentTime);
  }

  /**
   * Stops the game engine.
   */
  stop() {
    window.cancelAnimationFrame(this.#frameHandle);
  }
}
