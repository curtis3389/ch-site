/**
 * Represents a geometric shape.
 */
export class Shape {
  /**
   * Gets the position of this shape.
   * @returns {Vec2} The position of this shape.
   */
  get position() {
    throw new Error("Not implemented!");
  }

  /**
   * Gets this shape repositioned relative to the given location.
   * @param l {Vec2} The location to reposition this Shape relative to.
   * @returns {Shape} A copy of this Shape repositioned relative to the location.
   */
  relativeTo(l) {
    throw new Error("Not implemented!");
  }
}
