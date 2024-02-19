+++
date = 2024-02-18
title = "Game Engines"
description = "What is a game engine?"
+++

A game engine is the foundation that a game is built on and often includes many
of the tools the game is built with.

At the heart of a game engine is the game loop, which is basically:

```javascript
while (!quitting) {
    processInputEvents();
    updateGameState();
    renderNextFrame();
    updateSoundsPlaying();
}
```

While the game is running, we first process any input events. This just needs to
read the current state of the inputs we listen to and translate them to game
engine terms.

```javascript
function processInputEvents() {
  // map keyboard/mouse events to game engine inputs
  context.inputs = events.map(inputConfig.map);
}
```

After inputs have been processed, then we update the state of the game. This
could include characters making decisions on what to do next, setting the
velocity of objects, and advancing the physics simulation of the game.

```javascript
function updateGameState() {
    gameObjects
      .filter(gameObject => gameObject.canUpdate())
      .forEach(gameObject => gameObject.update());
    physicsEngine.update();
}
```

Once the game state is up-to-date, we can render the next frame to the screen
and make sure that the correct sounds are playing.

```javascript
function renderNextFrame() {
    clearContext(renderingContext);
    gameObject
      .filter(gameObject => gameObject.canRender())
      .filter(gameObject => onScreen(gameObject))
      .forEach(gameObject => gameObject.render(renderingContext));
}
```

And that's the basics of how a game engine works!

You may notice that it would be quite cumbersome to make a game on top of this foundation.

Complete game engines have many systems built on top of the basic foundation to simplify
the task of creating a game. For example, in Unreal Engine there are systems for menus
and games are defined with game modes.

You can explore a simple 2D game engine [here](game-engine.js).
