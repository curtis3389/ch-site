import {
  GameEngine,
  GameObject,
  GraphicsEngine,
  GraphicsObject,
  PhysicsEngine,
  PhysicsObject,
  TestRenderable,
  Vec2
} from "../../blog/game-engine/game-engine.js";

export function main() {
  const canvas = document.getElementById("canvas");
  const graphicsEngine = new GraphicsEngine(canvas);
  const physicsEngine = new PhysicsEngine();
  const gameEngine = new GameEngine(graphicsEngine, physicsEngine);
  const o = new GameObject();
  o.graphicsObject = new GraphicsObject();
  o.graphicsObject.position = new Vec2(0, 0);
  o.physicsObject = new PhysicsObject();
  o.physicsObject.position = new Vec2(0, 500);
  o.physicsObject.radius = 50.0;
  o.physicsObject.mass = 1387536755.34;
  o.graphicsObject.renderable = new TestRenderable(o.physicsObject);
  gameEngine.add(o);
  const o2 = new GameObject();
  o2.graphicsObject = new GraphicsObject();
  o2.graphicsObject.position = new Vec2(0, 0);
  o2.physicsObject = new PhysicsObject();
  o2.physicsObject.position = new Vec2(25, 750);
  o2.physicsObject.radius = 50.0;
  o2.physicsObject.mass = 1387536755.34;
  o2.graphicsObject.renderable = new TestRenderable(o2.physicsObject);
  gameEngine.add(o2);
  gameEngine.start();
}

main();
