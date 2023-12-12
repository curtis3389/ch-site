/**
 * Represents a collision between two collision components.
 */
export class Collision {
  /**
   * The forces acting on the first component in the collision.
   * @type {Vec2}
   */
  #force;

  /**
   * The position of the first component when the collision occurred.
   * @type {Vec2}
   */
  #position;

  /**
   * Initializes a new instance of the Collision class.
   * @param force {Vec2} The forces of the collision.
   * @param position {Vec2} The position of the collision.
   */
  constructor(force, position) {
    this.#force = force;
    this.#position = position;
  }

  /**
   * Gets the forces acting on the first component in the collision.
   * @returns {Vec2}
   */
  get force() {
    return this.#force;
  }

  /**
   * Gets position of the first component when the collision occurred.
   * @returns {Vec2}
   */
  get position() {
    return this.#position;
  }
}
