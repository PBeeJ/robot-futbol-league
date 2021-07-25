#!/usr/bin/env python3
import time
from adafruit_motorkit import MotorKit

MAX_THROTTLE = 1
MIN_THROTTLE = 0.6  # This is the minimum for my rig before the motors fail to move it

# these values are determined by the speed of the motors and the compass trigger time
#  see bot_commons/calibration
MAX_ROTATION_THROTTLE = 1
MIN_ROTATION_THROTTLE = 0.5

motors = MotorKit(0x70)

# The motors are are wired starting with the left front in
# couter-clockwise order.  So motor1 is the left front and motor4
# is the right front
rightMotors = [motors.motor4, motors.motor3]
leftMotors = [motors.motor1, motors.motor2]


def stop_moving():
    motors.motor1.throttle = 0
    motors.motor2.throttle = 0
    motors.motor3.throttle = 0
    motors.motor4.throttle = 0


def rotate_left(throttle=MAX_THROTTLE):
    for leftMotor in leftMotors:
        leftMotor.throttle = -1 * throttle
    for rightMotor in rightMotors:
        rightMotor.throttle = throttle


def rotate_right(throttle=MAX_THROTTLE):
    for leftMotor in leftMotors:
        leftMotor.throttle = throttle
    for rightMotor in rightMotors:
        rightMotor.throttle = -1 * throttle


def move_forward(throttle=MAX_THROTTLE):
    for motor in [*leftMotors, *rightMotors]:
        motor.throttle = throttle


def move_backward(throttle=MAX_THROTTLE):
    for motor in [*leftMotors, *rightMotors]:
        motor.throttle = -1 * throttle


def test_movement():
    for x in range(0, 10):
        rotate_left()
        time.sleep(1)
        rotate_right()
        time.sleep(1)
        stop_moving()
        time.sleep(.5)
        move_forward()
        time.sleep(1)
        move_backward()
        time.sleep(1)
