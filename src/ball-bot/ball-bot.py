#!/usr/bin/env python3

# WS client example

import json
import asyncio
import websockets

from random import randrange


GAME_CONTROLLER_URI = "ws://localhost:6789"
GAME_BOUNDS = [-8, 4, 8, -4]
GAME_STATE = None

COMPASS_BEARING = 0


async def recvLoop(websocket):
   # take messages from the web socket and push them into the queue
    async for message in websocket:
        data = json.loads(message)
        messageType = data.get("type")
        messageData = data.get("data")
        if messageType == "state":
            GAME_STATE = messageData
        elif messageType == "bounds":
            GAME_BOUNDS = "bounds"

        print(f"got message {messageType} with {messageData}")


async def sendCompassHeading(websocket):
    message = json.dumps({
        "type": "heading",
        "data": {
            "heading": randrange(360),
            # TODO : remove this should not be needed
            "botIndex": 0
        }
    })
    print(f"sending compass heading {message}")
    await websocket.send(message)


async def mainLoop(websocket):
    await websocket.send(json.dumps({"type": "bounds"}))
    await asyncio.sleep(1)

    while True:
        await sendCompassHeading(websocket)
        await asyncio.sleep(.05)

        # TODO : handle player intersection ball bot movement here


async def ballBot():
    async with websockets.connect(GAME_CONTROLLER_URI) as websocket:
        recvTask = asyncio.create_task(recvLoop(websocket))
        movementTask = asyncio.create_task(mainLoop(websocket))

        # start both tasks, but have the loop return to us when one of them
        # has ended. We can then cancel the remainder
        done, pending = await asyncio.wait(
            [recvTask, movementTask],
            return_when=asyncio.FIRST_COMPLETED
        )
        for task in pending:
            task.cancel()
        # force a result check; if there was an exception it'll be re-raised
        for task in done:
            task.result()

asyncio.run(ballBot())
