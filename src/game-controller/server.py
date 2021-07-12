#!/usr/bin/env python3

import logging
import json
import asyncio
import websockets

from enum import Enum

ADMIN_IP_ADDRS = ['::1', '192.168.1.8', '192.168.1.9']
BALL_IP_ADDR = '192.168.1.3'
PLAYER_1_IP_ADDR = '192.168.1.4'
PLAYER_2_IP_ADDR = '192.168.1.5'


class BOT_INDEX(Enum):
    ball_bot: 0
    player_1: 1
    player_2: 2


logging.basicConfig()

GAME_STATE = {
    "gameStatus": {
        "state": "GAME_OVER",
        "secondsRemaining": 0,
    },
    "bots": [{
        "name": "ball-bot",
        "x": 0,
        "y": 0,
        "heading": 0
    }, {
        "name": "player-1",
        "x": 0,
        "y": 0,
        "heading": 0,
    }, {
        "name": "player-2",
        "x": 0,
        "y": 0,
        "heading": 0,
    }],
    "scores": [0, 0],
    "isDirty": False,
}

KNOWN_BOTS = {
    BALL_IP_ADDR: GAME_STATE["bots"][0],
    PLAYER_1_IP_ADDR: GAME_STATE["bots"][1],
    PLAYER_2_IP_ADDR: GAME_STATE["bots"][2]
}

# aabb of playing field
GAME_BOUNDS = [-8, 4, 8, -4]

SOCKETS = set()


def state_message():
    return json.dumps({"type": "state", "data": GAME_STATE})


def bounds_message():
    return json.dumps({"type": "bounds", "data": GAME_BOUNDS})


async def send_message(websocket, message):
    if websocket and websocket != "all":
        await asyncio.wait([websocket.send(message) for websocket in SOCKETS])
    elif SOCKETS:  # asyncio.wait doesn't accept an empty list
        await asyncio.wait([websocket.send(message) for websocket in SOCKETS])


async def notify_state(websocket="all"):
    print(f"sending state to {websocket}")
    await send_message(websocket, state_message())


async def notify_bounds(websocket):
    await send_message(websocket, bounds_message())


async def register(websocket):
    print(f"got new connection from {websocket.remote_address[0]}")
    SOCKETS.add(websocket)
    await notify_bounds(websocket)
    await notify_state(websocket)


async def unregister(websocket):
    print(f"lost connection {websocket.remote_address[0]}")
    SOCKETS.remove(websocket)


def getKnownBot(websocket, data):
    remoteIp = websocket.remote_address[0]

    # admins can specify `botIndex` in the messages
    # that update state
    if remoteIp in ADMIN_IP_ADDRS:
        botIndex = data.get('botIndex')
        if botIndex != None:
            return GAME_STATE["bots"][botIndex]

    return KNOWN_BOTS.get(remoteIp)


async def handleStateRequest(websocket, data):
    if websocket.remote_address[0] in ADMIN_IP_ADDRS:
        # TODO : if comming from an admin apply to GAME_STATE
        pass

    await notify_state(websocket)


async def handleBoundsRequest(websocket, data):
    if websocket.remote_address[0] in ADMIN_IP_ADDRS:
        print(f"got admin bounds request with {data}")
        # TODO : if comming from an admin apply to GAME_STATE

    await notify_bounds(websocket)


async def handleCompassMessage(websocket, data):
    knownBot = getKnownBot(websocket, data)
    remoteAddr = websocket.remote_address[0]
    heading = data.get("heading")
    if knownBot and heading:
        print(f"got heading message from known bot {knownBot}")
        knownBot["heading"] = heading
        GAME_STATE["isDirty"] = True
    else:
        print(f"got heading message from unknown bot {remoteAddr} (ignoring)")


async def handleMessage(websocket, path):
    await register(websocket)
    try:
        async for message in websocket:
            jsonData = json.loads(message)
            messageType = jsonData.get("type")
            messageData = jsonData.get('data')
            print(
                f"got {messageType} request from {websocket.remote_address[0]} with {messageData}")

            if messageType == "state":
                await handleStateRequest(websocket, messageData)
            elif messageType == "bounds":
                await handleBoundsRequest(websocket, messageData)
            elif messageType == "heading":
                await handleCompassMessage(websocket, messageData)
            else:
                logging.error("unsupported event: %s", jsonData)
    finally:
        await unregister(websocket)


async def send_state_task():
    while True:
        if GAME_STATE["isDirty"]:
            GAME_STATE["isDirty"] = False
            await notify_state()
        await asyncio.sleep(0)


start_server = websockets.serve(handleMessage, port=6789)
asyncio.get_event_loop().run_until_complete(start_server)

asyncio.get_event_loop().create_task(send_state_task())

asyncio.get_event_loop().run_forever()
