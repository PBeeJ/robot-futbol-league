from enum import Enum


class GAME_STATES(Enum):
    # in this state, all bots should go to home position
    # and the game clock is not running
    game_over = 0
    # in this state, bots that are in autonomous mode will
    # play the game and the clock is running
    game_on = 1
    # in this state, all bots should stop where they are and
    # the clock should be paused
    game_paused = 2
    # in this state, all bots should return to home
    going_home = 3


VALID_GAME_STATES = set(item.value for item in GAME_STATES)


class BOT_INDEXES(Enum):
    ball_bot = 0
    player_1 = 1
    player_2 = 2


VALID_BOT_INDEXES = set(item.value for item in BOT_INDEXES)


class BOT_MODES(Enum):
    auto = 0
    manual = 1


VALID_BOT_MODES = set(item.value for item in BOT_MODES)
