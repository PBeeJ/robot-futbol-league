import time
import math
import board
import adafruit_lis3mdl


i2c = board.I2C()  # uses board.SCL and board.SDA
mag = adafruit_lis3mdl.LIS3MDL(i2c)


def get_heading():
    # TODO : replace with function that reads from magnetometer
    # and converts to 0-360
    mag_x, mag_y, mag_z = mag.magnetic

    # heading = math.atan2(mag_x, mag_y) * 180 / math.pi

    # pirate = 180.0/math.pi
    # xz = pirate * math.atan2(mag_x, mag_z)
    # yz = pirate * math.atan2(mag_y, mag_z)

    # print(f"Level {xz} {yz}")

    heading = math.atan2(-mag_x, mag_y)
    # if heading >= 1:
    #     heading = 0
    # else:
    #     heading = heading * 360

    # compensate for mounting of mag on bot
    #  heading = add_degrees(heading, -90)

    print('heading: {0:10.2f} X:{1:10.2f}, Y:{2:10.2f}, Z:{3:10.2f} uT'.format(
        heading, mag_x, mag_y, mag_z))

    return heading


def add_degrees(heading, deg):
    newHeading = heading + deg
    if newHeading < 0:
        newHeading = 360 - newHeading
    if newHeading > 360:
        newHeading -= 360
    return newHeading


# north: 52, 47
# south: -84, 53
