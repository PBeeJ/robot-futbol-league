#!/usr/bin/env python3

from bot_commons import compass, base_bot, position

def movement_callback():
    if base_bot.GAME_STATE == None:
        print("No GAME_STATE in movement_callback, returning")
        return
    my_position = base_bot.GAME_STATE.toString()
    print(f'Movement_callback, base_bot.GAME_STATE.toString(): {my_position}')

def movement_callback():
    print(f'Movement_callback')


base_bot.start(movement_callback)
