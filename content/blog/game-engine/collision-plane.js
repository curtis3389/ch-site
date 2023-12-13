import {CollisionComponent} from "./collision-component.js";

/**
 * Represents a plane that can be collided with like the ground.
 */
export class CollisionPlane extends CollisionComponent {
  /**
   * The normal vector of the plane.
   * @type {Vec2}
   */
  #normal;

  /**
   * The position of the plane.
   * @type {Vec2}
   */
  #position;

  /**
   * Initializes a new instance of the CollisionPlane class.
   * @param normal {Vec2} The normal vector of the plane.
   * @param position {Vec2} The position of the plane.
   */
  constructor(normal, position) {
    super();
    this.#normal = normal;
    this.#position = position;
  }

  /**
   * Gets the normal vector of the plane.
   * @returns {Vec2}
   */
  get normal() {
    return this.#normal;
  }

  /**
   * Gets the position of the plane.
   * @returns {Vec2}
   */
  get position() {
    return this.#position;
  }
}
