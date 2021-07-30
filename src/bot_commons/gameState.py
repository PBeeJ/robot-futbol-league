from commons import enums
from bot_commons import dumper
from collections import deque
import asyncio


HISTORY_SIZE = 3

LOCAL_BOT = None
TORQUE_STATE = None


class BotState:
    # We keep track of up to HISTORY_SIZE consecutive datapoints for all bots.
    # Heading is only not None for the local bot.
    # ts = timestamp
    def __init__(self):
        self.ptuple = deque([], HISTORY_SIZE)

    def updatePos(self, x, y, ts):
        # previous locations for first and second derivatives
        self.ptuple.appendleft((x, y, ts))

    def toString(self):
        return f"(x,y,ts)[0]: {self.ptuple[0] if self.ptuple else 'None'}\n(x,y,ts)[1]: {self.ptuple[1] if self.ptuple and len(self.ptuple) > 1 else 'None'} "

def stable(ptuple0, ptuple1):
    return (abs(ptuple0[0] - ptuple1[0]) < 0.05 and
    abs(ptuple0[1] - ptuple1[1]) < 0.05 and
    abs(ptuple0[2] - ptuple1[2]) > 0.2 and
    abs(ptuple0[3] - ptuple1[3]) < 2)

class LocalBotState(BotState):
    # h = heading
    def __init__(self):
        self.ptuple = deque([], HISTORY_SIZE)
        self.manualPosition = None;

    def updatePos(self, x: float, y: float, ts: float, h: float):
        self.ptuple.appendleft((x, y, ts, h))

    def toString(self):
        return f"(x,y,ts,h)[0]: {self.ptuple[0] if self.ptuple else 'None'}\n(x,y,ts)[1]: {self.ptuple[1] if self.ptuple and len(self.ptuple) > 1 else 'None'} "

    async def getStableLocation(self):
        # print("Calling getStableLocation")
        while True:
            if len(self.ptuple) > 1 and stable(self.ptuple[0], self.ptuple[1]):
                # print("Found stableLocation")
                return self.ptuple[0]
            else:
                # print("Location isn't stable yet, waiting a bit")
                await asyncio.sleep(0.5)

    async def getLocationAfter(self, ts):
        while True:
            if len(self.ptuple) > 0 and self.ptuple[2] > ts:
                # print("Found stableLocation")
                return self.ptuple[0]
            else:
                # print("Location isn't stable yet, waiting a bit")
                await asyncio.sleep(0.5)





# GameState that's relevant to bots as they do their bot thing (figure out where to go & what to do)
# Note heading is omitted (bots only need to know their own heading, and only while they're changing
# direction...maybe)
class GameState:
    def __init__(self, message, timestamp, heading):
        # The name of Local bot
        self.myName = None
        # Dict of bots
        self.bots = {}
        self.gameStatus = None
        self.updateFromMessage(message, timestamp, heading)


    def getLocalBot(self) -> LocalBotState:
        return self.bots[self.myName] if self.myName in self.bots else None


    def updateMyName(self, name):
        print(f"Oh hey, I just learned my name is {name}. I am friend? ;)")
        self.myName = name


    def toString(self):
        return f"""
  gameStatus: {self.gameStatus}
  myName:  {self.myName}
  ball-bot:    {self.bots["ball-bot"].toString() if "ball-bot" in self.bots else 'None'}
  player-1:    {self.bots["player-1"].toString() if "player-1" in self.bots else 'None'}
  player-2:    {self.bots["player-2"].toString() if "player-2" in self.bots else 'None'}
"""


    def updateFromMessage(self, message, timestamp, heading):
        # print(f"GameState object update from Message: {message}")

        self.gameStatus = enums.GAME_STATES(message["gameStatus"]["state"])

        if self.myName == None:
            print("I need to know who I am before I can updateFromMessage for bots.  Ignoring bots part of message.")
            return

        for botMsg in message["bots"]:
            botName = botMsg["name"]
            if self.myName == botName:
                if botName not in self.bots:
                    self.bots[botName] = LocalBotState()
                self.bots[botName].updatePos(botMsg["x"], botMsg["y"], timestamp, heading)
                self.bots[botName].manualPosition =  botMsg["manualPosition"]
                # print(f"Updated LocalBot State: {self.getLocalBot().toString()}")
            else:
                if botName not in self.bots:
                    self.bots[botName] = BotState()
                self.bots[botName].updatePos(botMsg["x"], botMsg["y"], timestamp)

        print(f"GameState: {self.toString()}")
