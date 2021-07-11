#!/usr/bin/env python3

import asyncio


async def nested():
    while True:
        print('got nested')
        await asyncio.sleep(0)


async def main():
    # Schedule nested() to run soon concurrently
    # with "main()".
    asyncio.create_task(nested())

    while True:
        print('main is still running')
        await asyncio.sleep(0)

asyncio.run(main(), debug=True)
