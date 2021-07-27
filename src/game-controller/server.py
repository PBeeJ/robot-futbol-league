#!/usr/bin/env python3

import logging
import json
import asyncio
import websockets

import data as DataStore
from commons import enums


logging.basicConfig()


def iseeu_message(websocket):
    global KNOWN_BOTS
    global ADMIN_IP_ADDRS

    remoteIp = websocket.remote_address[0]
    knownBot = DataStore.KNOWN_BOTS.get(remoteIp)
    isAdmin = remoteIp in DataStore.ADMIN_IP_ADDRS
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
    elif DataStore.SOCKETS:  # asyncio.wait doesn't accept an empty list
        await asyncio.wait([websocket.send(message) for websocket in DataStore.SOCKETS])


async def notify_state(websocket="all"):
    await send_message(websocket, DataStore.serializeGameState())


async def notify_config(websocket="all"):
    await send_message(websocket, DataStore.serializeGameConfig())


# NOTE that there is no "all" option here, need a websocket,
#  ye shall not ever broadcast this info
async def notify_iseeu(websocket):
    if not websocket or websocket == "all":
        return
    await send_message(websocket, iseeu_message(websocket))


async def register(websocket):
    print(f"got new connection from {websocket.remote_address[0]}")
    DataStore.SOCKETS.add(websocket)
    await notify_config(websocket)
    await notify_state(websocket)
    await notify_iseeu(websocket)


async def unregister(websocket):
    print(f"lost connection {websocket.remote_address[0]}")
    try:
        DataStore.SOCKETS.remove(websocket)
    except:
        pass


def get_known_bot(websocket, data):
    remoteIp = websocket.remote_address[0]

    # admins can specify `botIndex` in the messages
    # that update bot states
    if remoteIp in DataStore.ADMIN_IP_ADDRS:
        botIndex = data.get('botIndex')
        if is_valid_bot_index(botIndex):
            return DataStore.GAME_STATE["bots"][botIndex]

    return DataStore.KNOWN_BOTS.get(remoteIp)


def is_valid_bot_index(index):
    return index in enums.VALID_BOT_INDEXES


def is_admin(websocket):
    remoteIp = websocket.remote_address[0]
    return remoteIp in DataStore.ADMIN_IP_ADDRS


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
        for attribute in dir(DataStore.GAME_CONFIG):
            value = data.get(attribute)
            if value:
                DataStore.GAME_CONFIG[attribute] = value
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
        DataStore.GAME_STATE["isDirty"] = True
    else:
        print(f"got heading message from unknown bot {remoteAddr} (ignoring)")


async def handlePositionMessage(websocket, data):
    handlePositionsMessage(websocket, [data])


async def handlePositionsMessage(websocket, data):

    if not validate_admin(websocket, 'positions update'):
        return

    didUpdate = False

    for positionData in data:
        botIndex = positionData["botIndex"]
        if not is_valid_bot_index(botIndex):
            print(
                f"received position message from invalid bot index ({botIndex})")
            continue
        knownBot = DataStore.GAME_STATE["bots"][botIndex]

        rawX = positionData.get('x')
        rawY = positionData.get('y')
        if not (rawX and rawY):
            print(
                f"position message received without x ({rawX}) or y ({rawY})")
            return

        # The positioning streamer gives us x, y in meters
        # We store position in 10ths of game units
        cmPerUnit = DataStore.GAME_CONFIG["centimetersPerUnit"]
        x = (rawX * 100) / cmPerUnit  # // = divide and floor
        y = (rawY * 100) / cmPerUnit

        if x != knownBot["x"] or y != knownBot["y"]:
            didUpdate = True
            knownBot["x"] = x
            knownBot["y"] = y

    if didUpdate:
        DataStore.GAME_STATE['isDirty'] = True


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

    DataStore.GAME_STATE["isDirty"] = True


async def handleBotModeMessage(websocket, data):
    await handleBotModesMessage(websocket, [data])


