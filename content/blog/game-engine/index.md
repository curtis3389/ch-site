+++
date = 2023-12-06
title = "Game Engines"
description = "What is a game engine?"
draft = true
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

To bring the _game_ into the game engine, we need:

- to model the game as a set of states with setup steps and engine configurations
- a UI framework built on top of our event system and graphics engine

Then we can say:

1. Start by showing the main menu state (turns off physics, shows UI)
2. On start game, start the new game state (turns on physics, loads first level, shows game & HUD)
3. On start multiplayer game, start the multiplayer game state (turn on physics & networking, connect to server, show game & HUD)

So the game screen of Tetris might be just a few game objects:

- one for the HUD
- one for each score or number shows
- one for the current block being placed
- a few for the placed blocks
- one for creating and dropping next blocks

And the physics engine might be configured for Tetris, or maybe each block
handles its own motion in its `update()` method.
