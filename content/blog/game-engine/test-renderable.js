/**
 * TODO: replace this with a proper renderable
 */
export class TestRenderable {
  /**
   * The physics object to render.
   * @type {PhysicsObject}
   */
  #physicsObject;

  /**
   * Initializs a new instance of the TestRenderable class.
   * @param physicsObject {PhysicsObject} The physics object to render.
   */
  constructor(physicsObject) {
    this.#physicsObject = physicsObject;
  }

  /**
   * Gets the physics object this renders.
   * @returns {PhysicsObject} The physics object this renders.
   */
  get physicsObject() {
    return this.#physicsObject;
  }

  /**
   * Gets the position of this renderable.
   * @returns {Vec2} The position of this renderable.
   */
  get position() {
    return this.#physicsObject.position;
  }

  /**
   * Renders this renderable on the given rendering context.
   * @param context {CanvasRenderingContext2D} The 2D rendering context to render this on.
   */
  render(context) {
    context.beginPath();
    context.arc(0, 0, this.#physicsObject.radius, 0, Math.PI * 2, true);
    context.fillStyle = 'black';
    context.fill();
  }
}
