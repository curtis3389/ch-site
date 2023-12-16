import {Vec2} from './vec2.js';
import {CollisionComponent} from "./collision-component.js";
import {GlobalEffectComponent} from "./global-effect-component.js";
import {CollisionShape} from "./collision-shape.js";
import {Circle} from "./circle.js";
import {CollisionPlane} from "./collision-plane.js";

/**
 * Represents an object in the physics engine.
 */
export class PhysicsObject {
  /**
   * Whether this object can collide with other objects.
   * Defaults to true.
   * @type {boolean}
   */
  collidable = true;

  /**
   * The PhysicsComponents that are part of this object.
   * @type {PhysicsComponent[]}
   */
  components = [];

  /**
   * The mass of this object, in kilograms.
   * @type {number}
   */
  mass = 10.0;

  /**
   * The position of this object at the end of the last tick.
   * @type {Vec2}
   */
  position = new Vec2(0.0, 20.0);

  /**
   * The position of this object at the end of the tick before last.
   * @type {Vec2}
   */
  previousPosition = this.position;

  /**
   * Whether this object's motion is simulated.
   * Defaults to true.
   * @type {boolean}
   */
  simulated = true;

  /**
   * The current velocity of this object.
   * @type {Vec2}
   */
  velocity = new Vec2(0.0, 0.0);

  /**
   * Gets a new physics object builder.
   * @returns {PhysicsObjectBuilder} A new physics object builder.
   */
  static builder() {
    return new PhysicsObjectBuilder();
  }

  /**
   * The collision components that are part of this object.
   * @type {CollisionComponent[]}
   */
  get collisionComponents() {
    return this.components.filter(c => c instanceof CollisionComponent);
  }

  /**
   * The global effect components that are part of this object.
   * @type {GlobalEffectComponent[]}
   */
  get globalEffectComponents() {
    return this.components.filter(c => c instanceof GlobalEffectComponent);
  }
}

/**
 * Represents a builder of PhysicsObjects.
 */
export class PhysicsObjectBuilder {
  /**
   * The builder function for a collision plane component.
   * @type {(CollisionPlaneBuilder) => CollisionPlaneBuilder}
   */
  #planeBuilder;

  /**
   * The starting position of the physics object.
   * @type {Vec2}
   */
  #position;

  /**
   * The mass for the physics object.
   * @type {number}
   */
  #mass;

  /**
   * The radius of the circle for a collision shape component.
   * @type {number}
   */
  #radius;

  /**
   * Sets the position of the physics object.
   * @param x {number} The x-coordinate of the physics object.
   * @param y {number} The y-coordinate of the physics object.
   * @returns {CollisionPlaneBuilder} This builder.
   */
  at(x, y) {
    this.#position = new Vec2(x, y);
    return this;
  }

  /**
   * Builds a new PhysicsObject.
   * @returns {PhysicsObject} A new PhysicsObject.
   */
  build() {
    const ifSet = (value, action) => {
      if (value !== undefined) {
        action();
      }
    };
    const o = new PhysicsObject();
    ifSet(this.#mass, () => o.mass = this.#mass);
    ifSet(this.#position, () => o.position = this.#position);
    o.components = [];
    ifSet(this.#radius, () => o.components.push(
      new CollisionShape(new Circle(
        new Vec2(0.0, 0.0),
        this.#radius))));
    ifSet(this.#planeBuilder, () => o.components.push(
      this.#planeBuilder(CollisionPlane.builder()).build()
    ));
    return o;
  }

  /**
   * Adds a collision shape with a circle of the given radius to the physics object.
   * @param radius {number} The radius of the circle.
   * @returns {PhysicsObjectBuilder} This builder.
   */
  circle(radius) {
    this.#radius = radius;
    return this;
  }

  /**
   * Sets the mass of the physics object in kilograms.
   * @param kilograms {number} The mass of the physics object in kilograms.
   * @returns {PhysicsObjectBuilder} This builder.
   */
  mass(kilograms) {
    this.#mass = kilograms;
    return this;
  }

  /**
   * Adds a collision plane to the physics object.
   * @param builderFn {(CollisionPlaneBuilder) => CollisionPlaneBuilder} The builder for the collision plane.
   * @returns {PhysicsObjectBuilder} This builder.
   */
  plane(builderFn) {
    this.#planeBuilder = builderFn;
    return this;
  }
}
