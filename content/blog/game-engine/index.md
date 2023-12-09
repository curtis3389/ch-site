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

While the game is running, we first process any input events. This could involve
things like marking the player as moving or adjusting the position of the
viewport into the game world.

After inputs have been processed, then we update the state of the game. This
could include characters making decisions on what to do next, setting the
velocity of objects, and advancing the physics simulation of the game.

Once the game state is up-to-date, we can render the next frame to the screen
and make sure that the correct sounds are playing.
