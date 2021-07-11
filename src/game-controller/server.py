#!/usr/bin/env python3

import logging
import json
import asyncio
import websockets

ADMIN_IP_ADDRS = ['192.168.1.8', '192.168.1.9']

logging.basicConfig()

GAME_STATE = {
    "gameStatus": {
        "state": "GAME_OVER",
        "secondsRemaining": 0,
    },
    "ballBot": {
        "name": "ball-bot",
        "x": 0,
        "y": 0,
        "heading": 0
    },
    "players": [
        {
            "name": "player-1",
            "x": 0,
            "y": 0,
            "heading": 0,
        },
        {
            "name": "player-2",
            "x": 0,
            "y": 0,
            "heading": 0,
        }
    ],
    "scores": [0, 0],
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


async def notify_state(websocket):
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


async def handleStateRequest(websocket, data):
    if websocket.remote_address[0] in ADMIN_IP_ADDRS:
        # TODO : if comming from an admin apply to GAME_STATE
        pass

    await notify_state(websocket)


async def handleBoundsRequest(websocket, data):
    if websocket.remote_address[0] in ADMIN_IP_ADDRS:
        print(f"got admin state request with {data}")
        # TODO : if comming from an admin apply to GAME_STATE

    await notify_bounds(websocket)


async def counter(websocket, path):
    # register(websocket) sends user_event() to websocket
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
            else:
                logging.error("unsupported event: %s", jsonData)
    finally:
        await unregister(websocket)


start_server = websockets.serve(counter, port=6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
