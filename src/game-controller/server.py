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
USERS = set()


def state_event():
    return json.dumps({"type": "state", **GAME_STATE})


def users_event():
    return json.dumps({"type": "users", "count": len(USERS)})


async def notify_state():
    if USERS:  # asyncio.wait doesn't accept an empty list
        message = state_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def register(websocket):
    USERS.add(websocket)
    print(f"got new connection from {websocket.remote_address[0]}")


async def unregister(websocket):
    USERS.remove(websocket)
    print(f"lost connection {websocket}")


async def counter(websocket, path):
    # register(websocket) sends user_event() to websocket
    await register(websocket)
    try:
        await websocket.send(state_event())
        async for message in websocket:
            data = json.loads(message)
            if data["action"] == "minus":
                GAME_STATE["gameStatus"]["secondsRemaining"] -= 1
                await notify_state()
            elif data["action"] == "plus":
                GAME_STATE["gameStatus"]["secondsRemaining"] += 1
                await notify_state()
            else:
                logging.error("unsupported event: %s", data)
    finally:
        await unregister(websocket)


start_server = websockets.serve(counter, port=6789)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
