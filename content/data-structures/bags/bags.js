import {
  GameEngine,
  GameObject,
} from "../../blog/game-engine/game-engine.js";

export function main() {
  const canvas = document.getElementById("canvas");
  const gameEngine = GameEngine.builder()
    .addPhysicsEngine(builder => builder.timeRatio(2.0))
    .addGraphicsEngine(canvas)
    .build();
  gameEngine.add([
    GameObject.builder()
      .addPhysics(builder => builder.circle(50.0).at(25.0, 750.0).mass(1387536755.34))
      .addGraphics(builder => builder.test())
      .build(),
    GameObject.builder()
      .addPhysics(builder => builder.circle(50.0).at(0.0, 500.0).mass(1387536755.34))
      .addGraphics(builder => builder.test())
      .build(),
    GameObject.builder()
      .addPhysics(builder => builder.plane(p => p.at(0.0, 0.0).normal(0.0, 1.0)))
      .build(),
    GameObject.builder()
      .addPhysics(builder => builder.plane(p => p.at(-1000.0, 0.0).normal(1.0, 0.0)))
      .build(),
    GameObject.builder()
      .addPhysics(builder => builder.plane(p => p.at(1000.0, 0.0).normal(-1.0, 0.0)))
      .build(),
  ]);

  gameEngine.start();
}

main();
