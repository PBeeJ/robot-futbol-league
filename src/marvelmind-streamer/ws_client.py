#!/usr/bin/env python3
from asyncio.tasks import sleep
import os
import re
import sys
import time

import asyncio
import websockets

GAME_CONTROLLER_URI = "ws://localhost:6789"
NUMBER_OF_BOTS = 3

controllerSocket = None


async def read_stdin_task():
    global controllerSocket

    while True:
        try:
            updatesReceived = 0
            batch = []
            for line in iter(sys.stdin.readline, b''):
                updatesReceived += 1
                batch.append(line)
                # marvelmind_pos.c gets all of the bot positions and flushes the stdout
                # with all three bot positions.  We batch the lines read and submit
                # them to game-controller as one batch of three `positions` to minimize
                # the number of game state updates that game-controller needs to send.
                if updatesReceived % 3 == 0:
                    message = "{\"type\": \"positions\", \"data\": [" + ",".join(
                        batch) + "]}"
                    print(message)
                    if controllerSocket:
                        await controllerSocket.send(message)
                    batch.clear()

                await asyncio.sleep(0)

        except KeyboardInterrupt:
            break

        except Exception as e:
            print(f"got exception: {e}")

        await asyncio.sleep(0)
        print("dropped out of read stdin loop")


async def ws_client_task():
    global controllerSocket

    while True:
        try:
            print("connecting to game controller")
            async with websockets.connect(GAME_CONTROLLER_URI) as websocket:
                controllerSocket = websocket
                await controllerSocket.send("{\"type\": \"silence\"}")

                while True:
                    await controllerSocket.send("{\"type\": \"heartbeat\"}")
                    await asyncio.sleep(2)

        except KeyboardInterrupt:
            break

        except:
            print("socket error:", sys.exc_info()[0])

        controllerSocket = None
        print('dropped out of webSockets connect context.  Reconnecting in 5 sec...')
        await asyncio.sleep(5)


async def main():
    tasks = [
        asyncio.create_task(read_stdin_task()),
        asyncio.create_task(ws_client_task())
    ]
    await asyncio.wait(tasks)

asyncio.run(main())
