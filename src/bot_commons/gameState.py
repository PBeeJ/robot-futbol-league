import time
from commons import enums
from bot_commons import dumper

class BotState:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
        self.timestamp = time.time()
        # This is based on the last two readings, and is change in positional units per second
        self.dx: float = None
        self.dy: float = None

    def updatePos(self, x, y):
        ts = time.time()
        self.dx = (x - self.x) / (ts - self.timestamp)
        self.dy = (y - self.y) / (ts - self.timestamp)
        self.x = x
        self.y = y
        self.timestamp = ts

    def toString(self):
        return f"x: {self.x} y: {self.y} ts: {self.timestamp} dx: {self.dx} dy: {self.dy}"


# GameState that's relevant to bots as they do their bot thing (figure out where to go & what to do)
# Note heading is omitted (bots only need to know their own heading, and only while they're changing
# direction...maybe)
class GameState:
    def __init__(self, message):
        # The name of Local bot
        self.myName = None
        # The heading of Local bot
        self.heading = None
        self.ballBot = None
        self.bot1 = None
        self.bot2 = None
        self.gameStatus = None
        self.updateFromMessage(message)


    def getLocalBot(self):
        if myName == "ball-bot":
            return ballBot
        elif myName == "player-1":
            return bot1
        elif myName == "player-2":
            return bot2


    def updateHeading(self, newHeading):
        self.heading = newHeading


    def updateMyName(self, name):
        print(f"Oh hey, I just learned my name is {name}. I am friend? ;)")
        self.myName = name


    def toString(self):
        return f"""
  gameStatus: {self.gameStatus}
  myName:  {self.myName}
  heading: {self.heading}
  ballBot:    {self.ballBot.toString() if self.ballBot else 'None'}
  bot1:       {self.bot1.toString() if self.bot1 else 'None'}
  bot2:       {self.bot2.toString() if self.bot2 else 'None'}
"""

    # state = {
    #     "gameStatus": {"state": 0, "secondsRemaining": 0},
    #     "bots": [
    #         {
    #             "name": "ball-bot",
    #             "index": 0,
    #             "mode": 0,
    #             "x": 0.0,
    #             "y": -2.8,
    #             "heading": 161.8,
    #             "manualPosition": {"x": 0, "y": 0, "heading": 0},
    #         },
    #         {
    #             "name": "player-1",
    # ...
    #        },
    #         {
    #             "name": "player-2",
    #             "manualPosition": {"x": 0, "y": 0, "heading": 0},
    #         },
    #     ],
    #     "scores": [0, 0],
    #     "isDirty": false,
    # }

    def updateFromMessage(self, message):
        # print(f"GameState object update from Message: {message}")

        for botMsg in message["bots"]:
            if botMsg["name"] == "ball-bot":
                if self.ballBot == None:
                    # print("Initializing ballBot")
                    self.ballBot = BotState(botMsg["x"], botMsg["y"])
                    # print(f"JUST finished INITIALIZING self.ballBot: {self.ballBot.toString()}")
                else:
                    # print("Updating ballBot")
                    self.ballBot.updatePos(botMsg["x"], botMsg["y"])
                    # print(f"JUST finished UPDATING self.ballBot: {self.ballBot.toString()}")
            elif botMsg["name"] == "player-1":
                if self.bot1 == None:
                    self.bot1 = BotState(botMsg["x"], botMsg["y"])
                else:
                    self.bot1.updatePos(botMsg["x"], botMsg["y"])
            elif botMsg["name"] == "player-2":
                if self.bot2 == None:
                    self.bot2 = BotState(botMsg["x"], botMsg["y"])
                else:
                    self.bot2.updatePos(botMsg["x"], botMsg["y"])

        self.gameStatus = enums.GAME_STATES(message["gameStatus"]["state"])
        print(f"GameState object update from message DONE:{self.toString()}")
