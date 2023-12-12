import {CollisionComponent} from "./collision-component.js";

export class CollisionShape extends CollisionComponent {
  /**
   * The shape of this collision component.
   * @type {Shape}
   */
  #shape;

  /**
   * Initializes a new instance of the CollisionShape class.
   * @param shape {Shape} The shape of the collision component.
   */
  constructor(shape) {
    super();
    this.#shape = shape;
  }

  /**
   * Gets the shape of this collision component.
   * @returns {Shape}
   */
  get shape() {
    return this.#shape;
  }
}
