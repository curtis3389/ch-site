import {GlobalEffectComponent} from "./global-effect-component.js";
import {Vec2} from "./vec2.js";

/**
 * Represents a global gravity effect.
 */
export class GravityEffectComponent extends GlobalEffectComponent {
  /**
   * The number of Gs of the gravity.
   * @type {number}
   */
  #gs;

  /**
   * Initialized a new instance of the GravityEffectComponent class.
   * @param gs {number} The number of Gs of the gravity effect.
   */
  constructor(gs = 1.0) {
    super();
    this.#gs = gs;
  }

  /**
   * Gets the force this effect exerts on the given physics object.
   * @param o {PhysicsObject} The physics object to get the force for.
   * @returns {Vec2} The force this effect exerts.
   */
  forceOn(o) {
    return new Vec2(0.0, -9.8 * this.#gs * o.mass);
  }
}
