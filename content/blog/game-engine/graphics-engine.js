import {Rectangle} from './rectangle.js';
import {Vec2} from './vec2.js';
import {Circle} from './circle.js';
import {Intersector} from "./intersector.js";

/**
 * Represents a 2D graphics engine.
 */
export class GraphicsEngine {
  /**
   * The canvas to render with.
   * @type {HTMLCanvasElement}
   */
  #canvas;

  /**
   * The 2D rendering context to render with.
   * @type {CanvasRenderingContext2D}
   */
  #context;

  /**
   * The maximum number of frames to render in a second.
   * @type {number}
   */
  #maxFramesPerSecond = 60.0;

  /**
   * The graphics objects in the engine.
   * @type {[GameObject, GraphicsObject[]]}
   */
  #objects = [];

  /**
   * The timestamp the last frame was rendered.
   * @type {DOMHighResTimeStamp}
   */
  #previousTime;

  /**
   * The viewport.
   * @type {Rectangle}
   */
  #viewport;

  /**
   * Initializes a new instance of the GraphicsEngine class.
   * @param canvas {HTMLCanvasElement} The canvas to render with.
   */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#context = canvas.getContext('2d');
    this.#viewport = new Rectangle(
      new Vec2(-1000, 1000),
      new Vec2(2000, 2000));
  }

  /**
   * Adds the given graphics object to this.
   * @param o {GameObject}
   * @param go {GraphicsObject} The graphics object to add to the engine.
   */
  add(o, go) {
    this.#objects.push([o, go]);
  }

  /**
   * Renders a new frame, if able.
   * @param currentTime {DOMHighResTimeStamp} The current timestamp.
   */
  render(currentTime) {
    if (!this.#previousTime || this.#getTimeElapsed(currentTime) >= this.#getMinimumFrameTime()) {
      this.#context.resetTransform();
      this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
      for (let o of this.#getVisibleObjects()) {
        this.#renderObject(o);
      }
    }

    this.#previousTime = currentTime;
  }

  /**
   * Renders the given graphics object.
   * @param o {[GameObject, GraphicsObject]} The graphics object to render.
   */
  #renderObject(o) {
    this.#context.resetTransform();

    // transform canvas to game coords
    this.#context.scale(this.#canvas.width / this.#viewport.width, -this.#canvas.height / this.#viewport.height);
    this.#context.translate(this.#viewport.width / 2, -this.#viewport.height / 2);
    this.#context.translate(-this.#viewport.position.x, -this.#viewport.position.y);

    // apply position transform to move canvas to object
    // TODO: make this conditional
    this.#context.translate(o[0].physicsObject.position.x, o[0].physicsObject.position.y);
    // TODO: this.#context.rotate(o.renderable.rotation);

    // apply graphic object transform
    this.#context.translate(o[1].position.x, o[1].position.y);
    // TODO: this.#context.rotate(o.rotation);

    // render graphic object
    o[1].renderable.render(this.#context);
  }

  /**
   * Gets the graphics objects that are visible in the viewport.
   * @returns {[GameObject, GraphicsObject][]} The graphics objects that are visible.
   */
  #getVisibleObjects() {
    // TODO: rework this
    return this.#objects.filter(o => Intersector.intersects(
      this.#viewport,
      new Circle(o[0].physicsObject.position, o[0].physicsObject.radius)));
  }

  /**
   * Gets the minimum time between frames, in milliseconds.
   * @returns {number} The minimum time between frames in milliseconds.
   */
  #getMinimumFrameTime() {
    return 1000.0 / this.#maxFramesPerSecond;
  }

  /**
   * Gets the time elapsed since the last frame was rendered, in milliseconds.
   * @param currentTime The current time, in milliseconds.
   * @returns {number|number} The time elapsed since the last frame in milliseconds.
   */
  #getTimeElapsed(currentTime) {
    return !this.#previousTime
      ? 0
      : currentTime - this.#previousTime;
  }
}
