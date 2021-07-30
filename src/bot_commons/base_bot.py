#!/usr/bin/env python3

from enum import auto
import sys
import time
import math
import json
import asyncio
import websockets
import traceback

from commons import enums
from bot_commons import compass, GameState, movement



GAME_CONTROLLER_URI = "ws://192.168.1.2:6789"

# Globals shared by the two async methods
gameState: GameState.GameState = None
# localBotState: GameState.LocalBotState = None
headingOffset = None
fullSpeed = None
rotationSpeed = None

controller_socket = None
movement_callback = None

GAME_CONFIG = None

def start(passed_movement_callback):
    global movement_callback
    movement_callback = passed_movement_callback
    asyncio.run(basic_bot())


async def basic_bot():
    recvTask = asyncio.create_task(state_update_task())
    # sendHeadingTask = asyncio.create_task(send_heading_task())
    movementTask = asyncio.create_task(movement_task())

    await asyncio.wait([recvTask, movementTask])


async def state_update_task():
    global gameState
    global GAME_CONFIG
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
                        # print('GAME_STATE update: ' + message)
                        ts = time.time()
                        heading = compass.get_heading()
                        if not gameState:
                            gameState = GameState.GameState(message_data, ts, heading)
                        else:
                            gameState.updateFromMessage(message_data, ts, heading)
                            # print(f"localBot: {gameState.getLocalBot().toString()}")
                    elif message_type == "config":
                        GAME_CONFIG = message_data
                    elif message_type == "iseeu":
                        if gameState is not None:
                            gameState.updateMyName(message_data["knownBot"]["name"])
                    await asyncio.sleep(1)
        except:
            traceback.print_exc()

        controller_socket = None
        print('socket disconnected.  Reconnecting in 5 sec...')
        await asyncio.sleep(5)

async def send_mode(mode):
    global controller_socket
    message = json.dumps({
        "type": "botMode",
        "data": {
            "mode": mode,
            # TODO : remove this should not be needed
            "botIndex": 0
        }
    })
    while True:
        if controller_socket:
            try:
                await controller_socket.send(message)
                return
            except: # catch *all* exceptions, print them, get over it
                traceback.print_exc()
        else:
            await asyncio.sleep(.25)



async def calibrate():
    global gameState
    global headingOffset
    global fullSpeed
    global rotationSpeed

    # Linear
    movement.stop_moving()
    while not gameState.getLocalBot():
        print("No localbot state yet.  Sleeping")
        await asyncio.sleep(0.5)
    startTuple = await gameState.getLocalBot().getStableLocation()
    print(f"Starting linear calibration at {startTuple}")
    start = time.time()
    movement.move(1, 1, True)
    await asyncio.sleep(1)
    stop = time.time()
    movement.stop_moving()
    stopTuple = await gameState.getLocalBot().getStableLocation()
    print(f"Completing linear calibration at {stopTuple}")

    # Do the math
    dx = stopTuple[0] - startTuple[0]
    dy = stopTuple[1] - startTuple[1]
    h = (stopTuple[3] + startTuple[3]) / 2
    dy = .0001 if dy < .0001 else dy
    trueHeading = math.atan(dx / dy) * 180 / 3.14159
    headingOffset = trueHeading - h
    fullSpeed = math.sqrt(dx * dx + dy * dy) / (stop - start)
    print(f"CALIBRATED: Found heading offset: {headingOffset} and forward speed: {fullSpeed}")
    # Put the robot back
    movement.move(1, 1, False)
    await asyncio.sleep(1)
    movement.stop_moving()

    # Rotational
    print("Measuring rotation speed")
    startTuple = await gameState.getLocalBot().getStableLocation()
    print(f"Starting rotational calibration at {startTuple}")
    start = time.time()
    movement.rotate(1, True)
    await asyncio.sleep(1)
    stop = time.time()
    movement.stop_moving()
    stopTuple = await gameState.getLocalBot().getStableLocation()
    print(f"Completing rotational calibration at {stopTuple}")

    rotationSpeed = (stopTuple[3] - startTuple[3]) / (stop - start)
    print(f"CALIBRATED: Found rotation speed: {rotationSpeed}")
    # Put the robot back
    movement.rotate(1, False)
    await asyncio.sleep(1)
    movement.stop_moving()



async def movement_task():
    global movement_callback
    global WHO_AM_I
    global headingOffset

    while True:
        await asyncio.sleep(.05)
        try:
            if not gameState:
                print("No Game State yet, maybe game controller is down?  Waiting 5 seconds")
                await asyncio.sleep(5)
                continue
            if not headingOffset:
                print("Uncalibrated.  Calibrating now.")
                await calibrate()

            # gameStatus = gameState.gameStatus
            # if should_call_movement_callback(botMode, gameStatus):
            #     movement_callback()
        except KeyboardInterrupt:
            print('Interrupted.  Exiting')
            movement.stop_moving()
            sys.exit(1)
        except: # catch *all* exceptions, print them, get over it
            traceback.print_exc()
            sys.exit(1)



def should_call_movement_callback(botMode, gameStatus):
    # print(f'movement_callback: {movement_callback}, botMode {botMode} and gameStatus {gameStatus}')
    shouldcall = (movement_callback and
        botMode == enums.BOT_MODES.auto.value and
        gameStatus.value == enums.GAME_STATES.game_on.value)

    # print(f'evaluates to:{shouldcall}')
    return shouldcall
