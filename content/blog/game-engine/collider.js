import * as R from 'https://esm.sh/ramda';
import {CollisionShape} from "./collision-shape.js";
import {CollisionPlane} from "./collision-plane.js";
import {Vec2} from "./vec2.js";
import {Intersector} from "./intersector.js";
import {Collision} from "./collision.js";
import {Mat3} from "./mat3.js";
import {Circle} from "./circle.js";
import {Polygon} from "./polygon.js";
import {Line} from "./line.js";
import {Option} from '../functional/option.js';

/**
 * Represents a service for checking if two collision components are colliding.
 */
export class Collider {
  #restitution;
  #tickLengthInSeconds;

  constructor(restitution, tickLengthInSeconds) {
    this.#restitution = restitution;
    this.#tickLengthInSeconds = tickLengthInSeconds;
  }

  /**
   * Performs a collision between the given physics objects, if able.
   * @param objectA {PhysicsObject} The physics object to collide with the other.
   * @param objectB {PhysicsObject} The physics object to be collided with.
   * @returns {Option<Collision>} Some(Collision) if the objects collide; None otherwise.
   */
  collide(objectA, objectB) {
    if (objectA === objectB) {
      return Option.None();
    }

    return objectA.collidable && objectB.collidable
      ? R.head(R.filter(
        collision => collision.isSome(),
        R.map(
          component => R.head(R.map(
            otherComponent => this.#collideComponents(objectA, component, objectB, otherComponent),
            objectB.collisionComponents)),
          objectA.collisionComponents)
      )) ?? Option.None()
      : Option.None();
  }

  /**
   * Performs a collision between the given two collision components of the
   * given two physics objects, if able.
   * @param objectA {PhysicsObject} The first physics object in the collision.
   * @param componentA {CollisionComponent} The component of the first object in the collision.
   * @param objectB {PhysicsObject} The second physics object in the collision.
   * @param componentB {CollisionComponent} The component of the second object in the collision.
   * @returns {Option<Collision>} Some(Collision) if the components collide; None otherwise.
   */
  #collideComponents(objectA, componentA, objectB, componentB) {
    if (componentA instanceof CollisionShape) {
      if (componentB instanceof CollisionShape) {
        return this.#collideShapes(objectA, componentA, objectB, componentB);
      } else if (componentB instanceof CollisionPlane) {
        return this.#collideShapeWithPlane(objectA, componentA, componentB);
      } else {
        throw new Error(`Unknown collision component type ${typeof componentB}!`);
      }
    } else if (componentA instanceof CollisionPlane) {
      // things can collide with planes, but planes can't collide with things
      return Option.None();
    } else {
      throw new Error(`Unknown collision component type ${typeof componentA}!`);
    }
  }

  /**
   * Checks if the given two collision components are colliding.
   * @param oA {PhysicsObject} The first physics object in the collision.
   * @param a {CollisionComponent} The first component to check.
   * @param oB {PhysicsObject} The second physics object in the collision.
   * @param b {CollisionComponent} The second component to check.
   * @returns {boolean} true if the components are colliding; false otherwise.
   */
  colliding(oA, a, oB, b) {
    return this.#collideComponents(oA, a, oB, b).isSome();
  }

  /**
   * Performs a collision between the given two collision shapes, if able.
   * @param objectA {PhysicsObject} The first physics object in the collision.
   * @param shapeA {CollisionShape} The first shape in the collision.
   * @param objectB {PhysicsObject} The second physics object in the collision.
   * @param shapeB {CollisionShape} The second shape in the collision.
   * @returns {Option<Collision>} Some(Collision) if the shapes collide; None otherwise.
   */
  #collideShapes(objectA, shapeA, objectB, shapeB) {
    const a = shapeA.shape.relativeTo(objectA.position);
    const b = shapeB.shape.relativeTo(objectB.position);
    if (Intersector.intersects(a, b)) {
      const otherToO = Vec2.subtract(a.position, b.position);
      const otherNormal = Vec2.normalize(otherToO);
      const relativeVelocity = Vec2.subtract(objectA.velocity, objectB.velocity);
      const speedAwayFromOther = Vec2.dot(relativeVelocity, otherNormal);
      if (speedAwayFromOther < 0.0) {
        const distance = Intersector.backupDistance(a, b);
        const position = Vec2.subtract(objectA.position, Vec2.multiply(otherNormal, distance));

        const mass = 1.0 / ((1.0 / objectA.mass) + (1.0 / objectB.mass));
        const acceleration = Vec2.multiply(
          otherNormal,
          (-1.0 * speedAwayFromOther * (1.0 + this.#restitution)) / this.#tickLengthInSeconds);
        const force = Vec2.multiply(acceleration, mass);
        return Option.Some(new Collision(force, position));
      }
    }

    return Option.None();
  }

  /**
   * Performs a collision between the given shape and plane, if able.
   * @param objectA {PhysicsObject}
   * @param shape {CollisionShape} The shape to collide with the plane.
   * @param plane {CollisionPlane} The plane the shape is colliding with.
   * @returns {Option<Collision>} Some(Collision) if the shape collides; None otherwise.
   */
  #collideShapeWithPlane(objectA, shape, plane) {
    const a = shape.shape.relativeTo(objectA.position);
    const distance = Intersector.planeBackupDistance(a, plane.position, plane.normal);
    if (distance >= 0.0) {
      const planeToOrigin = Vec2.subtract(new Vec2(0.0, 0.0), plane.position);
      const angle = Vec2.angleBetween(new Vec2(0.0, 1.0), plane.normal);
      const angleSign = Vec2.dot(new Vec2(1.0, 0.0), plane.normal) < 0
        ? -1
        : 1;
      const transform = Mat3.translate(Mat3.rotate(Mat3.identity(), angle * angleSign), planeToOrigin);
      const undoTransform = Mat3.invert(transform);

      const relativePreviousPosition = Mat3.multiplyVec(transform, objectA.previousPosition);
      const relativePosition = Mat3.multiplyVec(transform, objectA.position);

      // TODO: finish this and move to intersector?
      let collisionY;
      if (a instanceof  Circle) {
        collisionY = a.radius;
      } else if (a instanceof  Polygon) {
        throw new Error();
      } else if (a instanceof  Line) {
        throw new Error();
      } else {
        throw new Error();
      }

      const ratio = (collisionY - relativePreviousPosition.y) / (relativePosition.y - relativePreviousPosition.y);
      const collisionX = relativePreviousPosition.x + (ratio * (relativePosition.x - relativePreviousPosition.x));
      const relativeCollisionPosition = new Vec2(collisionX, collisionY);
      const position = Mat3.multiplyVec(undoTransform, relativeCollisionPosition);

      // impact force = acceleration * mass
      const verticalSpeed = Vec2.dot(objectA.velocity, plane.normal);
      const acceleration = Vec2.multiply(
        plane.normal,
        (-1.0 * verticalSpeed * (1.0 + this.#restitution)) / this.#tickLengthInSeconds);
      const force = verticalSpeed < 0.0
        ? Vec2.multiply(acceleration, objectA.mass)
        : 0.0;

      return Option.Some(new Collision(force, position));
    }

    return Option.None();
  }
}
