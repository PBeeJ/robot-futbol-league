from commons import enums
import json


# static IPs the router assigns to my macbook and ipad
# plus '::1' (localhost) for testing and debugging local
ADMIN_IP_ADDRS = ['::1', '127.0.0.1',
                  '192.168.1.6', '192.168.1.7', '192.168.1.8', '192.168.1.9', '192.168.1.10', ]
BALL_IP_ADDR = '192.168.1.3'
PLAYER_1_IP_ADDR = '192.168.1.4'
PLAYER_2_IP_ADDR = '192.168.1.5'

LISTEN_PORT = 6789

GAME_STATE = {
    "gameStatus": {
        # frustrating that enum is a class and makes this a complex object
        # that is not json serializable without a custom encoder :/
        # I don't want to use pickle on every single state broadcast loop
        "state": 0,  # enums.GAME_STATES.game_over.value,
        "secondsRemaining": 0,
    },
    "bots": [{
        "name": "ball-bot",
        "index": 0,
        # bots start in manual mode, when gameStatus.state equals anything
        # other than GAME_STATES.game_over or GAME_STATES.pause, the bots
        # will automatically move to their home positions
        "mode": 1,  # enums.BOT_MODES.manual.value,
        "x": 0,
        "y": 0,
        "heading": 0,
        "manualPosition": {
            "x": 0,
            "y": 0,
            "heading": 0
        },
        "manualThrottle": {
            "left": 0,
            "right": 0,
        }
    }, {
        "name": "player-1",
        "index": 1,
        "mode": 1,  # enums.BOT_MODES.manual.value,
        "x": 0,
        "y": 0,
        "heading": 0,
        "manualPosition": {
            "x": 0,
            "y": 0,
            "heading": 0
        },
        "manualThrottle": {
            "left": 0,
            "right": 0,
        }
    }, {
        "name": "player-2",
        "index": 2,
        "mode": 1,  # enums.BOT_MODES.manual.value,
        "x": 0,
        "y": 0,
        "heading": 0,
        "manualPosition": {
            "x": 0,
            "y": 0,
            "heading": 0
        },
        "manualThrottle": {
            "left": 0,
            "right": 0,
        }
    }],
    "scores": [0, 0],
    "isDirty": False,
}

KNOWN_BOTS = {
    BALL_IP_ADDR: GAME_STATE["bots"][0],
    PLAYER_1_IP_ADDR: GAME_STATE["bots"][1],
    PLAYER_2_IP_ADDR: GAME_STATE["bots"][2]
}

# aabb of playing field
GAME_CONFIG = {
    # The position info, bounds and other data are in units
    "centimetersPerUnit": 24,

    # The playing field bounding box, in units with origin at exactly midfield.
    # So the "field" for Electric Sky is 16' long x 8' wide.
    # 8' = 243cm / centerimetersPerUnit = 10 with 6cm left over
    "bounds": [-10, 5, 10, -5],

    # The width of the endzone in units
    "endzoneWidth": 3,

    # This is the difference between magnetic north and the playing field
    # north vector  0,0 -> 0,n
    "headingOffset": 28,

    "secondsPerGame": 300,  # 5 minutes

    # Tis the home location for each of the bots (in index order)
    "botHomes": [{
        "x": 0,
        "y": 0,
        "heading": 0,
    }, {
        "x": -6,
        "y": 0,
        "heading": 90,
    }, {
        "x": 6,
        "y": 0,
        "heading": 270,
    }],
    # in game units of measure
    "ballActivationRadius": 2,
}

SOCKETS = set()


def serializeGameState():
    return json.dumps({"type": "state", "data": GAME_STATE})


def serializeGameConfig():
    return json.dumps({"type": "config", "data": GAME_CONFIG})


def startGame():
    GAME_STATE["gameStatus"]["state"] = enums.GAME_STATES.game_on.value
    GAME_STATE["gameStatus"]["secondsRemaining"] = GAME_CONFIG["secondsPerGame"]
    GAME_STATE["isDirty"] = True


def pauseGame():
    GAME_STATE["gameStatus"]["state"] = enums.GAME_STATES.game_paused.value
    GAME_STATE["isDirty"] = True


def returnToHome():
    GAME_STATE["gameStatus"]["state"] = enums.GAME_STATES.return_home.value
    GAME_STATE["isDirty"] = True


def resumeGame():
    GAME_STATE["gameStatus"]["state"] = enums.GAME_STATES.game_on.value
    GAME_STATE["isDirty"] = True


def stopGame():
    GAME_STATE["gameStatus"]["state"] = enums.GAME_STATES.game_over.value
    GAME_STATE["isDirty"] = True


def clockTick():
    GAME_STATE["gameStatus"]["secondsRemaining"] -= 1
    GAME_STATE["isDirty"] = True


def increaseScore(botIndex):
    GAME_STATE["scores"][botIndex - 1] += 1
    GAME_STATE["isDirty"] = True


def decreaseScore(botIndex):
    GAME_STATE["scores"][botIndex - 1] -= 1
    GAME_STATE["isDirty"] = True
