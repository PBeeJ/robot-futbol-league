#!/usr/bin/env python3

from bot_commons import compass, base_bot, position


def movement_callback():
    print(f'Movement_callback')


base_bot.start(movement_callback)
