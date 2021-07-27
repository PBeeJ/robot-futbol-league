from commons import enums
from bot_commons import base_bot


def get_bot_position(botIndex):
    bot = base_bot.GAME_STATE["bots"][botIndex]
    return {
        "x": bot["x"],
        "y": bot["y"],
        "heading": bot["heading"]
    }


def get_my_position():
    return get_bot_position(base_bot.WHO_AM_I["botIndex"])


def get_ball_position():
    return get_bot_position(enums.BOT_INDEXES.ball_bot.value)


def get_opponent_position():
    botIndex = base_bot.WHO_AM_I["botIndex"]
    botIndexOffset = 1 if botIndex == enums.BOT_INDEXES.player_1 else -1
    return get_bot_position(botIndex + botIndexOffset)


def get_x_vector_to_my_goal():
    botIndex = base_bot.WHO_AM_I["botIndex"]
    return -1 if botIndex == enums.BOT_INDEXES.player_1 else 1


def get_x_vector_to_opponent_goal():
    botIndex = base_bot.WHO_AM_I["botIndex"]
    return 1 if botIndex == enums.BOT_INDEXES.player_1 else -1
