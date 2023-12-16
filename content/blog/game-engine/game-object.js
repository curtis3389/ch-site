import {PhysicsObject} from "./physics-object.js";
import {GraphicsObject} from "./graphics-object.js";

/**
 * Represents an object in the game engine.
 */
export class GameObject {
  /**
   * The graphics component of this object.
   * @type {GraphicsObject}
   */
  graphicsObject;

  /**
   * The physics component of this object.
   * @type {PhysicsObject}
   */
  physicsObject;

  /**
   * Creates a new game object builder.
   * @returns {GameObjectBuilder} A new game object builder.
   */
  static builder() {
    return new GameObjectBuilder();
  }
}

/**
 * Represents helper for building game objects.
 */
export class GameObjectBuilder {
  /**
   * The graphics object for the game object.
   * @type {GraphicsObject}
   */
  #graphicsObject;

  /**
   * The physics object for the game object.
   * @type {PhysicsObject}
   */
  #physicsObject;

  /**
   * Adds a graphics object to the game object with the given builder function.
   * @param builderFn {(GraphicsObjectBuilder) => GraphicsObjectBuilder} The function to use to build the graphics object.
   * @returns {GameObjectBuilder} This game object builder.
   */
  addGraphics(builderFn) {
    this.#graphicsObject = builderFn(GraphicsObject.builder()).build();
    return this;
  }

  /**
   * Adds a physics object to the game object with the given builder function.
   * @param builderFn {(PhysicsObjectBuilder) => PhysicsObjectBuilder} The function to use to build the physics object.
   * @returns {GameObjectBuilder} This game object builder.
   */
  addPhysics(builderFn) {
    this.#physicsObject = builderFn(PhysicsObject.builder()).build();
    return this;
  }

  /**
   * Build a new GameObject.
   * @returns {GameObject} The new GameObject.
   */
  build() {
    const o = new GameObject();
    o.graphicsObject = this.#graphicsObject;
    o.physicsObject = this.#physicsObject;
    return o;
  }
}
