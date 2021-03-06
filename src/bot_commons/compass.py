import time
import math
import board
import smbus
import asyncio


bus = smbus.SMBus(1)
address = 0x60


# Make clockwise negative
def get_heading():
    bear1 = bus.read_byte_data(address, 2)
    bear2 = bus.read_byte_data(address, 3)
    bear = (bear1 << 8) + bear2
    bear = bear/10.0
    return 360 - bear


def add_degrees(heading, deg):
    newHeading = heading + deg
    if newHeading < 0:
        newHeading = 360 - newHeading
    if newHeading > 360:
        newHeading -= 360
    return newHeading


def diff_degrees(deg1, deg2):
    deg1_adj = deg1 + 180 if deg1 < 180 else deg1 - 180
    deg2_adj = deg2 + 180 if deg2 < 180 else deg2 - 180

    return deg1_adj + deg2_adj
