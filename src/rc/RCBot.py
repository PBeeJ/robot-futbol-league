#!/usr/bin/env python3
# File name   : server.py
# Production  : GWR
# Website     : www.adeept.com
# Author      : William
# Date        : 2020/03/17

import time
import threading

from bot_commons import movement

# # Temp add for profiling
# import cProfile

#websocket
import asyncio
import websockets
import socket

import ssl
import pathlib

import json

speed_set = 100

def robotCtrl(command_input, response):
    global speed_set
    s = speed_set / 100
    if command_input.startswith('TiltControl'):
        throttleSteering = command_input.split()
        movement.moveTiltControl(int(throttleSteering[1]), int(throttleSteering[2]))        
    elif command_input.startswith('wsB'):
        speed_set = int(command_input.split()[1])
    elif 'forward' == command_input:
        movement.move(s, s, True)
    elif 'backward' == command_input:
        movement.move(s, s, False)
    elif 'WheelStop' in command_input:
        movement.stop_moving()
    elif 'left' == command_input:
        movement.move(s, -1 * s, True)
    elif 'right' == command_input:
        movement.move(-1 * s, s, True)


def wifi_check():
    try:
        s =socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
        s.connect(("1.1.1.1",80))
        ipaddr_check=s.getsockname()[0]
        s.close()
        print(ipaddr_check)
    except Exception as e:
        print(e)
        exit


async def check_permit(websocket):
    while True:
        recv_str = await websocket.recv()
        cred_dict = recv_str.split(":")
        if cred_dict[0] == "admin" and cred_dict[1] == "123456":
            response_str = "congratulation, you have connect with server\r\nnow, you can do something else"
            await websocket.send(response_str)
            return True
        else:
            response_str = "sorry, the username or password is wrong, please submit again"
            await websocket.send(response_str)

async def recv_msg(websocket):
    global speed_set, modeSelect
    direction_command = 'no'
    turn_command = 'no'

    while True: 
        response = {
            'status' : 'ok',
            'title' : '',
            'data' : None
        }

        data = ''
        data = await websocket.recv()

        if not data:
            continue

        if isinstance(data,str):
            robotCtrl(data, response)

            if 'get_info' == data:
                response['title'] = 'get_info'
                response['data'] = ['temp unknown', -1, -1]

        print(data)
        response = json.dumps(response)
        await websocket.send(response)

async def main_logic(websocket, path):
    await check_permit(websocket)
    await recv_msg(websocket)

if __name__ == '__main__':
    while  1:
        wifi_check()
        try:                  #Start server,waiting for client
            start_server = websockets.serve(main_logic, '0.0.0.0', 8888)
            asyncio.get_event_loop().run_until_complete(start_server)
            print('waiting for connection...')
            # print('...connected from :', addr)
            break
        except Exception as e:
            print(e)
            exit

    try:
        asyncio.get_event_loop().run_forever()
    except Exception as e:
        print(e)
        move.destroy()
