#!/usr/bin/env python3

from enum import auto
import sys
import json
import asyncio
import websockets
import traceback

from commons import enums
from bot_commons import compass, gameState



GAME_CONTROLLER_URI = "ws://192.168.1.2:6789"

GAME_CONFIG = None
GAME_STATE = None
WHO_AM_I = None
botIndex = None

COMPASS_HEADING = 0

controller_socket = None
movement_callback = None


def start(passed_movement_callback):
    global movement_callback
    movement_callback = passed_movement_callback
    asyncio.run(basic_bot())


async def basic_bot():
    recvTask = asyncio.create_task(state_update_task())
    sendHeadingTask = asyncio.create_task(send_heading_task())
    movementTask = asyncio.create_task(movement_task())

    await asyncio.wait([recvTask, sendHeadingTask, movementTask])


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
                    # print('state_update_task: ' + message)
                    data = json.loads(message)
                    message_type = data.get("type")
                    message_data = data.get("data")
                    if message_type == "state":
                        print('GAME_STATE update: ' + message)
                        if(GAME_STATE == None):
                            GAME_STATE = gameState.GameState(message_data)
                        else:
                            GAME_STATE.updateFromMessage(message_data)
                    elif message_type == "config":
                        GAME_CONFIG = message_data
                    elif message_type == "iseeu":
                        # print('WHO_AM_I message: ' + message)
                        WHO_AM_I = message_data
                        if GAME_STATE is not None:
                            GAME_STATE.updateMyName(message_data["knownBot"]["name"])
                    await asyncio.sleep(1)
        except:
            traceback.print_exc()

        controller_socket = None
        print('socket disconnected.  Reconnecting in 5 sec...')
        await asyncio.sleep(5)


async def send_heading_task():
    global COMPASS_HEADING
    global controller_socket
    while True:
        await asyncio.sleep(.25)
        try:
            newHeading = compass.get_heading()
            if GAME_STATE is not None:
                GAME_STATE.updateHeading(newHeading)
            # Now that we've set heading locally, I don't think we have to send it to the game controller
            # so commenting that out, at least for now
            # if newHeading > COMPASS_HEADING + 1 or newHeading < COMPASS_HEADING - 1:
            #     COMPASS_HEADING = newHeading
            #     message = json.dumps({
            #         "type": "heading",
            #         "data": {
            #             "heading": newHeading,
            #             # TODO : remove this should not be needed
            #             "botIndex": 0
            #         }
            #     })
            #     # print(f"sending compass heading {message}")
            #     if controller_socket:
            #         await controller_socket.send(message)

        except: # catch *all* exceptions, print them, get over it
            traceback.print_exc()




async def movement_task():
    global movement_callback
    global WHO_AM_I

    while True:
        await asyncio.sleep(.05)
        try:
            knownBot = WHO_AM_I and WHO_AM_I["knownBot"]
            botMode = enums.BOT_MODES.manual.value if not knownBot else knownBot["mode"]
            if(not GAME_STATE):
                print("No Game State yet, maybe game controller is down?  Waiting 5 seconds")
                await asyncio.sleep(5)
                continue
            gameStatus = GAME_STATE.gameStatus

            if should_call_movement_callback(botMode, gameStatus):
                movement_callback()
            elif botMode == enums.BOT_MODES.manual.value:
                # TODO : move to GAME_STATE[knownBot[index]]["manualPosition"]
                pass
            elif gameStatus == enums.GAME_STATES.return_home.value:
                if knownBot:
                    # TODO : move to GAME_CONFIG["botHomes"][knownBot.index]
                    pass
        except: # catch *all* exceptions, print them, get over it
            traceback.print_exc()


def should_call_movement_callback(botMode, gameStatus):
    # print(f'movement_callback: {movement_callback}, botMode {botMode} and gameStatus {gameStatus}')
    shouldcall = (movement_callback and
        botMode == enums.BOT_MODES.auto.value and
        gameStatus.value == enums.GAME_STATES.game_on.value)

    # print(f'evaluates to:{shouldcall}')
    return shouldcall
