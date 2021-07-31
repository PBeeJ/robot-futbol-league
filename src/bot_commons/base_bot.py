#!/usr/bin/env python3

from enum import auto
import enum
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
# rotationSpeed = None

# Don't check in
# Hardcoded versions (so we don't have to rerun calibration each time)
# headingOffset =  -15.086806638028634
# fullSpeed = 2.11
rotationSpeed = -133

controller_socket = None
movement_callback = None

GAME_CONFIG = None
WHO_AM_I = None


def start(passed_movement_callback):
    global movement_callback
    movement_callback = passed_movement_callback
    asyncio.run(basic_bot())

# Magic mystery code.  TODO, learn how this works.


async def basic_bot():
    recvTask = asyncio.create_task(state_update_task())
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
                            gameState = GameState.GameState(
                                message_data, ts, heading)
                        else:
                            gameState.updateFromMessage(
                                message_data, ts, heading)
                            # print(f"localBot: {gameState.getLocalBot().toString()}")
                    elif message_type == "config":
                        GAME_CONFIG = message_data
                        # print(f"CONFIG: {message_data}")
                    elif message_type == "iseeu":
                        if gameState is not None:
                            gameState.updateMyName(
                                message_data["knownBot"]["name"])
                    await asyncio.sleep(.05)
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
            except:  # catch *all* exceptions, print them, get over it
                traceback.print_exc()
        else:
            await asyncio.sleep(.25)

# TODO rotate less and go backwards if that's an option


def angleDiff(dest, curr):
    # print(f"dest - curr {dest} - {curr}")
    rotateAmount = (dest - curr) % 360
    # print(f"rotateAmount {rotateAmount}")
    return rotateAmount - 360 if rotateAmount > 180 else rotateAmount


def safeAtan(dx, dy):
    sdx = dx
    if abs(dx) < .0001:
        if dx >= 0:
            sdx = .0001
        else:
            sdx = -.0001
    # print(f"math.atan({dy} / {sdx})")
    if(sdx < 0):
        return -180 + math.atan(dy / sdx) * 180 / 3.14159
    else:
        return math.atan(dy / sdx) * 180 / 3.14159


def dist(dx, dy):
    return math.sqrt(dx * dx + dy * dy)


async def calibrate(localBot):
    global headingOffset
    global fullSpeed
    global rotationSpeed

    # Linear
    movement.stop_moving()
    startTuple = await localBot.getStableLocation()
    print(f"Starting linear calibration at {startTuple}")
    start = time.time()
    movement.move(1, 1, True)
    await asyncio.sleep(0.75)
    stop = time.time()
    movement.stop_moving()
    stopTuple = await localBot.getStableLocation()
    print(f"Completing linear calibration at {stopTuple}")

    # Do the math
    dx = stopTuple[0] - startTuple[0]
    dy = stopTuple[1] - startTuple[1]
    h = (stopTuple[3] + startTuple[3]) / 2
    trueHeading = safeAtan(dx, dy)
    headingOffset = angleDiff(trueHeading, h)
    fullSpeed = dist(dx, dy) / (stop - start)
    print(f"""CALIBRATED: Given measured true heading {trueHeading} and compass reading {h}
Found heading offset: {headingOffset} and forward speed: {fullSpeed}""")
    # Put the robot back
    # Nah don't
    # movement.move(1, 1, False)
    # await asyncio.sleep(1)
    # movement.stop_moving()

    # This doesn't help much and it's annoying to sit through
    # # Rotational
    # print("Measuring rotation speed")
    # startTuple = await localBot.getStableLocation()
    # print(f"Starting rotational calibration at {startTuple}")
    # start = time.time()
    # # Clockwise is negative angle change by math convention, but positive according to the compass
    # movement.rotate(1, True)
    # await asyncio.sleep(1)
    # stop = time.time()
    # movement.stop_moving()
    # stopTuple = await localBot.getStableLocation()
    # print(f"Completing rotational calibration at {stopTuple}")

    # # We know the angle is decreasing, and that we do less than one full rotation
    # # so if we have stopAngle > startAngle we should add 360 to startAngle
    # stopAngle = stopTuple[3]
    # startAngle = startTuple[3]
    # if stopAngle > startAngle:
    #     startAngle += 360
    # rotationSpeed = (stopAngle - startAngle) / (stop - start)
    # # But we want to use standard math convention (for easier trig)
    # rotationSpeed = rotationSpeed
    # print(f"CALIBRATED: Found rotation speed: {rotationSpeed}")
    # # Put the robot back
    # movement.rotate(1, False)
    # await asyncio.sleep(1)
    # movement.stop_moving()


async def rotateTo(dest):
    global headingOffset
    global rotationSpeed

    heading = compass.get_heading()
    curr = heading + headingOffset
    ad = angleDiff(dest, curr)
    # print(f"heading curr dest diff: {heading} {curr} {dest} {ad}")
    while abs(ad) > 5:
        movement.rotate(min(1, abs(ad) * .5), ad < 0)
        await asyncio.sleep(ad / rotationSpeed)
        movement.stop_moving()
        heading = compass.get_heading()
        curr = heading + headingOffset
        ad = angleDiff(dest, curr)
        # print(f"heading curr dest diff: {heading} {curr} {dest} {ad}")


