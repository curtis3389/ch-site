import {
  Circle,
  GameEngine,
  GameObject,
  GraphicsEngine,
  GraphicsObject,
  PhysicsEngine,
  PhysicsObject,
  TestRenderable,
  Vec2,
} from "../../blog/game-engine/game-engine.js";
import {CollisionShape} from "../../blog/game-engine/collision-shape.js";
import {CollisionPlane} from "../../blog/game-engine/collision-plane.js";

export function main() {
  const canvas = document.getElementById("canvas");
  const graphicsEngine = new GraphicsEngine(canvas);
  const physicsEngine = new PhysicsEngine(2.0);
  const gameEngine = new GameEngine(graphicsEngine, physicsEngine);
  const o = new GameObject();
  o.graphicsObject = new GraphicsObject();
  o.graphicsObject.position = new Vec2(0, 0);
  o.physicsObject = new PhysicsObject();
  o.physicsObject.position = new Vec2(0, 500);
  o.physicsObject.components = [
    new CollisionShape(new Circle(
      new Vec2(0.0, 0.0,),
      50.0)),
  ];
  o.physicsObject.mass = 1387536755.34;
  o.graphicsObject.renderable = new TestRenderable(o.physicsObject);
  gameEngine.add(o);
  const o2 = new GameObject();
  o2.graphicsObject = new GraphicsObject();
  o2.graphicsObject.position = new Vec2(0, 0);
  o2.physicsObject = new PhysicsObject();
  o2.physicsObject.position = new Vec2(25, 750);
  o2.physicsObject.components = [
    new CollisionShape(new Circle(
      new Vec2(0.0, 0.0,),
      50.0)),
  ];
  o2.physicsObject.mass = 1387536755.34;
  o2.graphicsObject.renderable = new TestRenderable(o2.physicsObject);
  gameEngine.add(o2);

  const groundObject = new GameObject();
  groundObject.physicsObject = new PhysicsObject();
  groundObject.physicsObject.position = new Vec2(0.0, 0.0);
  groundObject.physicsObject.components = [
    new CollisionPlane(
      new Vec2(0.0, 1.0),
      new Vec2(0.0, 0.0)),
  ];
  gameEngine.add(groundObject);

  const leftWall = new GameObject();
  leftWall.physicsObject = new PhysicsObject();
  leftWall.physicsObject.position = new Vec2(0.0, 0.0);
  leftWall.physicsObject.components = [
    new CollisionPlane(
      new Vec2(1.0, 0.0),
      new Vec2(-1000.0, 0.0)),
  ];
  gameEngine.add(leftWall);

  const rightWall = new GameObject();
  rightWall.physicsObject = new PhysicsObject();
  rightWall.physicsObject.position = new Vec2(0.0, 0.0);
  rightWall.physicsObject.components = [
    new CollisionPlane(
      new Vec2(-1.0, 0.0),
      new Vec2(1000.0, 0.0)),
  ];
  gameEngine.add(rightWall);

  gameEngine.start();
}

main();
