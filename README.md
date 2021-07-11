# Robot Futbol League

**Are you ready for some futbol!!!**

Robot Football League is one-on-one football played by autonomous robots. The game is to fork this repo and hack to life a robot to dominate the game!

## The game

The game is simple. Each player-bot has a goal they defend (keep ball out of) and an opposing goal they offend by pushing the ball toward.

For Electric Sky 2021, the playing field will be 8' x 16' with 2' at either end making up the goals.

## The components

### The Ball (ball-bot)

The ball is actually a 4wd bot with omni directional wheels called ball-bot. It receives player coordinates from `game-controller`. Any time a player-bot enters within a given radius of ball-bot, ball-bot will move at an opposing direction to the nearest player-bot with magnitude to match. So the faster a player-bot approaches ball-bot, the further ball bot will move away from player.

### The Game Controller and Timer (game-controller)

The game controller is a websocket server that sends to connected clients:

- positioning information for ball-bot, player-bot-1 and player-bot-2
- game clock
- score

It receives compass heading and inertial information only from player bots and ball-bot.

It receives admin controls (game start, stop, reset) from the scoreboard admin app.

### The Scoreboard App

The scoreboard browser app is a React web app that is served from the same PI running the game-controller server. It connects to the game-controller websocket and displays the score, the game clock and the positions of player bots and ball-bot on a graphic UI of the field.

There is also an admin app used to start, pause and reset the game.

### The Player Bots (player-bot)

This is the code to hack. The default implementation here is pretty dumb. It simply

- if not between the ball and defending goal
  - calculates a velocity interrupt vector to a point halfway between ball and defending goal
- else
  - move on vector toward ball at full speed
