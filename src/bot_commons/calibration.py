import time
import json

from bot_commons import compass, movement
from bot_commons.base_bot import start

# amount of time to rotate while calibrating degrees per second
COMPASS_CALIBRATION_ROTATE_SEC = 1


def calibrate():
    calibrateCompass()


def calibrateCompass():
    print('calibrating compass')
    # start calibration by manually pointing bot a 0 deg.  This
    # will be used as a offset to
    compassCalibration = {
        "gameZeroDeg": compass.get_heading(),
        "minSecondsPerDegreeRight": 0,
        "minSecondsPerDegreeLeft": 0,
        "maxSecondsPerDegreeRight": 0,
        "maxSecondsPerDegreeLeft": 0,

    }

    compassCalibration["minSecondsPerDegreeRight"] = calibrateRotation(
        "right", movement.MIN_ROTATION_THROTTLE)
    compassCalibration["minSecondsPerDegreeLeft"] = calibrateRotation(
        "left", movement.MIN_ROTATION_THROTTLE)
    compassCalibration["maxSecondsPerDegreeRight"] = calibrateRotation(
        "right", movement.MAX_ROTATION_THROTTLE)
    compassCalibration["maxSecondsPerDegreeLeft"] = calibrateRotation(
        "left", movement.MAX_ROTATION_THROTTLE)

    testRotationCalibration(compassCalibration)

    print(f"calibratedCompass {json.dumps(compassCalibration)}")

    return compassCalibration


def calibrateRotation(direction, throttle):
    startHeading = compass.get_heading()
    if direction == "right":
        movement.rotate_right(throttle)
    else:
        movement.rotate_left(throttle)

    time.sleep(COMPASS_CALIBRATION_ROTATE_SEC)
    movement.stop_moving()

    # let the compass settle
    time.sleep(1)

    newHeading = compass.get_heading()
    if direction == "right":
        newHeading += 360 if newHeading < startHeading else 0
        totalDegreesRotated = newHeading - startHeading
    # direction == left
    elif newHeading < startHeading:
        totalDegreesRotated = startHeading - newHeading
    else:
        totalDegreesRotated = startHeading + newHeading - 360

    print(f"{direction}: {startHeading},{newHeading},{totalDegreesRotated}")

    if totalDegreesRotated <= 0:
        print(
            f"ERROR: compass did not move({totalDegreesRotated}) in {COMPASS_CALIBRATION_ROTATE_SEC} secondsk rotating {direction}")
        return None

    return COMPASS_CALIBRATION_ROTATE_SEC / totalDegreesRotated


def testRotationCalibration(compassCalibration):
    print("testing rotation calibration...")
    headingStart = compass.get_heading()
    rotationTime = 360.0 * compassCalibration["minSecondsPerDegreeRight"]
    movement.rotate_right(movement.MIN_ROTATION_THROTTLE)
    time.sleep(rotationTime)
    movement.stop_moving()
    time.sleep(1)
    headingEnd = compass.get_heading()
    diff = compass.diff_degrees(headingStart, headingEnd)
    print(f"{headingStart} -> {headingEnd} = {diff}")
    return diff
