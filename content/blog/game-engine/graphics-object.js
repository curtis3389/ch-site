import {TestRenderable} from "./test-renderable.js";
import {Vec2} from "./vec2.js";

/**
 * Represents an object that can be rendered.
 */
export class GraphicsObject {
  /**
   * The position of the graphics object relative to the game object.
   * @type {Vec2}
   */
  position;

  /**
   * The thing and method to render this.
   * @type {Renderable}
   */
  renderable;

  /**
   * Gets a new builder of GraphicsObjects.
   * @returns {GraphicsObjectBuilder} The new graphics object builder.
   */
  static builder() {
    return new GraphicsObjectBuilder();
  }
}

/**
 * Represents a builder of GraphicsObjects.
 */
export class GraphicsObjectBuilder {
  /**
   * The position of the graphics object relative to its parent.
   * @type {Vec2}
   */
  #position = new Vec2(0.0, 0.0);

  /**
   * The renderable for the graphics object.
   * @type {Renderable}
   */
  #renderable;

  /**
   * Sets the position of the graphics object relative to its parent.
   * @param x {number} The x-coordinate of the graphics object.
   * @param y {number} The y-coordinate of the graphics object.
   * @returns {CollisionPlaneBuilder} This builder.
   */
  at(x, y) {
    this.#position = new Vec2(x, y);
    return this;
  }

  /**
   * Builds a new graphics object.
   * @returns {GraphicsObject} The new graphics object.
   */
  build() {
    const o = new GraphicsObject();
    o.position = this.#position;
    o.renderable = this.#renderable;
    return o;
  }

  /**
   * Adds a TestRenderable to the graphics object.
   * @returns {GraphicsObjectBuilder} This builder.
   */
  test() {
    this.#renderable = new TestRenderable();
    return this;
  }
}
