import {Vec2} from './vec2.js';

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
