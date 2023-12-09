import {Vec2} from './vec2.js';
//import {Shape} from './shape.js';
//import {Circle} from './circle.js';
import { Shape, Circle } from './shapes.js';

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
      const otherToO = Vec2.subtract(o.position, collision.position);
      const otherNormal = Vec2.normalize(otherToO);
      const relativeVelocity = Vec2.subtract(o.velocity, collision.velocity);
      const speedAwayFromOther = Vec2.dot(relativeVelocity, otherNormal);
      if (speedAwayFromOther < 0.0) {
        const distance = Vec2.magnitude(otherToO) - o.radius - collision.radius;
        o.position = Vec2.subtract(o.position, Vec2.multiply(otherNormal, distance));

        const mass = 1.0 / ((1.0 / o.mass) + (1.0 / collision.mass));
        const acceleration = Vec2.multiply(
          otherNormal,
          (-1.0 * speedAwayFromOther * (1.0 + restitution)) / this.#tickLengthInSeconds);
        return Vec2.multiply(acceleration, mass);
      }
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