async def handleBotModesMessage(websocket, data):
    if not validate_admin(websocket, 'botMode update'):
        return

    for botModeData in data:
        botIndex = botModeData["botIndex"]
        if not is_valid_bot_index(botIndex):
            print(f"botMode message received for invalid botIndex {botIndex}")
            continue

        mode = botModeData["mode"]
        if not mode in enums.VALID_BOT_MODES:
            print(f"Invalid mode {mode} received for botMode message")
            continue

        DataStore.GAME_STATE["bots"][botIndex]["mode"] = mode

    DataStore.GAME_STATE['isDirty'] = True


async def handleSilenceMessage(websocket):
    # remoteIp = websocket.remote_address[0]
    # print(f"got shusshed by {remoteIp}")
    try:
        DataStore.SOCKETS.remove(websocket)
    except:
        pass


async def handleGameStartMessage(websocket):
    if not validate_admin(websocket, 'game start'):
        return

    gameState = DataStore.GAME_STATE["gameStatus"]["state"]
    if gameState == enums.GAME_STATES.game_paused.value:
        print('resuming')
        DataStore.resumeGame()
    elif gameState == enums.GAME_STATES.game_over.value:
        print('starting')
        DataStore.startGame()


async def handleGameStopMessage(websocket):
    if not validate_admin(websocket, 'game stop'):
        return

    DataStore.stopGame()


async def handleGamePauseMessage(websocket):
    if not validate_admin(websocket, 'game pause'):
        return

    DataStore.pauseGame()


async def handleGameReturnToHomeMessage(websocket):
    if not validate_admin(websocket, 'return to home'):
        return

    DataStore.returnToHome()


async def handleGameResumeMessage(websocket):
    if not validate_admin(websocket, 'game resume'):
        return

    gameState = DataStore.GAME_STATE["gameStatus"]["state"]
    if gameState != enums.GAME_STATES.game_over.value:
        DataStore.resumeGame()


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
            # {type: "config", data: {...}
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
            # {type: "manualPosition", data {botIndex: 0, x: 0, y: 0, heading: 0}}
            elif messageType == "manualPosition":
                await handleManualPositionMessage(websocket, messageData)
            # {type: "botMode", data: {botindex: 0, mode: 0}}
            elif messageType == "botMode":
                await handleBotModeMessage(websocket, messageData)
            # {type: "botModes", data: [{botindex: 0, mode: 0}}]
            elif messageType == "botModes":
                await handleBotModesMessage(websocket, messageData)
            elif messageType == "silence":
                await handleSilenceMessage(websocket)
            elif messageType == "heartbeat":
                pass

            # {type: "gameStart"}
            elif messageType == "gameStart":
                await handleGameStartMessage(websocket)
            # {type: "gameStop"}
            elif messageType == "gameStop":
                await handleGameStopMessage(websocket)
            # {type: "gamePause"}
            elif messageType == "gamePause":
                await handleGamePauseMessage(websocket)
            # {type: "gameResume"}
            elif messageType == "gameResume":
                await handleGameResumeMessage(websocket)
            # {type: "gameReturnToHome"}
            elif messageType == "gameReturnToHome":
                await handleGameReturnToHomeMessage(websocket)

            else:
                logging.error("received unsupported message: %s", jsonData)
    finally:
        await unregister(websocket)


async def send_state_task():
    while True:
        if DataStore.GAME_STATE["isDirty"]:
            DataStore.GAME_STATE["isDirty"] = False
            await notify_state()
        await asyncio.sleep(0)


async def update_game_clock_task():
    while True:
        await asyncio.sleep(1)
        # print(f"GAME_STATE={DataStore.GAME_STATE}")
        gameState = DataStore.GAME_STATE["gameStatus"]["state"]
        secondsRemaining = DataStore.GAME_STATE["gameStatus"]["secondsRemaining"]
        if gameState == enums.GAME_STATES.game_on.value:
            if secondsRemaining > 0:
                DataStore.clockTick()
            else:
                DataStore.stopGame()


print(f"Starting server on port {DataStore.LISTEN_PORT}")
start_server = websockets.serve(handleMessage, port=DataStore.LISTEN_PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().create_task(send_state_task())
asyncio.get_event_loop().create_task(update_game_clock_task())
asyncio.get_event_loop().run_forever()
