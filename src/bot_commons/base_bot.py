#!/usr/bin/env python3

import sys
import json
import asyncio
import websockets

from commons import compass


GAME_CONTROLLER_URI = "ws://192.168.1.2:6789"

GAME_CONFIG = None
GAME_STATE = None
WHO_AM_I = None

COMPASS_HEADING = 0

controller_socket = None
movement_callback = None


def start(passed_movement_callback):
    global movement_callback
    movement_callback = passed_movement_callback
    asyncio.run(basic_bot())


async def state_update_task():
    global GAME_STATE
    global GAME_CONFIG
    global WHO_AM_I
    global controller_socket

    while True:
        try:
            async with websockets.connect(GAME_CONTROLLER_URI) as websocket:
                controller_socket = websocket
            # take messages from the web socket and push them into the queue
                async for message in websocket:
                    print(message)
                    data = json.loads(message)
                    message_type = data.get("type")
                    message_data = data.get("data")
                    if message_type == "state":
                        GAME_STATE = message_data
                    elif message_type == "config":
                        GAME_CONFIG = message_data
                    elif message_type == "iseeu":
                        WHO_AM_I = message_data
                    await asyncio.sleep(0)
        except:
            pass

        controller_socket = None
        print('socket disconnected.  Reconnecting in 5 sec...')
        await asyncio.sleep(5)


async def send_heading_task():
    global COMPASS_HEADING
    global controller_socket
    while True:
        newHeading = compass.get_heading()
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
            if controller_socket:
                try:
                    await controller_socket.send(message)
                except:
                    print("socket error in send_heading_task:",
                          sys.exc_info()[0])

        await asyncio.sleep(.25)


async def movement_task():
    global movement_callback
    global WHO_AM_I

    while True:
        await asyncio.sleep(.05)
        # we need to stop calling movement callback if we are in manual
        # positioning mode
        botMode = 0
        if WHO_AM_I:
            knownBot = WHO_AM_I["knownBot"]
            if knownBot:
                botMode = knownBot["mode"]

        if botMode == 0 and movement_callback:
            movement_callback()


async def basic_bot():
    recvTask = asyncio.create_task(state_update_task())
    sendHeadingTask = asyncio.create_task(send_heading_task())
    movementTask = asyncio.create_task(movement_task())

    await asyncio.wait([recvTask, sendHeadingTask, movementTask])
