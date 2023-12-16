import {Renderable} from "./renderable.js";

/**
 * Represents a renderable for testing.
 * TODO: replace this with a proper renderable
 */
export class TestRenderable extends Renderable {
  /**
   * Initializes a new instance of the TestRenderable class.
   */
  constructor() {
    super();
  }

  /**
   * Renders this renderable on the given rendering context.
   * @param context {CanvasRenderingContext2D} The 2D rendering context to render this on.
   */
  render(context) {
    context.beginPath();
    // TODO
    context.arc(0, 0, 50, 0, Math.PI * 2, true);
    context.fillStyle = 'black';
    context.fill();
  }
}
