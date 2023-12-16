import {CollisionComponent} from "./collision-component.js";
import {Vec2} from "./vec2.js";

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
   * Gets a new builder of a collision plane.
   * @returns {CollisionPlaneBuilder} The new collision plane builder.
   */
  static builder() {
    return new CollisionPlaneBuilder();
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

/**
 * Represents a builder of CollisionPlanes.
 */
export class CollisionPlaneBuilder {
  /**
   * The normal vector of the plane.
   * @type {Vec2}
   */
  #normal;

  /**
   * The position of the center of the plane.
   * @type {Vec2}
   */
  #position;

  /**
   * Sets the position of the center of the plane.
   * @param x {number} The x-coordinate of the center of the plane.
   * @param y {number} The y-coordinate of the center of the plane.
   * @returns {CollisionPlaneBuilder} This builder.
   */
  at(x, y) {
    this.#position = new Vec2(x, y);
    return this;
  }

  /**
   * Builds the new CollisionPlane.
   * @returns {CollisionPlane} The new CollisionPlane.
   */
  build() {
    return new CollisionPlane(this.#normal, this.#position);
  }

  /**
   * Sets the normal vector of the plane.
   * @param x {number} The x-coordinate of the normal vector of the plane.
   * @param y {number} The y-coordinate of the normal vector of the plane.
   * @returns {CollisionPlaneBuilder} This builder.
   */
  normal(x, y) {
    this.#normal = new Vec2(x, y);
    return this;
  }
}
