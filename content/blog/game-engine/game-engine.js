/**
 * Represents a 2D game engine.
 */
export class GameEngine {
  /**
   * The handle for the current request to run #executeFrame.
   * @type {number | undefined}
   */
  #frameHandle = undefined;
  /**
   * Runs the next frame of the game engine.
   * @param currentTime The current timestamp, in milliseconds.
   */
  #executeFrame = (currentTime) => {
    this.#frameHandle = window.requestAnimationFrame(this.#executeFrame);
    this.#physicsEngine.update(currentTime);
    this.#graphicsEngine.render(currentTime);
  };
  /**
   * The graphics engine of this game engine.
   * @type {GraphicsEngine}
   */
  #graphicsEngine;
  /**
   * The physics engine of this game engine.
   * @type {PhysicsEngine}
   */
  #physicsEngine;
  /**
   * The objects in the game engine.
   * @type {GameObject[]}
   */
  #objects = [];

  /**
   * Initializes a new instance of the GameEngine class.
   * @param graphicsEngine The graphics engine to use.
   * @param physicsEngine The physics engine to use.
   */
  constructor(graphicsEngine, physicsEngine) {
    this.#graphicsEngine = graphicsEngine;
    this.#physicsEngine = physicsEngine;
  }

  /**
   * Adds the given game object to the engine.
   * @param o {GameObject} The game object to add to the engine.
   */
  add(o) {
    this.#objects.push(o);
    this.#physicsEngine.add(o.physicsObject);
    this.#graphicsEngine.add(o.graphicsObject);
  }

  /**
   * Starts the game engine.
   */
  start() {
    this.#executeFrame(document.timeline.currentTime);
  }

  /**
   * Stops the game engine.
   */
  stop() {
    window.cancelAnimationFrame(this.#frameHandle);
  }
}

//export { Circle } from './circle.js';
export { GameObject } from './game-object.js';
export { GraphicsEngine } from './graphics-engine.js';
export { GraphicsObject } from './graphics-object.js';
//export { Line } from './line.js';
export { PhysicsEngine } from './physics-engine.js';
export { PhysicsObject } from './physics-object.js';
//export { Polygon } from './polygon.js';
//export { Rectangle } from './rectangle.js';
//export { Shape } from './shape.js';
//export { Square } from './square.js';
export { TestRenderable } from './test-renderable.js';
export { Vec2 } from './vec2.js';
export * from './shapes.js';
