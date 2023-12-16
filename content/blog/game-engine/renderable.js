/**
 * Represents something that can be rendered by the graphics engine.
 */
export class Renderable {
  /**
   * Renders this renderable on the given rendering context.
   * @param context {CanvasRenderingContext2D} The 2D rendering context to render this on.
   * @returns {void}
   */
  render(context) {
    throw new Error('not implemented!');
  }
}
