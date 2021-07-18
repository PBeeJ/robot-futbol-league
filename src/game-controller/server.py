#!/usr/bin/env python3

import logging
import json
import asyncio
import websockets

from enum import Enum

# static IPs the router assigns to my macbook and ipad
# plus '::1' (localhost) for testing and debugging local
ADMIN_IP_ADDRS = ['::1', '127.0.0.1', '192.168.1.8', '192.168.1.9']
BALL_IP_ADDR = '192.168.1.3'
PLAYER_1_IP_ADDR = '192.168.1.4'
PLAYER_2_IP_ADDR = '192.168.1.5'

LISTEN_PORT = 6789


class BOT_INDEX(Enum):
    ball_bot = 0
    player_1 = 1
    player_2 = 2


VALID_BOT_INDEXES = set(item.value for item in BOT_INDEX)


class BOT_MODE(Enum):
    auto = 0
    manual = 1


VALID_BOT_MODES = set(item.value for item in BOT_MODE)

logging.basicConfig()

GAME_STATE = {
    "gameStatus": {
        "state": "GAME_OVER",
        "secondsRemaining": 0,
    },
    "bots": [{
        "name": "ball-bot",
        "index": 0,
        "mode": 0,
        "x": 0,
        "y": 0,
        "heading": 0,
        "manualPosition": {
            "x": 0,
            "y": 0,
            "heading": 0
        }
    }, {
        "name": "player-1",
        "index": 1,
        "mode": 0,
        "x": 0,
        "y": 0,
        "heading": 0,
        "manualPosition": {
            "x": 0,
            "y": 0,
            "heading": 0
        }
    }, {
        "name": "player-2",
        "index": 2,
        "mode": 0,
        "x": 0,
        "y": 0,
        "heading": 0,
        "manualPosition": {
            "x": 0,
            "y": 0,
            "heading": 0
        }
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
GAME_CONFIG = {
    # The position info, bounds and other data are in units
    "centimetersPerUnit": 24,

    # The playing field bounding box, in units with origin at exactly midfield.
    # So the "field" for Electric Sky is 16' long x 8' wide.
    # 8' = 243cm / centerimetersPerUnit = 10 with 6cm left over
    "bounds": [-10, 5, 10, -5],

    # The width of the endzone in units
    "endzoneWidth": 3,


    # This is the difference between magnetic north and the playing field
    # north vector  0,0 -> 0,n
    "headingOffset": 28
}

SOCKETS = set()


def state_message():
    return json.dumps({"type": "state", "data": GAME_STATE})


def config_message():
    return json.dumps({"type": "config", "data": GAME_CONFIG})


def iseeu_message(websocket):
    global KNOWN_BOTS
    global ADMIN_IP_ADDRS

    remoteIp = websocket.remote_address[0]
    knownBot = KNOWN_BOTS.get(remoteIp)
    isAdmin = remoteIp in ADMIN_IP_ADDRS
    return json.dumps({
        "type": "iseeu",
        "data": {
            "ip": remoteIp,
            "isAdmin": isAdmin,
            "knownBot": knownBot
        }
    })


async def send_message(websocket, message):
    if websocket and websocket != "all":
        await websocket.send(message)
    elif SOCKETS:  # asyncio.wait doesn't accept an empty list
        await asyncio.wait([websocket.send(message) for websocket in SOCKETS])


async def notify_state(websocket="all"):
    await send_message(websocket, state_message())


async def notify_config(websocket="all"):
    await send_message(websocket, config_message())


# NOTE that there is no "all" option here, need a websocket,
#  ye shall not ever broadcast this info
async def notify_iseeu(websocket):
    if not websocket or websocket == "all":
        return
    await send_message(websocket, iseeu_message(websocket))


async def register(websocket):
    print(f"got new connection from {websocket.remote_address[0]}")
    SOCKETS.add(websocket)
    await notify_config(websocket)
    await notify_state(websocket)
    await notify_iseeu(websocket)


async def unregister(websocket):
    print(f"lost connection {websocket.remote_address[0]}")
    try:
        SOCKETS.remove(websocket)
    except:
        pass


def get_known_bot(websocket, data):
    remoteIp = websocket.remote_address[0]

    # admins can specify `botIndex` in the messages
    # that update bot states
    if remoteIp in ADMIN_IP_ADDRS:
        botIndex = data.get('botIndex')
        if is_valid_bot_index(botIndex):
            return GAME_STATE["bots"][botIndex]

    return KNOWN_BOTS.get(remoteIp)


def is_valid_bot_index(index):
    return index in VALID_BOT_INDEXES


def is_admin(websocket):
    remoteIp = websocket.remote_address[0]
    return remoteIp in ADMIN_IP_ADDRS


def validate_admin(websocket, attemptedAction):
    if not is_admin(websocket):
        print(
            f"{attemptedAction} attempted by non admin IP {websocket.remote_address[0]}; ignoring")
        return False

    return True


async def handleStateRequest(websocket, data):
    await notify_state(websocket)


async def handleConfigRequest(websocket, data):
    if is_admin(websocket) and data:
        print(f"got admin config request from admin with data {data}")
        didUpdate = False
        for attribute in dir(GAME_CONFIG):
            value = data.get(attribute)
            if value:
                GAME_CONFIG[attribute] = value
                didUpdate = True

        if didUpdate:
            await notify_config()  # notify everyone of config change
        else:
            print(f"warn: got config request without change {data}")
    else:
        await notify_config(websocket)


async def handleCompassMessage(websocket, data):
    knownBot = get_known_bot(websocket, data)
    remoteAddr = websocket.remote_address[0]
    heading = data.get("heading")
    if knownBot and heading:
        # print(f"got heading message from known bot {knownBot}")
        knownBot["heading"] = heading
        GAME_STATE["isDirty"] = True
    else:
        print(f"got heading message from unknown bot {remoteAddr} (ignoring)")


async def handlePositionMessage(websocket, data):
    handlePositionsMessage(websocket, [data])


async def handlePositionsMessage(websocket, data):
    global BOT_MODE

    if not validate_admin(websocket, 'positions update'):
        return

    didUpdate = False

    for positionData in data:
        botIndex = positionData["botIndex"]
        if not is_valid_bot_index(botIndex):
            print(
                f"received position message from invalid bot index ({botIndex})")
            continue
        knownBot = GAME_STATE["bots"][botIndex]

        rawX = positionData.get('x')
        rawY = positionData.get('y')
        if not (rawX and rawY):
            print(
                f"position message received without x ({rawX}) or y ({rawY})")
            return

        # The positioning streamer gives us x, y in meters
        # We store position in game units
        cmPerUnit = GAME_CONFIG["centimetersPerUnit"]
        x = (rawX * 100) // cmPerUnit  # // = divide and floor
        y = (rawY * 100) // cmPerUnit

        if x != knownBot["x"] or y != knownBot["y"]:
            didUpdate = True
            knownBot["x"] = x
            knownBot["y"] = y

    if didUpdate:
        GAME_STATE['isDirty'] = True


async def handleManualPositionMessage(websocket, data):
    if not validate_admin(websocket, "manual position update"):
        return

    known_bot = get_known_bot(websocket, data)
    if not known_bot:
        botIndex = data["botIndex"]
        print(
            f"got manual position message for unknown bot. botIndex={botIndex}")
        return

    # TODO : validate within bounds
    position = known_bot["manualPosition"]
    position["x"] = data["x"]
    position["y"] = data["y"]
    position["heading"] = data["heading"]

    GAME_STATE["isDirty"] = True


async def handleBotModeMessage(websocket, data):
    if not validate_admin(websocket, 'botMode update'):
        return

    botIndex = data["botIndex"]
    if not is_valid_bot_index(botIndex):
        print(f"botMode message received for invalid botIndex {botIndex}")
        return

    mode = data["mode"]
    if not mode in VALID_BOT_MODES:
        print(f"Invalid mode {mode} received for botMode message")
        return

    GAME_STATE["bots"][botIndex]["mode"] = mode
    GAME_STATE['isDirty'] = True


async def handleSilenceMessage(websocket):
    # remoteIp = websocket.remote_address[0]
    # print(f"got shusshed by {remoteIp}")
    try:
        SOCKETS.remove(websocket)
    except:
        pass


async def handleMessage(websocket, path):
    await register(websocket)
    try:
        async for message in websocket:
            print(message)
            jsonData = json.loads(message)
            messageType = jsonData.get("type")
            messageData = jsonData.get('data')

            # {type: "state"}
            if messageType == "state":
                await handleStateRequest(websocket, messageData)
            # {type: "config", data: {config: [-1,1,1,-1]}}
            elif messageType == "config":
                await handleConfigRequest(websocket, messageData)
            # {type: "heading", data: {botIndex: 0, heading: 0}}
            elif messageType == "heading":
                await handleCompassMessage(websocket, messageData)
            # {type: "position", data: {botIndex: 0, x: 0, y: 0}}
            elif messageType == "position":
                await handlePositionMessage(websocket, messageData)
            elif messageType == "positions":
                await handlePositionsMessage(websocket, messageData)
            elif messageType == "manualPosition":
                await handleManualPositionMessage(websocket, messageData)
            elif messageType == "botMode":
                await handleBotModeMessage(websocket, messageData)
            elif messageType == "silence":
                await handleSilenceMessage(websocket)
            elif messageType == "heartbeat":
                pass
            else:
                logging.error("received unsupported message: %s", jsonData)
    finally:
        await unregister(websocket)


async def send_state_task():
    while True:
        if GAME_STATE["isDirty"]:
            GAME_STATE["isDirty"] = False
            await notify_state()
        await asyncio.sleep(0)

print(f"Starting server on port {LISTEN_PORT}")
start_server = websockets.serve(handleMessage, port=LISTEN_PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().create_task(send_state_task())
asyncio.get_event_loop().run_forever()