async def rotateDistance(diff):
    global rotationSpeed
    movement.stop_moving()
    start = compass.get_heading()
    ad = diff
    while abs(ad) > 5:
        movement.rotate(min(1, abs(ad) * .5), ad < 0)
        await asyncio.sleep(ad / rotationSpeed)
        movement.stop_moving()
        curr = compass.get_heading()
        ad =  angleDiff(start + diff, curr)


async def moveToManual(localBot, x1, y1, h1):
    global headingOffset
    print(
        f"Running moveToManual with headingOffset: {headingOffset} and args {localBot.toString()} {x1} {y1} {h1}")
    movement.stop_moving()
    tupleDequeue = await localBot.getLocationAfter(time.time())
    startTuple = tupleDequeue[0]
    print(f"startTuple: {startTuple}")
    routeHeading = safeAtan(x1 - startTuple[0], y1 - startTuple[1])
    print(f"routeHeading: {routeHeading}")
    await rotateTo(routeHeading)
    while dist(x1 - startTuple[0], y1 - startTuple[1]) > 2:
        x0 = startTuple[0]
        y0 = startTuple[1]
        stepDist = dist(tupleDequeue[1][0] - x0, tupleDequeue[1][1] - y0)
        d = dist(x1 - x0, y1 - y0)
        print(f"Distance = {d}, stepDistance = {stepDist}")

        latestHeading = safeAtan(x0 - tupleDequeue[1][0], y0 - tupleDequeue[1][1])
        if(stepDist > 2):
            # print(f"==== NEW MOVETOWARDS ===== moveTowards({x0}, {y0}, {h0}, {x1}, {y1})")
            print(f"==== NEW MOVETOWARDS =====")

            routeHeading = safeAtan(x1 - x0, y1 - y0)
            # print(f"routeHeading = {routeHeading} = safeAtan({x1} - {x0}, {y1} - {y0})")


            adiff = angleDiff(routeHeading, latestHeading)
            print(f"Angle Diff = {adiff} = angleDiff({routeHeading}, {h0})")

            await rotateDistance(adiff)

        mag = 1
        runtime = d / fullSpeed * 0.3
        print(f"Run For {runtime}")
        movement.move(mag, mag, True)
        # print(f"sleep time = {d} / {fullSpeed} * 0.9 = {d / fullSpeed * 0.9}")
        await asyncio.sleep(runtime)
        # TODO Improve this by getting better at projecting where we are
        movement.stop_moving()

        tupleDequeue = await localBot.getLocationAfter(time.time())
        startTuple = tupleDequeue[0]

        x1 = gameState.getLocalBot().manualPosition["x"]
        y1 = gameState.getLocalBot().manualPosition["y"]

    await rotateTo(angleDiff(h1, headingOffset))


async def movement_task():
    global movement_callback
    global headingOffset
    global gameState

    while True:
        await asyncio.sleep(.05)
        knownBot = WHO_AM_I["knownBot"]
        botMode = knownBot["mode"]

        try:
            if not gameState or not gameState.getLocalBot():
                print(
                    "No Game State yet and/or Local Bot, maybe game controller is down?  Waiting a bit")
                await asyncio.sleep(1)
                continue
            if gameState.gameStatus == enums.GAME_STATES.game_paused:
                print("Game paused.")
                movement.stop_moving()
                continue
            # We calibrate if we need to
            if not headingOffset:
                print("Uncalibrated.  Calibrating now.")
                await calibrate(gameState.getLocalBot())
                continue
            # if gameState.gameStatus == enums.GAME_STATES.return_home:
            print("Heading home.")
            await moveToManual(gameState.getLocalBot(), gameState.getLocalBot().manualPosition["x"], gameState.getLocalBot().manualPosition["y"], gameState.getLocalBot().manualPosition["heading"])
            if gameState.gameStatus == enums.GAME_STATES.game_on.value and botMode == enums.BOT_MODES.manualThrottle.value:
                manualThrottle = knownBot["manualThrottle"]
                movement.move(manualThrottle["left"],
                              manualThrottle["right"], True)
                continue
            # if not headingOffset:
            #     print("Uncalibrated.  Calibrating now.")
            #     await calibrate(gameState.getLocalBot())
            #     continue
            if gameState.gameStatus == enums.GAME_STATES.return_home.value:
                print("Heading home.")
                await moveManual(gameState.getLocalBot(), localBot.manualPostion["x"], localBot.manualPostion["y"])
            # print("No action take in movement_task")
            # gameStatus = gameState.gameStatus
            # if should_call_movement_callback(botMode, gameStatus):
            #     movement_callback()
        except KeyboardInterrupt:
            print('Interrupted.  Exiting')
            movement.stop_moving()
            sys.exit(1)
        except:  # catch *all* exceptions, print them, get over it
            traceback.print_exc()
            movement.stop_moving()
            sys.exit(1)


def should_call_movement_callback(botMode, gameStatus):
    # print(f'movement_callback: {movement_callback}, botMode {botMode} and gameStatus {gameStatus}')
    shouldcall = (movement_callback and
                  botMode == enums.BOT_MODES.auto.value and
                  gameStatus.value == enums.GAME_STATES.game_on.value)

    # print(f'evaluates to:{shouldcall}')
    return shouldcall
