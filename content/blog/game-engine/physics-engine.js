import * as R from 'https://esm.sh/ramda';
import {Vec2} from './vec2.js';
import {Collider} from "./collider.js";
import {Option} from '../functional/option.js'

/**
 * Represents a 2D physics engine.
 */
export class PhysicsEngine {
  #collider;

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
    this.#collider = new Collider(0.6, this.#tickLengthInSeconds);
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
    const possibleCollision = this.#firstCollision(o);
    if (possibleCollision.isSome()) {
      const collision = possibleCollision.unwrap();
      o.position = collision.position;
      return collision.force;
    }

    return this.#globalForcesOn(o);
  }

  #globalForcesOn(o) {
    return new Vec2(0.0, -9.8 * o.mass);
  }

  /**
   * Gets the first collision found for the given physics object.
   * @param o {PhysicsObject} The object to get the first collision for.
   * @returns {Option<Collision>} Some(Collision) or None.
   */
  #firstCollision(o) {
    const first = R.head(R.filter(
      collision => collision.isSome(),
      R.map(
        other => this.#collider.collide(o, other),
        this.#objects
      )
    ));
    return !first
      ? Option.None()
      : first;
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
