#!/usr/bin/env python3

# WS client example

import json
import asyncio
import websockets

from random import randrange


GAME_CONTROLLER_URI = "ws://localhost:6789"
GAME_BOUNDS = [-8, 4, 8, -4]
GAME_STATE = None

COMPASS_HEADING = -2


async def state_update_task(websocket):
   # take messages from the web socket and push them into the queue
    async for message in websocket:
        data = json.loads(message)
        message_type = data.get("type")
        message_data = data.get("data")
        if message_type == "state":
            GAME_STATE = message_data
        elif message_type == "bounds":
            GAME_BOUNDS = "bounds"

        print(f"got message {message_type} with {message_data}")


def get_compass_heading():
    # TODO : replace with function that reads from magnetometer
    # and converts to 0-360
    return randrange(360)


async def send_heading_task(websocket):
    while True:
        newHeading = get_compass_heading()
        if newHeading > COMPASS_HEADING + 1 or newHeading < COMPASS_HEADING - 1:
            COMPASS_HEADING = newHeading
            message = json.dumps({
                "type": "heading",
                "data": {
                    "heading": newHeading,
                    # TODO : remove this should not be needed
                    "botIndex": 0
                }
            })
            # print(f"sending compass heading {message}")
            await websocket.send(message)
        await asyncio.sleep(.05)


async def movement_task(websocket):
    await websocket.send(json.dumps({"type": "bounds"}))
    await asyncio.sleep(1)

    while True:
        await asyncio.sleep(.05)

        # TODO : handle player intersection ball bot movement here


async def ball_bot():
    async with websockets.connect(GAME_CONTROLLER_URI) as websocket:
        recvTask = asyncio.create_task(state_update_task(websocket))
        sendHeadingTask = asyncio.create_task(send_heading_task(websocket))
        movementTask = asyncio.create_task(movement_task(websocket))

        # start both tasks, but have the loop return to us when one of them
        # has ended. We can then cancel the remainder
        done, pending = await asyncio.wait(
            [recvTask, sendHeadingTask, movementTask],
            return_when=asyncio.FIRST_COMPLETED
        )
        for task in pending:
            task.cancel()
        # force a result check; if there was an exception it'll be re-raised
        for task in done:
            task.result()

asyncio.run(ball_bot())
