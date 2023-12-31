import {GraphicsEngine} from "./graphics-engine.js";
import {PhysicsEngine} from "./physics-engine.js";

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
   * Gets a new builder of a game engine.
   * @returns {GameEngineBuilder} The new game engine builder.
   */
  static builder() {
    return new GameEngineBuilder();
  }

  /**
   * Adds the given game object to the engine.
   * @param o {GameObject | GameObject[]} The game object(s) to add to the engine.
   */
  add(o) {
    if (!o) {
      throw new Error(`Falsy game object!`);
    }

    if (Array.isArray(o)) {
      for (let o2 of o) {
        this.#addGameObject(o2);
      }
    } else {
      this.#addGameObject(o)
    }
  }

  /**
   * Adds the given game object to the engine.
   * @param o {GameObject} The game object to add to the engine.
   */
  #addGameObject(o) {
    this.#objects.push(o);

    if (o.physicsObject) {
      this.#physicsEngine.add(o.physicsObject);
    }

    if (o.graphicsObject) {
      this.#graphicsEngine.add(o, o.graphicsObject);
    }
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

/**
 * Represents a builder of GameEngines.
 */
export class GameEngineBuilder {
  /**
   * The canvas the graphics engine should use.
   * @type {HTMLCanvasElement}
   */
  #canvas;

  /**
   * The builder function for the physics engine.
   * @type {(PhysicsEngineBuilder) => PhysicsEngineBuilder}
   */
  #physicsBuilder;

  /**
   * Adds a graphics engine to the game engine.
   * @param canvas {HTMLCanvasElement} The canvas element the graphics engine will use.
   * @returns {GameEngineBuilder} This builder.
   */
  addGraphicsEngine(canvas) {
    this.#canvas = canvas;
    return this;
  }

  /**
   * Adds a physics engine to the game engine.
   * @param builderFn {(PhysicsEngineBuilder) => PhysicsEngineBuilder} The builder function to use to build the physics engine.
   * @returns {GameEngineBuilder} This builder.
   */
  addPhysicsEngine(builderFn) {
    this.#physicsBuilder = builderFn;
    return this;
  }

  /**
   * Builds a new GameEngine.
   * @returns {GameEngine} A new GameEngine.
   */
  build() {
    const graphicsEngine = new GraphicsEngine(this.#canvas);
    const physicsEngine = this.#physicsBuilder(PhysicsEngine.builder()).build();
    return new GameEngine(graphicsEngine, physicsEngine);
  }
}

export { Circle } from './circle.js';
export { GameObject } from './game-object.js';
export { GraphicsEngine } from './graphics-engine.js';
export { GraphicsObject } from './graphics-object.js';
export { Line } from './line.js';
export { PhysicsEngine } from './physics-engine.js';
export { PhysicsObject } from './physics-object.js';
export { Polygon } from './polygon.js';
export { Rectangle } from './rectangle.js';
export { Shape } from './shape.js';
export { Square } from './square.js';
export { TestRenderable } from './test-renderable.js';
export { Vec2 } from './vec2.js';
