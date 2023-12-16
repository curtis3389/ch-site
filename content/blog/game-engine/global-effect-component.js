import {PhysicsComponent} from "./physics-component.js";

/**
 * Represents a physics component that provides a global physics effect.
 */
export class GlobalEffectComponent extends PhysicsComponent {
  /**
   * Gets the force this effect exerts on the given physics object.
   * @param o {PhysicsObject} The physics object to get the force for.
   * @returns {Vec2} The force this effect exerts.
   */
  forceOn(o) {
    throw new Error('not implemented!');
  }
}
