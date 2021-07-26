#!/usr/bin/env python3
import math

from bot_commons import position, base_bot

WHO_AM_I = base_bot.WHO_AM_I
GAME_STATE = base_bot.GAME_STATE


#  This is where we move to a position that is
#  somewhere between ball-bot and our goal.
#  We need to be sure to go around ball-bot
#  by greater than it's activation radius
#  so that we don't help push ball-bot into our
#  own goal.
def move_to_defensive_position():
    # TODO
    pass


# move on direct vector toward ball without
# avoiding it's activation radius
def attack_ball():
    # TODO
    pass


# Determine we are between ball-bot and our goal
# along the x axis within 2 game units
def is_in_defensive_position():
    ourPosition = position.get_my_position()
    ballPosition = position.get_ball_position()
    xVectorToOurGoal = position.get_x_vector_to_my_goal()

    # not between ball and our goal...
    if (xVectorToOurGoal < 0 and ballPosition["x"] < ourPosition["x"]) \
            or (xVectorToOurGoal > 0 and ballPosition["y"] > ourPosition["y"]):
        return False

    # absolute difference betwee our y and ball y is < 2
    return math.fabs(ourPosition["y"], ballPosition["y"]) < base_bot.GAME_CONFIG["ballActivationRadius"]


def movement_callback():
    if is_in_defensive_position:
        attack_ball()
    else:
        move_to_defensive_position()


base_bot.start(movement_callback)
