#!/usr/bin/env python3

# WS client example

import json
import asyncio
import websockets

GAME_CONTROLLER_URI = "ws://localhost:6789"


async def recvLoop(websocket):
   # take messages from the web socket and push them into the queue
    async for message in websocket:
        data = json.loads(message)
        gameStatus = data.get("gameStatus")
        if gameStatus:
            seconds = gameStatus.get("secondsRemaining")
            print(f"< {seconds}")


async def inputLoop(websocket):
    while True:
        await asyncio.sleep(1)
        plusOrMinus = input("type 'plus' or 'minus' ")
        await websocket.send(json.dumps({"action": plusOrMinus}))
        print(f"> {plusOrMinus}")
        await asyncio.sleep(1)


async def ballBot():
    async with websockets.connect(GAME_CONTROLLER_URI) as websocket:
        recvTask = asyncio.create_task(recvLoop(websocket))
        inputTask = asyncio.create_task(inputLoop(websocket))

        # start both tasks, but have the loop return to us when one of them
        # has ended. We can then cancel the remainder
        done, pending = await asyncio.wait(
            [recvTask, inputTask],
            return_when=asyncio.FIRST_COMPLETED
        )
        for task in pending:
            task.cancel()
        # force a result check; if there was an exception it'll be re-raised
        for task in done:
            task.result()

asyncio.run(ballBot())
