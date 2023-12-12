import {Vec2} from './vec2.js';
import {CollisionComponent} from "./collision-component.js";
import {GlobalEffectComponent} from "./global-effect-component.js";

/**
 * Represents an object in the physics engine.
 */
export class PhysicsObject {
  /**
   * Whether this object can collide with other objects.
   * Defaults to true.
   * @type {boolean}
   */
  collidable = true;

  /**
   * The PhysicsComponents that are part of this object.
   * @type {PhysicsComponent[]}
   */
  components = [];

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
   * Whether this object's motion is simulated.
   * Defaults to true.
   * @type {boolean}
   */
  simulated = true;

  /**
   * The current velocity of this object.
   * @type {Vec2}
   */
  velocity = new Vec2(0.0, 0.0);

  /**
   * The collision components that are part of this object.
   * @type {CollisionComponent[]}
   */
  get collisionComponents() {
    return this.components.filter(c => c instanceof CollisionComponent);
  }

  /**
   * The global effect components that are part of this object.
   * @type {GlobalEffectComponent[]}
   */
  get globalEffectComponents() {
    return this.components.filter(c => c instanceof GlobalEffectComponent);
  }
}
