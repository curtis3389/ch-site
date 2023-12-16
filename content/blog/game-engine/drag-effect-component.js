import {GlobalEffectComponent} from "./global-effect-component.js";
import {Vec2} from "./vec2.js";

/**
 * Represents a global effect of drag from air resistance.
 * TODO: it'd be cool if we could simulate pockets of different densities
 */
export class DragEffectComponent extends GlobalEffectComponent {
  /**
   * The density of the air.
   * @type {number}
   */
  #airDensity;

  /**
   * The drag coefficient.
   * @type {number}
   */
  #dragCoefficient;

  /**
   * Initializes a new instance of the DragEffectComponent class.
   * @param airDensity {number} The density of the air for the effect.
   * @param dragCoefficient {number} The drag coefficient for the effect.
   */
  constructor(airDensity, dragCoefficient) {
    super();
    this.#airDensity = airDensity;
    this.#dragCoefficient = dragCoefficient;
  }

  /**
   * Gets the force this effect exerts on the given physics object.
   * @param o {PhysicsObject} The physics object to get the force for.
   * @returns {Vec2} The force this effect exerts.
   */
  forceOn(o) {
    const speed = Vec2.magnitude(o.velocity);
    if (speed > 0.0) {
      const dragDirection = Vec2.normalize(Vec2.multiply(o.velocity, -1.0));

      // TODO: use actual radius or approximation
      const area = Math.PI * 50 * 50;
      const dragMagnitude = 0.5 * this.#airDensity * speed * speed * area * this.#dragCoefficient;
      const drag = Vec2.multiply(dragDirection, dragMagnitude);
      return drag;
    }

    return new Vec2(0.0, 0.0);
  }
}
